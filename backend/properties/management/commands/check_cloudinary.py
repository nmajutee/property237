"""
Management command to check Cloudinary configuration and storage status
"""
import os
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Check Cloudinary configuration and test connection'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('\n🔍 Checking Cloudinary Configuration...\n'))

        # Check environment variables
        cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
        api_key = os.getenv('CLOUDINARY_API_KEY')
        api_secret = os.getenv('CLOUDINARY_API_SECRET')

        self.stdout.write('1️⃣ Environment Variables:')
        if cloud_name:
            self.stdout.write(self.style.SUCCESS(f'  ✅ CLOUDINARY_CLOUD_NAME: {cloud_name}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ CLOUDINARY_CLOUD_NAME: Not set'))

        if api_key:
            # Mask the key for security
            masked_key = api_key[:4] + '...' + api_key[-4:] if len(api_key) > 8 else '***'
            self.stdout.write(self.style.SUCCESS(f'  ✅ CLOUDINARY_API_KEY: {masked_key}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ CLOUDINARY_API_KEY: Not set'))

        if api_secret:
            self.stdout.write(self.style.SUCCESS(f'  ✅ CLOUDINARY_API_SECRET: Set (hidden)'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ CLOUDINARY_API_SECRET: Not set'))

        # Check Django settings
        self.stdout.write('\n2️⃣ Django Settings:')
        default_storage = getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not set')
        self.stdout.write(f'  DEFAULT_FILE_STORAGE: {default_storage}')

        if 'cloudinary' in default_storage.lower():
            self.stdout.write(self.style.SUCCESS('  ✅ Using Cloudinary storage'))
        else:
            self.stdout.write(self.style.WARNING('  ⚠️  Not using Cloudinary storage'))

        # Check installed apps
        self.stdout.write('\n3️⃣ Installed Apps:')
        if 'cloudinary_storage' in settings.INSTALLED_APPS:
            self.stdout.write(self.style.SUCCESS('  ✅ cloudinary_storage installed'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ cloudinary_storage not in INSTALLED_APPS'))

        if 'cloudinary' in settings.INSTALLED_APPS:
            self.stdout.write(self.style.SUCCESS('  ✅ cloudinary installed'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ cloudinary not in INSTALLED_APPS'))

        # Test Cloudinary connection
        self.stdout.write('\n4️⃣ Testing Cloudinary Connection:')
        if cloud_name and api_key and api_secret:
            try:
                import cloudinary
                from cloudinary import api

                # Try to get account details
                result = api.ping()
                self.stdout.write(self.style.SUCCESS('  ✅ Successfully connected to Cloudinary!'))
                self.stdout.write(f'  Response: {result}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ❌ Connection failed: {str(e)}'))
        else:
            self.stdout.write(self.style.WARNING('  ⚠️  Skipped (missing credentials)'))

        # Summary
        self.stdout.write('\n' + '='*60)
        if cloud_name and api_key and api_secret and 'cloudinary' in default_storage.lower():
            self.stdout.write(self.style.SUCCESS('\n✅ Cloudinary is properly configured!'))
            self.stdout.write('\nImages will be stored at:')
            self.stdout.write(f'https://res.cloudinary.com/{cloud_name}/image/upload/...')
        else:
            self.stdout.write(self.style.ERROR('\n❌ Cloudinary is NOT properly configured'))
            self.stdout.write('\nRequired actions:')
            if not cloud_name:
                self.stdout.write('  1. Set CLOUDINARY_CLOUD_NAME in Render environment')
            if not api_key:
                self.stdout.write('  2. Set CLOUDINARY_API_KEY in Render environment')
            if not api_secret:
                self.stdout.write('  3. Set CLOUDINARY_API_SECRET in Render environment')
            if 'cloudinary' not in default_storage.lower():
                self.stdout.write('  4. Verify settings.py is using Cloudinary storage')

        self.stdout.write('='*60 + '\n')
