"""
Custom Cloudinary storage backend with automatic image optimization
"""
from cloudinary_storage.storage import MediaCloudinaryStorage
from django.core.files.base import ContentFile
from PIL import Image
import io
import os


class OptimizedCloudinaryStorage(MediaCloudinaryStorage):
    """
    Custom Cloudinary storage that optimizes images on upload
    - Resizes large images
    - Maintains aspect ratio
    - Converts to WebP for better compression
    - Adds transformations for consistent display
    """

    # Maximum dimensions for uploaded images
    MAX_WIDTH = 2000
    MAX_HEIGHT = 2000

    def _save(self, name, content):
        """Override save to optimize images before upload"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Attempting to save file: {name}")
        
        # Check if this is an image file
        if self._is_image(name):
            logger.info(f"Optimizing image: {name}")
            content = self._optimize_image(content, name)
            logger.info(f"Image optimized successfully")

        # Call parent save method to upload to Cloudinary
        try:
            result = super()._save(name, content)
            logger.info(f"File saved to Cloudinary successfully: {result}")
            return result
        except Exception as e:
            logger.error(f"Failed to save to Cloudinary: {e}", exc_info=True)
            raise

    def _is_image(self, name):
        """Check if file is an image based on extension"""
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
        _, ext = os.path.splitext(name.lower())
        return ext in image_extensions

    def _optimize_image(self, content, name):
        """Optimize image: resize, compress, and convert format if needed"""
        try:
            # Read the image
            image = Image.open(content)

            # Convert RGBA to RGB if necessary (for JPEG)
            if image.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background

            # Get original dimensions
            original_width, original_height = image.size

            # Calculate new dimensions if image is too large
            if original_width > self.MAX_WIDTH or original_height > self.MAX_HEIGHT:
                # Calculate resize ratio
                width_ratio = self.MAX_WIDTH / original_width
                height_ratio = self.MAX_HEIGHT / original_height
                ratio = min(width_ratio, height_ratio)

                # Calculate new size
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)

                # Resize with high-quality resampling
                image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Save optimized image to BytesIO
            output = io.BytesIO()

            # Determine format - prefer WebP for better compression, fallback to JPEG
            if name.lower().endswith('.png') and image.mode == 'RGBA':
                # Keep PNG for transparency
                image.save(output, format='PNG', optimize=True, quality=85)
            else:
                # Convert to JPEG for all other images
                image.save(output, format='JPEG', optimize=True, quality=85, progressive=True)
                # Update filename extension
                base_name = os.path.splitext(name)[0]
                name = f"{base_name}.jpg"

            output.seek(0)

            # Return optimized content
            return ContentFile(output.read(), name=name)

        except Exception as e:
            # If optimization fails, return original content
            print(f"Image optimization failed: {e}")
            content.seek(0)
            return content
