from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import MediaFile
from .serializers import MediaFileSerializer


class MediaFileUploadAPIView(generics.CreateAPIView):
    """Upload media files (images, videos, documents)"""
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = self.request.user
        file_type = self.request.data.get('file_type', 'image')

        # Subscription enforcement for photo uploads
        if file_type == 'image' and user.user_type == 'agent':
            from tariffplans.models import UserSubscription
            active_sub = UserSubscription.objects.filter(
                user=user, status__in=['active', 'trial'],
            ).select_related('plan').first()

            if active_sub and active_sub.is_active:
                property_id = self.request.data.get('property')
                if property_id:
                    current_photos = MediaFile.objects.filter(
                        property_id=property_id, file_type='image', is_active=True,
                    ).count()
                    if current_photos >= active_sub.plan.max_photos_per_property:
                        from rest_framework.exceptions import PermissionDenied
                        raise PermissionDenied(
                            f"Your plan allows {active_sub.plan.max_photos_per_property} photos per property. "
                            f"Please upgrade to add more."
                        )

        serializer.save(uploaded_by=user)


class MediaFileListAPIView(generics.ListAPIView):
    """List media files for a property"""
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        property_id = self.kwargs.get('property_id')
        return MediaFile.objects.filter(
            property_id=property_id,
            is_active=True
        ).order_by('file_type', 'order')


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_media_file(request, file_id):
    """Delete a media file"""
    try:
        media_file = MediaFile.objects.get(
            id=file_id,
            uploaded_by=request.user
        )
        media_file.is_active = False
        media_file.save()
        return Response({'message': 'File deleted successfully'})
    except MediaFile.DoesNotExist:
        return Response(
            {'error': 'File not found or permission denied'},
            status=status.HTTP_404_NOT_FOUND
        )