"""
Management command to seed all initial data
"""
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Seed all initial data (property types, statuses, locations)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('Starting full database seeding...'))
        self.stdout.write(self.style.SUCCESS('=' * 70))

        try:
            # Seed property data
            self.stdout.write('\n1. Populating property types and statuses...')
            call_command('populate_property_data')

            # Seed location data
            self.stdout.write('\n2. Populating Cameroon locations...')
            call_command('populate_cameroon_locations')

            self.stdout.write('\n' + '=' * 70)
            self.stdout.write(self.style.SUCCESS('✅ ALL DATA SEEDED SUCCESSFULLY!'))
            self.stdout.write(self.style.SUCCESS('=' * 70))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error during seeding: {str(e)}'))
            raise
