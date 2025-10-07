from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
