from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status as http_status
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from properties.models import Property
from tenants.models import TenantApplication


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def agent_dashboard_stats(request):
    """Get dashboard statistics for agents"""
    user = request.user

    # Only agents can access this
    if not hasattr(user, 'agent_profile'):
        return Response({'error': 'Only agents can access analytics'}, status=403)

    agent = user.agent_profile

    # Get agent's properties
    properties = Property.objects.filter(agent=agent)

    # Calculate stats
    stats = {
        'total_properties': properties.count(),
        'active_properties': properties.filter(is_active=True).count(),
        'rented_properties': properties.filter(status__name='rented').count(),
        'available_properties': properties.filter(status__name='available', is_active=True).count(),
        'total_views': properties.aggregate(total=Sum('views_count'))['total'] or 0,
        'average_price': properties.aggregate(avg=Avg('price'))['avg'] or 0,

        # Applications stats
        'total_applications': TenantApplication.objects.filter(property__agent=agent).count(),
        'pending_applications': TenantApplication.objects.filter(
            property__agent=agent, status='submitted'
        ).count(),
        'approved_applications': TenantApplication.objects.filter(
            property__agent=agent, status='approved'
        ).count(),
    }

    # Recent activity (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    stats['new_properties_30d'] = properties.filter(created_at__gte=thirty_days_ago).count()
    stats['new_applications_30d'] = TenantApplication.objects.filter(
        property__agent=agent, created_at__gte=thirty_days_ago
    ).count()

    # Property by type breakdown
    property_types = properties.values('property_type__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    stats['properties_by_type'] = list(property_types)

    # Recent properties
    recent_properties = properties.order_by('-created_at')[:5].values(
        'id', 'title', 'price', 'views_count', 'created_at'
    )
    stats['recent_properties'] = list(recent_properties)

    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tenant_dashboard_stats(request):
    """Get dashboard statistics for tenants"""
    user = request.user

    # Only tenants can access this
    if not hasattr(user, 'tenant_profile'):
        return Response({'error': 'Only tenants can access analytics'}, status=403)

    tenant = user.tenant_profile

    # Get tenant's applications
    applications = TenantApplication.objects.filter(tenant=tenant)

    stats = {
        'total_applications': applications.count(),
        'pending_applications': applications.filter(status='submitted').count(),
        'approved_applications': applications.filter(status='approved').count(),
        'rejected_applications': applications.filter(status='rejected').count(),

        # Favorites count
        'favorite_properties': user.favorite_properties.count(),

        # Recent activity
        'recent_applications': applications.order_by('-created_at')[:5].values(
            'id', 'property__title', 'status', 'desired_move_in_date', 'created_at'
        )
    }

    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """Get dashboard statistics for admin users"""
    user = request.user

    if user.user_type != 'admin' and not user.is_staff:
        return Response({'error': 'Only admins can access this'}, status=403)

    from users.models import CustomUser
    from agents.models import AgentProfile
    from leases.models import LeaseAgreement
    from payment.models import Transaction

    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)

    total_users = CustomUser.objects.count()
    new_users_30d = CustomUser.objects.filter(date_joined__gte=thirty_days_ago).count()
    total_properties = Property.objects.count()
    new_properties_30d = Property.objects.filter(created_at__gte=thirty_days_ago).count()
    total_agents = AgentProfile.objects.count()
    total_applications = TenantApplication.objects.count()
    pending_applications = TenantApplication.objects.filter(status='submitted').count()

    # Revenue
    total_revenue = Transaction.objects.filter(
        status='completed'
    ).aggregate(total=Sum('amount'))['total'] or 0
    revenue_30d = Transaction.objects.filter(
        status='completed', created_at__gte=thirty_days_ago
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Recent users
    recent_users = list(CustomUser.objects.order_by('-date_joined')[:10].values(
        'id', 'first_name', 'last_name', 'email', 'user_type', 'date_joined', 'is_active'
    ))

    # Pending properties (unapproved)
    pending_properties = list(Property.objects.filter(
        is_active=False
    ).order_by('-created_at')[:10].values(
        'id', 'title', 'price', 'created_at'
    ))

    # Users by type
    users_by_type = list(CustomUser.objects.values('user_type').annotate(count=Count('id')))

    stats = {
        'total_users': total_users,
        'new_users_30d': new_users_30d,
        'total_properties': total_properties,
        'new_properties_30d': new_properties_30d,
        'total_agents': total_agents,
        'total_applications': total_applications,
        'pending_applications': pending_applications,
        'total_revenue': float(total_revenue),
        'revenue_30d': float(revenue_30d),
        'recent_users': recent_users,
        'pending_properties': pending_properties,
        'users_by_type': users_by_type,
    }

    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def property_stats(request, property_id):
    """Get statistics for a specific property"""
    try:
        property_obj = Property.objects.get(id=property_id)

        # Check permissions (only owner can see detailed stats)
        if not (hasattr(request.user, 'agent_profile') and
                property_obj.agent == request.user.agent_profile):
            return Response({'error': 'Permission denied'}, status=403)

        stats = {
            'views_count': property_obj.views_count,
            'applications_count': property_obj.tenant_applications.count(),
            'favorites_count': property_obj.favorited_by.count(),
            'viewings_count': property_obj.viewings.count() if hasattr(property_obj, 'viewings') else 0,

            # Application breakdown
            'applications_by_status': property_obj.tenant_applications.values('status').annotate(
                count=Count('id')
            ),
        }

        return Response(stats)

    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_inquiry(request, property_id):
    """Record an inquiry on a property."""
    from .models import PropertyInquiry, PropertyAnalytics
    from django.shortcuts import get_object_or_404

    prop = get_object_or_404(Property, id=property_id, is_active=True)

    inquiry_type = request.data.get('inquiry_type', 'message')
    message = request.data.get('message', '')

    inquiry = PropertyInquiry.objects.create(
        property=prop,
        user=request.user,
        inquiry_type=inquiry_type,
        message=message,
    )

    # Update PropertyAnalytics
    analytics, _ = PropertyAnalytics.objects.get_or_create(property=prop)
    analytics.total_inquiries += 1
    analytics.this_month_inquiries += 1
    analytics.save(update_fields=['total_inquiries', 'this_month_inquiries'])

    return Response({
        'id': inquiry.id,
        'message': 'Inquiry recorded',
    }, status=http_status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def property_view_timeline(request, property_id):
    """Get daily view counts for a property over the last N days."""
    from .models import PropertyViewEvent
    from django.shortcuts import get_object_or_404

    prop = get_object_or_404(Property, id=property_id)

    # Only property owner/agent can see detailed analytics
    if hasattr(request.user, 'agents_profile'):
        if prop.agent != request.user.agents_profile:
            return Response({'error': 'Permission denied'}, status=403)
    elif request.user.user_type != 'admin':
        return Response({'error': 'Permission denied'}, status=403)

    days = int(request.query_params.get('days', 30))
    days = min(days, 90)
    start_date = timezone.now() - timedelta(days=days)

    from django.db.models.functions import TruncDate
    daily_views = (
        PropertyViewEvent.objects.filter(
            property=prop, viewed_at__gte=start_date,
        )
        .annotate(date=TruncDate('viewed_at'))
        .values('date')
        .annotate(
            total=Count('id'),
            unique=Count('user', distinct=True),
        )
        .order_by('date')
    )

    return Response({
        'property_id': prop.id,
        'days': days,
        'timeline': list(daily_views),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def property_inquiry_timeline(request, property_id):
    """Get daily inquiry counts for a property."""
    from .models import PropertyInquiry
    from django.shortcuts import get_object_or_404

    prop = get_object_or_404(Property, id=property_id)

    if hasattr(request.user, 'agents_profile'):
        if prop.agent != request.user.agents_profile:
            return Response({'error': 'Permission denied'}, status=403)
    elif request.user.user_type != 'admin':
        return Response({'error': 'Permission denied'}, status=403)

    days = int(request.query_params.get('days', 30))
    days = min(days, 90)
    start_date = timezone.now() - timedelta(days=days)

    from django.db.models.functions import TruncDate
    daily_inquiries = (
        PropertyInquiry.objects.filter(
            property=prop, created_at__gte=start_date,
        )
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    # Breakdown by type
    type_breakdown = (
        PropertyInquiry.objects.filter(
            property=prop, created_at__gte=start_date,
        )
        .values('inquiry_type')
        .annotate(count=Count('id'))
    )

    return Response({
        'property_id': prop.id,
        'days': days,
        'timeline': list(daily_inquiries),
        'by_type': list(type_breakdown),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def agent_analytics_summary(request):
    """Comprehensive analytics for agent dashboard charts."""
    if not hasattr(request.user, 'agents_profile'):
        return Response({'error': 'Agents only'}, status=403)

    agent = request.user.agents_profile
    properties = Property.objects.filter(agent=agent)
    prop_ids = list(properties.values_list('id', flat=True))

    from .models import PropertyViewEvent, PropertyInquiry, PropertyAnalytics
    from django.db.models.functions import TruncDate

    days = int(request.query_params.get('days', 30))
    days = min(days, 90)
    start = timezone.now() - timedelta(days=days)

    # Daily views across all properties
    daily_views = (
        PropertyViewEvent.objects.filter(
            property_id__in=prop_ids, viewed_at__gte=start,
        )
        .annotate(date=TruncDate('viewed_at'))
        .values('date')
        .annotate(total=Count('id'), unique=Count('user', distinct=True))
        .order_by('date')
    )

    # Daily inquiries across all properties
    daily_inquiries = (
        PropertyInquiry.objects.filter(
            property_id__in=prop_ids, created_at__gte=start,
        )
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    # Per-property performance
    per_property = []
    for pa in PropertyAnalytics.objects.filter(property_id__in=prop_ids).select_related('property'):
        per_property.append({
            'id': pa.property.id,
            'title': pa.property.title,
            'slug': pa.property.slug,
            'total_views': pa.total_views,
            'unique_views': pa.unique_views,
            'total_inquiries': pa.total_inquiries,
            'conversion_rate': round(
                (pa.total_inquiries / pa.total_views * 100) if pa.total_views > 0 else 0, 2
            ),
        })

    # Totals
    total_views = sum(p['total_views'] for p in per_property) if per_property else 0
    total_inquiries = sum(p['total_inquiries'] for p in per_property) if per_property else 0

    return Response({
        'period_days': days,
        'total_views': total_views,
        'total_inquiries': total_inquiries,
        'conversion_rate': round(
            (total_inquiries / total_views * 100) if total_views > 0 else 0, 2
        ),
        'daily_views': list(daily_views),
        'daily_inquiries': list(daily_inquiries),
        'per_property': sorted(per_property, key=lambda x: x['total_views'], reverse=True),
    })
