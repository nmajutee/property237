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
        self.url_endpoint = os.getenv('IMAGEKIT_URL_ENDPOINT').rstrip('/')

    def _save(self, name, content):
        """Save file to ImageKit"""
        try:
            # Read file content
            file_content = content.read()

            # Determine folder based on file path
            if 'property_images' in name or 'property' in name.lower():
                folder = "property_images"
            elif 'profile' in name.lower():
                folder = "profile_pics"
            else:
                folder = "media"

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

            result_url = getattr(result, 'url', None)
            result_file_path = getattr(result, 'file_path', None) or getattr(result, 'filePath', None)
            result_name = getattr(result, 'name', None)

            logger.info("✅ ImageKit upload successful!")
            logger.info(f"   📎 URL: {result_url}")
            logger.info(f"   🆔 File ID: {getattr(result, 'file_id', None)}")
            logger.info(f"   📁 Stored Path: {result_file_path}")
            logger.info(f"   📄 Stored Name: {result_name}")

            # Prefer ImageKit's returned file path so we can reconstruct the URL later
            stored_name = result_file_path or result_name or result_url

            if not stored_name:
                raise ValueError("ImageKit upload did not return a usable identifier for the file")

            # Normalise leading slashes
            if isinstance(stored_name, str):
                stored_name = stored_name.lstrip('/')

            return stored_name

        except Exception as e:
            logger.error(f"❌ ImageKit upload failed for {name}: {str(e)}")
            raise

    def url(self, name):
        """Return the URL for accessing the file"""
        if not name:
            return None

        if isinstance(name, str) and name.startswith('http'):
            return name

        normalized_name = name.lstrip('/') if isinstance(name, str) else name
        return f"{self.url_endpoint}/{normalized_name}"

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
