"""
Management command to fix property is_active status
"""
from django.core.management.base import BaseCommand
from properties.models import Property


class Command(BaseCommand):
    help = 'Fix properties that are incorrectly marked as unavailable'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Checking properties...'))

        # Get all properties with is_active=False
        inactive_properties = Property.objects.filter(is_active=False)
        count = inactive_properties.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('✅ All properties are already active!'))
            return

        self.stdout.write(f'Found {count} inactive properties:')
        for prop in inactive_properties:
            self.stdout.write(f'  - {prop.title} (ID: {prop.id}, Slug: {prop.slug})')

        # Update them to be active
        updated = inactive_properties.update(is_active=True)

        self.stdout.write(self.style.SUCCESS(f'✅ Updated {updated} properties to active status'))

        # Show summary
        total = Property.objects.count()
        active = Property.objects.filter(is_active=True).count()
        self.stdout.write(self.style.SUCCESS(f'\n📊 Summary:'))
        self.stdout.write(f'  Total properties: {total}')
        self.stdout.write(f'  Active: {active}')
        self.stdout.write(f'  Inactive: {total - active}')
