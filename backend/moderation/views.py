from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from .models import Report, ModerationAction, ListingAutoCheck
from .serializers import (
    ReportSerializer, ReportCreateSerializer,
    ModerationActionSerializer, ListingAutoCheckSerializer,
)


# ---------- User-facing: submit reports ----------

class ReportCreateAPIView(generics.CreateAPIView):
    """Submit a report against a property, agent, or user."""
    serializer_class = ReportCreateSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reports(request):
    """List reports filed by the current user."""
    reports = Report.objects.filter(
        reporter=request.user
    ).select_related('reporter', 'reviewed_by', 'content_type')
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)


# ---------- Admin: manage reports ----------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_list(request):
    """List all reports (admin only). Filter by ?status=pending."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    qs = Report.objects.select_related('reporter', 'reviewed_by', 'content_type').all()
    status_filter = request.query_params.get('status')
    if status_filter:
        qs = qs.filter(status=status_filter)
    serializer = ReportSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_detail(request, pk):
    """Get report details (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    report = get_object_or_404(Report, pk=pk)
    serializer = ReportSerializer(report)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_report(request, pk):
    """Resolve a report with a resolution action (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    report = get_object_or_404(Report, pk=pk)
    resolution = request.data.get('resolution', 'no_action')
    notes = request.data.get('resolution_notes', '')

    report.status = 'resolved'
    report.resolution = resolution
    report.resolution_notes = notes
    report.reviewed_by = request.user
    report.reviewed_at = timezone.now()
    report.save()

    # Log the moderation action
    ModerationAction.objects.create(
        moderator=request.user,
        action_type='report_resolved',
        reason=notes,
        content_type=report.content_type,
        object_id=report.object_id,
        report=report,
        metadata={'resolution': resolution},
    )

    # Execute resolution action
    _execute_resolution(report, request.user)

    return Response({'message': 'Report resolved', 'resolution': resolution})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dismiss_report(request, pk):
    """Dismiss a report (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    report = get_object_or_404(Report, pk=pk)
    report.status = 'dismissed'
    report.reviewed_by = request.user
    report.reviewed_at = timezone.now()
    report.resolution_notes = request.data.get('reason', '')
    report.save()

    ModerationAction.objects.create(
        moderator=request.user,
        action_type='report_dismissed',
        reason=report.resolution_notes,
        content_type=report.content_type,
        object_id=report.object_id,
        report=report,
    )

    return Response({'message': 'Report dismissed'})


# ---------- Admin: audit log ----------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def moderation_log(request):
    """View moderation audit log (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    qs = ModerationAction.objects.select_related(
        'moderator', 'content_type', 'report'
    ).all()

    action_type = request.query_params.get('action_type')
    if action_type:
        qs = qs.filter(action_type=action_type)

    # Paginate
    page_size = 50
    page = int(request.query_params.get('page', 1))
    start = (page - 1) * page_size
    end = start + page_size

    serializer = ModerationActionSerializer(qs[start:end], many=True)
    return Response({
        'count': qs.count(),
        'results': serializer.data,
    })


# ---------- Admin: listing auto-checks ----------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listing_checks(request, property_id):
    """Get auto-check results for a listing (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    checks = ListingAutoCheck.objects.filter(property_id=property_id)
    serializer = ListingAutoCheckSerializer(checks, many=True)
    return Response(serializer.data)


# ---------- Duplicate detection ----------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_duplicates(request):
    """Check for potential duplicate listings (admin only)."""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    from properties.models import Property
    from django.db.models import Q

    # Find properties with similar titles in the same area/price range
    duplicates = []
    recent = Property.objects.filter(
        is_active=True,
        created_at__gte=timezone.now() - timezone.timedelta(days=30),
    ).select_related('area__city', 'property_type').order_by('-created_at')

    checked_ids = set()
    for prop in recent:
        if prop.id in checked_ids:
            continue

        # Find similar: same area + similar price (±20%) + same listing type
        price_low = float(prop.price) * 0.8
        price_high = float(prop.price) * 1.2

        similar = Property.objects.filter(
            area=prop.area,
            listing_type=prop.listing_type,
            price__gte=price_low,
            price__lte=price_high,
            is_active=True,
        ).exclude(id=prop.id).exclude(id__in=checked_ids)

        # Also check title similarity
        title_words = set(prop.title.lower().split())
        for s in similar:
            s_words = set(s.title.lower().split())
            overlap = len(title_words & s_words)
            total = max(len(title_words), len(s_words), 1)
            similarity = overlap / total

            if similarity >= 0.5 or (prop.area_id == s.area_id and prop.no_of_bedrooms == s.no_of_bedrooms):
                duplicates.append({
                    'property_1': {
                        'id': prop.id,
                        'title': prop.title,
                        'slug': prop.slug,
                        'price': str(prop.price),
                        'area': prop.area.name,
                    },
                    'property_2': {
                        'id': s.id,
                        'title': s.title,
                        'slug': s.slug,
                        'price': str(s.price),
                        'area': s.area.name,
                    },
                    'similarity_score': round(similarity, 2),
                })
                checked_ids.add(s.id)

        checked_ids.add(prop.id)

    return Response({
        'count': len(duplicates),
        'duplicates': duplicates,
    })


# ---------- Helper functions ----------

def _execute_resolution(report, admin_user):
    """Execute the resolution action on the target object."""
    resolution = report.resolution

    if resolution == 'listing_removed':
        if report.content_type.model == 'property':
            from properties.models import Property
            try:
                prop = Property.objects.get(id=report.object_id)
                prop.is_active = False
                prop.save(update_fields=['is_active'])
            except Property.DoesNotExist:
                pass

    elif resolution == 'user_suspended':
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            if report.content_type.model == 'customuser':
                user = User.objects.get(id=report.object_id)
            elif report.content_type.model == 'agentprofile':
                from agents.models import AgentProfile
                agent = AgentProfile.objects.get(id=report.object_id)
                user = agent.user
            else:
                return
            user.is_suspended = True
            user.suspension_reason = f"Report #{report.id}: {report.resolution_notes}"
            user.save(update_fields=['is_suspended', 'suspension_reason'])
        except Exception:
            pass

    elif resolution == 'agent_unverified':
        if report.content_type.model == 'agentprofile':
            from agents.models import AgentProfile
            try:
                agent = AgentProfile.objects.get(id=report.object_id)
                agent.is_verified = False
                agent.save(update_fields=['is_verified'])
            except AgentProfile.DoesNotExist:
                pass


def log_moderation_action(moderator, action_type, target_obj, reason='', report=None, metadata=None):
    """Helper to create a ModerationAction entry."""
    ct = ContentType.objects.get_for_model(target_obj)
    return ModerationAction.objects.create(
        moderator=moderator,
        action_type=action_type,
        reason=reason,
        content_type=ct,
        object_id=target_obj.pk,
        report=report,
        metadata=metadata or {},
    )
