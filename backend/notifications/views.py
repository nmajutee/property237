from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Notification, NotificationPreference, NotificationTemplate, FCMDevice
from .serializers import (
    NotificationSerializer, NotificationCreateSerializer,
    NotificationPreferenceSerializer, NotificationTemplateSerializer
)


class NotificationListAPIView(generics.ListAPIView):
    """List notifications for the authenticated user"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(
            recipient=self.request.user
        ).select_related('sender', 'content_type').order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        notif_type = self.request.query_params.get('type')
        if notif_type:
            qs = qs.filter(notification_type=notif_type)
        return qs


class NotificationCreateAPIView(generics.CreateAPIView):
    """Send a notification (admin/staff only)"""
    serializer_class = NotificationCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only staff can create notifications for other users.')
        notification = serializer.save()
        # Dispatch asynchronously via Celery
        from .tasks import dispatch_notification
        dispatch_notification.delay(notification.id)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_detail(request, pk):
    """Get a single notification"""
    try:
        notif = Notification.objects.get(pk=pk, recipient=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(NotificationSerializer(notif).data)


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
    """List notification templates (admin only)"""
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return NotificationTemplate.objects.none()
        return NotificationTemplate.objects.filter(is_active=True)
    queryset = NotificationTemplate.objects.filter(is_active=True)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_fcm_device(request):
    """Register or update an FCM device token for push notifications."""
    token = request.data.get('token', '').strip()
    device_type = request.data.get('device_type', 'web')
    if not token:
        return Response({'error': 'token is required'}, status=status.HTTP_400_BAD_REQUEST)
    if device_type not in ('web', 'android', 'ios'):
        device_type = 'web'

    device, created = FCMDevice.objects.update_or_create(
        registration_id=token,
        defaults={'user': request.user, 'device_type': device_type, 'is_active': True},
    )
    return Response({
        'id': device.id,
        'device_type': device.device_type,
        'created': created,
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unregister_fcm_device(request):
    """Remove an FCM device token."""
    token = request.data.get('token', '').strip()
    if not token:
        return Response({'error': 'token is required'}, status=status.HTTP_400_BAD_REQUEST)
    FCMDevice.objects.filter(registration_id=token, user=request.user).delete()
    return Response({'success': True})
