"""
ImageKit storage backend for Django
Handles image uploads to ImageKit.io with automatic optimization
"""
import os
import logging
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

logger = logging.getLogger(__name__)


class ImageKitStorage(Storage):
    """Custom storage backend for ImageKit.io"""

    def __init__(self):
        self.imagekit = ImageKit(
            private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
            public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
            url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT')
        )
        self.url_endpoint = os.getenv('IMAGEKIT_URL_ENDPOINT')

    def _save(self, name, content):
        """Save file to ImageKit"""
        try:
            # Read file content
            file_content = content.read()

            # Determine folder based on file path
            if 'property_images' in name or 'property' in name.lower():
                folder = "/property237/property_images"
            elif 'profile' in name.lower():
                folder = "/property237/profile_pics"
            else:
                folder = "/property237/media"

            # Upload to ImageKit
            logger.info(f"📤 Uploading {name} to ImageKit folder: {folder}")

            upload_options = UploadFileRequestOptions(
                use_unique_file_name=True,
                folder=folder,
                tags=['property237', 'auto-upload']
            )

            result = self.imagekit.upload_file(
                file=file_content,
                file_name=name,
                options=upload_options
            )

            logger.info(f"✅ ImageKit upload successful!")
            logger.info(f"   📎 URL: {result.url}")
            logger.info(f"   🆔 File ID: {result.file_id}")

            # Return the full URL (ImageKit provides complete URL)
            return result.url

        except Exception as e:
            logger.error(f"❌ ImageKit upload failed for {name}: {str(e)}")
            raise

    def url(self, name):
        """Return the URL for accessing the file"""
        if name and name.startswith('http'):
            return name
        # Construct ImageKit URL
        return f"{self.url_endpoint}/property_images/{name}"

    def exists(self, name):
        """Check if file exists (always return False to allow uploads)"""
        return False

    def delete(self, name):
        """Delete file from ImageKit"""
        try:
            self.imagekit.delete_file(file_id=name)
        except Exception as e:
            print(f"ImageKit delete error: {e}")

    def size(self, name):
        """Return file size"""
        return 0
