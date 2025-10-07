"""
Management command to populate property types and statuses
"""
from django.core.management.base import BaseCommand
from properties.models import PropertyType, PropertyStatus


class Command(BaseCommand):
    help = 'Populate property types and statuses with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Populating Property Types and Statuses...\n')

        # Property Types
        property_types = [
            {
                'name': 'Apartment',
                'category': 'residential',
                'subtype': 'apartment',
                'description': 'Self-contained housing unit in a building'
            },
            {
                'name': 'Studio',
                'category': 'residential',
                'subtype': 'studio',
                'description': 'Single-room apartment with combined living/sleeping space'
            },
            {
                'name': 'Chambre Modern',
                'category': 'residential',
                'subtype': 'chambre_modern',
                'description': 'Modern room with private facilities'
            },
            {
                'name': 'Bungalow',
                'category': 'residential',
                'subtype': 'bungalow',
                'description': 'Single-story detached house'
            },
            {
                'name': 'Villa/Duplex',
                'category': 'residential',
                'subtype': 'villa_duplex',
                'description': 'Luxury home with multiple levels'
            },
            {
                'name': 'Guest House',
                'category': 'residential',
                'subtype': 'guest_house',
                'description': 'Short-term accommodation facility'
            },
            {
                'name': 'Land Plot',
                'category': 'residential',
                'subtype': 'land_plot',
                'description': 'Vacant land for development'
            },
            {
                'name': 'Office',
                'category': 'commercial',
                'subtype': 'office',
                'description': 'Commercial office space'
            },
            {
                'name': 'Shop/Store',
                'category': 'commercial',
                'subtype': 'shop',
                'description': 'Retail commercial space'
            },
            {
                'name': 'Warehouse',
                'category': 'commercial',
                'subtype': 'warehouse',
                'description': 'Storage and distribution facility'
            },
            {
                'name': 'Commercial Land',
                'category': 'commercial',
                'subtype': 'commercial_land',
                'description': 'Land zoned for commercial use'
            },
            {
                'name': 'Industrial Space',
                'category': 'commercial',
                'subtype': 'industrial',
                'description': 'Manufacturing or industrial facility'
            },
        ]

        types_created = 0
        for pt_data in property_types:
            pt, created = PropertyType.objects.get_or_create(
                name=pt_data['name'],
                defaults={
                    'category': pt_data['category'],
                    'subtype': pt_data['subtype'],
                    'description': pt_data['description'],
                    'is_active': True
                }
            )
            if created:
                types_created += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created Property Type: {pt.name}'))
            else:
                self.stdout.write(f'  - Property Type already exists: {pt.name}')

        # Property Statuses
        property_statuses = [
            {
                'name': 'draft',
                'description': 'Property listing is in draft mode',
                'allows_inquiries': False
            },
            {
                'name': 'published',
                'description': 'Property listing is published but status unknown',
                'allows_inquiries': True
            },
            {
                'name': 'available',
                'description': 'Property is available for rent/sale',
                'allows_inquiries': True
            },
            {
                'name': 'under_offer',
                'description': 'Property has an offer under consideration',
                'allows_inquiries': True
            },
            {
                'name': 'pending',
                'description': 'Transaction is pending completion',
                'allows_inquiries': False
            },
            {
                'name': 'sold',
                'description': 'Property has been sold',
                'allows_inquiries': False
            },
            {
                'name': 'rented',
                'description': 'Property is currently rented',
                'allows_inquiries': False
            },
            {
                'name': 'withdrawn',
                'description': 'Property listing has been withdrawn',
                'allows_inquiries': False
            },
        ]

        statuses_created = 0
        for ps_data in property_statuses:
            ps, created = PropertyStatus.objects.get_or_create(
                name=ps_data['name'],
                defaults={
                    'description': ps_data['description'],
                    'allows_inquiries': ps_data['allows_inquiries'],
                    'is_active': True
                }
            )
            if created:
                statuses_created += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created Property Status: {ps.get_name_display()}'))
            else:
                self.stdout.write(f'  - Property Status already exists: {ps.get_name_display()}')

        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(f'✓ Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Property Types Created: {types_created}'))
        self.stdout.write(self.style.SUCCESS(f'  Property Statuses Created: {statuses_created}'))
        self.stdout.write(self.style.SUCCESS(f'  Total Property Types: {PropertyType.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'  Total Property Statuses: {PropertyStatus.objects.count()}'))
        self.stdout.write('='*60 + '\n')

        self.stdout.write(self.style.SUCCESS('✓ Property data population complete!'))
