from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Notification, NotificationPreference, NotificationTemplate
from .serializers import (
    NotificationSerializer, NotificationCreateSerializer,
    NotificationPreferenceSerializer, NotificationTemplateSerializer
)


class NotificationListAPIView(generics.ListAPIView):
    """List notifications for the authenticated user"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(recipient=self.request.user).order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        notif_type = self.request.query_params.get('type')
        if notif_type:
            qs = qs.filter(notification_type=notif_type)
        return qs


class NotificationCreateAPIView(generics.CreateAPIView):
    """Send a notification"""
    serializer_class = NotificationCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        notification = serializer.save()
        # Dispatch asynchronously via Celery
        from .tasks import dispatch_notification
        dispatch_notification.delay(notification.id)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a single notification as read"""
    try:
        notif = Notification.objects.get(pk=pk, recipient=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    notif.mark_as_read()
    return Response({'message': 'Marked as read'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """Mark all notifications as read"""
    count = Notification.objects.filter(
        recipient=request.user, status__in=['pending', 'sent', 'delivered']
    ).update(status='read', read_at=timezone.now())
    return Response({'marked_read': count})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """Get unread notification count"""
    count = Notification.objects.filter(
        recipient=request.user
    ).exclude(status='read').count()
    return Response({'unread_count': count})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, pk):
    """Delete a notification"""
    try:
        notif = Notification.objects.get(pk=pk, recipient=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    notif.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationPreferenceAPIView(generics.RetrieveUpdateAPIView):
    """Get and update notification preferences"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        prefs, _ = NotificationPreference.objects.get_or_create(user=self.request.user)
        return prefs


class NotificationTemplateListAPIView(generics.ListAPIView):
    """List notification templates (admin use)"""
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]
    queryset = NotificationTemplate.objects.filter(is_active=True)
