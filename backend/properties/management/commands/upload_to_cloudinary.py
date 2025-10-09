"""
Management command to upload local images to Cloudinary
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from media.models import PropertyImage
import cloudinary
import cloudinary.uploader
import os


class Command(BaseCommand):
    help = 'Upload local images to Cloudinary'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without uploading',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        # Check if Cloudinary is configured - parse from CLOUDINARY_URL if available
        cloudinary_url = os.getenv('CLOUDINARY_URL')
        if cloudinary_url:
            import re
            match = re.match(r'cloudinary://([^:]+):([^@]+)@(.+)', cloudinary_url)
            if match:
                api_key = match.group(1)
                api_secret = match.group(2)
                cloud_name = match.group(3)
                # Configure cloudinary
                cloudinary.config(
                    cloud_name=cloud_name,
                    api_key=api_key,
                    api_secret=api_secret,
                    secure=True
                )
            else:
                cloud_name = None
        else:
            cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
        
        if not cloud_name:
            self.stdout.write(self.style.ERROR('Cloudinary not configured! Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME environment variable.'))
            return

        self.stdout.write(f"Cloudinary configured: {cloud_name}")

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No uploads will be made"))

        images = PropertyImage.objects.all()
        total = images.count()

        self.stdout.write(f"Found {total} property images to check")
        print()

        uploaded_count = 0
        skipped_count = 0
        error_count = 0

        for i, image in enumerate(images, 1):
            try:
                if not image.image:
                    self.stdout.write(f"[{i}/{total}] {image.property.title}: No image file - SKIP")
                    skipped_count += 1
                    continue

                url = str(image.image.url)

                # Check if already on Cloudinary
                if 'cloudinary' in url or 'res.cloudinary.com' in url:
                    self.stdout.write(f"[{i}/{total}] {image.property.title}: Already on Cloudinary - SKIP")
                    self.stdout.write(f"  URL: {url}")
                    skipped_count += 1
                    continue

                # Local file - needs upload
                self.stdout.write(f"[{i}/{total}] {image.property.title}: Local file detected")
                self.stdout.write(f"  Current: {url}")

                if not dry_run:
                    # Get the file path
                    file_path = image.image.path if hasattr(image.image, 'path') else None

                    if file_path and os.path.exists(file_path):
                        # Upload to Cloudinary
                        result = cloudinary.uploader.upload(
                            file_path,
                            folder="property_images",
                            use_filename=True,
                            unique_filename=True,
                            transformation=[
                                {'width': 2000, 'height': 2000, 'crop': 'limit'},
                                {'quality': 'auto'},
                                {'fetch_format': 'auto'}
                            ]
                        )

                        # Update the image field with Cloudinary URL
                        image.image = result['secure_url']
                        image.save()

                        self.stdout.write(self.style.SUCCESS(f"  ✓ Uploaded!"))
                        self.stdout.write(f"  New URL: {result['secure_url']}")
                        uploaded_count += 1
                    else:
                        self.stdout.write(self.style.WARNING(f"  ⚠ File not found on disk: {file_path}"))
                        self.stdout.write(self.style.WARNING(f"  Consider uploading this image manually"))
                        error_count += 1
                else:
                    self.stdout.write(self.style.WARNING(f"  Would upload to Cloudinary"))

                print()

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"[{i}/{total}] Error: {str(e)}"))
                error_count += 1
                print()

        # Summary
        self.stdout.write(self.style.SUCCESS(f"\n{'='*50}"))
        self.stdout.write(self.style.SUCCESS(f"Summary:"))
        self.stdout.write(f"  Total images: {total}")
        if not dry_run:
            self.stdout.write(self.style.SUCCESS(f"  ✓ Uploaded: {uploaded_count}"))
        self.stdout.write(f"  ⊘ Skipped (already on Cloudinary): {skipped_count}")
        if error_count > 0:
            self.stdout.write(self.style.WARNING(f"  ⚠ Errors: {error_count}"))

        if dry_run:
            self.stdout.write(self.style.WARNING(f"\nThis was a dry run. Use without --dry-run to actually upload images."))
        elif uploaded_count > 0:
            self.stdout.write(self.style.SUCCESS(f"\n✅ Successfully migrated images to Cloudinary!"))
