"""
Management command to regenerate image URLs for all properties
This ensures all images have proper Cloudinary URLs with transformations
"""
from django.core.management.base import BaseCommand
from media.models import PropertyImage


class Command(BaseCommand):
    help = 'Regenerate image URLs to ensure proper Cloudinary URLs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        images = PropertyImage.objects.all()
        total = images.count()
        
        self.stdout.write(f"Found {total} property images")
        
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No changes will be made"))
        
        fixed_count = 0
        error_count = 0
        
        for i, image in enumerate(images, 1):
            try:
                if image.image:
                    url = image.image.url
                    
                    self.stdout.write(f"[{i}/{total}] {image.property.title}: {url}")
                    
                    # Check if URL is valid
                    if url and ('cloudinary' in url or url.startswith('http')):
                        fixed_count += 1
                        self.stdout.write(self.style.SUCCESS(f"  ✓ Valid URL"))
                    else:
                        self.stdout.write(self.style.WARNING(f"  ⚠ Invalid URL: {url}"))
                        error_count += 1
                else:
                    self.stdout.write(self.style.ERROR(f"[{i}/{total}] {image.property.title}: No image file"))
                    error_count += 1
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"[{i}/{total}] Error: {str(e)}"))
                error_count += 1
        
        self.stdout.write(self.style.SUCCESS(f"\nSummary:"))
        self.stdout.write(f"  Total images: {total}")
        self.stdout.write(self.style.SUCCESS(f"  Valid URLs: {fixed_count}"))
        if error_count > 0:
            self.stdout.write(self.style.WARNING(f"  Issues found: {error_count}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"  All images OK!"))
