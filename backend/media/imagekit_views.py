"""
ImageKit upload views for Property237
Handles secure image/video uploads to ImageKit.io
"""
import os
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

logger = logging.getLogger(__name__)

# Initialize ImageKit
imagekit = ImageKit(
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
    public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
    url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT'),
)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_property_media(request):
    """
    Upload property images/videos to ImageKit
    
    Endpoint: POST /api/media/upload-property-media/
    Authentication: Required
    
    Body:
        - file: Image or video file
        - property_id (optional): Property ID for organization
    
    Returns:
        - url: ImageKit CDN URL
        - file_id: ImageKit file ID
        - name: File name
        - thumbnail_url: Thumbnail URL (for videos)
    """
    try:
        if not request.FILES.get('file'):
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        property_id = request.data.get('property_id', 'new')
        
        logger.info(f"📤 Uploading property media: {file.name}")
        logger.info(f"   User: {request.user.email}")
        logger.info(f"   Property ID: {property_id}")
        logger.info(f"   File size: {file.size} bytes")
        
        # Read file content
        file_content = file.read()
        
        # Upload to ImageKit
        upload_result = imagekit.upload_file(
            file=file_content,
            file_name=file.name,
            options=UploadFileRequestOptions(
                folder=f"/property237/property_images/{property_id}",
                use_unique_file_name=True,
                tags=['property237', 'property-media', f'user-{request.user.id}']
            )
        )
        
        logger.info(f"✅ Upload successful!")
        logger.info(f"   📎 URL: {upload_result.url}")
        logger.info(f"   🆔 File ID: {upload_result.file_id}")
        
        response_data = {
            'url': upload_result.url,
            'file_id': upload_result.file_id,
            'name': upload_result.name,
            'file_type': upload_result.file_type,
            'size': upload_result.size,
        }
        
        # Add thumbnail URL if available
        if hasattr(upload_result, 'thumbnail_url'):
            response_data['thumbnail_url'] = upload_result.thumbnail_url
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"❌ Upload failed: {str(e)}")
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """
    Upload user profile picture to ImageKit
    
    Endpoint: POST /api/media/upload-profile-picture/
    Authentication: Required
    
    Body:
        - file: Image file
    
    Returns:
        - url: ImageKit CDN URL
        - file_id: ImageKit file ID
        - name: File name
    """
    try:
        if not request.FILES.get('file'):
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        
        logger.info(f"📤 Uploading profile picture: {file.name}")
        logger.info(f"   User: {request.user.email}")
        
        # Read file content
        file_content = file.read()
        
        # Upload to ImageKit
        upload_result = imagekit.upload_file(
            file=file_content,
            file_name=file.name,
            options=UploadFileRequestOptions(
                folder=f"/property237/profile_pics/{request.user.id}",
                use_unique_file_name=True,
                tags=['property237', 'profile-picture', f'user-{request.user.id}']
            )
        )
        
        logger.info(f"✅ Profile picture uploaded!")
        logger.info(f"   📎 URL: {upload_result.url}")
        
        return Response({
            'url': upload_result.url,
            'file_id': upload_result.file_id,
            'name': upload_result.name,
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"❌ Profile picture upload failed: {str(e)}")
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_imagekit_auth_params(request):
    """
    Generate authentication parameters for client-side uploads
    
    Endpoint: GET /api/media/imagekit-auth/
    
    Returns:
        - signature: Authentication signature
        - expire: Expiration timestamp
        - token: Upload token
        - public_key: ImageKit public key
        - url_endpoint: ImageKit URL endpoint
    """
    try:
        # Generate authentication parameters
        auth_params = imagekit.get_authentication_parameters()
        
        return Response({
            'signature': auth_params['signature'],
            'expire': auth_params['expire'],
            'token': auth_params['token'],
            'public_key': os.getenv('IMAGEKIT_PUBLIC_KEY'),
            'url_endpoint': os.getenv('IMAGEKIT_URL_ENDPOINT'),
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Failed to generate auth params: {str(e)}")
        return Response(
            {'error': 'Failed to generate authentication parameters'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
