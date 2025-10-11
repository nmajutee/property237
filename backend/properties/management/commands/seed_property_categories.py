"""
Management command to seed property categories, states, and tags
Run with: python manage.py seed_property_categories
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from properties.category_models import Category, PropertyState, PropertyTag


class Command(BaseCommand):
    help = 'Seed property categories, subcategories, states, and tags'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            PropertyTag.objects.all().delete()
            PropertyState.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared'))

        with transaction.atomic():
            self.seed_categories()
            self.seed_states()
            self.seed_tags()

        self.stdout.write(self.style.SUCCESS('\n✓ All data seeded successfully!'))

    def seed_categories(self):
        """Seed parent categories and subcategories - Cameroon-Specific"""
        self.stdout.write('\nSeeding Cameroon-Specific Categories...')

        # Define parent categories with subcategories (Cameroon Real Estate Market)
        categories_data = {
            'RESIDENTIAL': {
                'name': 'Residential',
                'description': 'Homes, apartments, and living spaces across Cameroon',
                'icon': 'home',
                'subcategories': [
                    ('Apartment', 'Multi-unit residential buildings'),
                    ('Studio', 'Single-room living spaces with kitchenette'),
                    ('Room', 'Single furnished or unfurnished rooms (Chambre)'),
                    ('Selfcontain', 'Self-contained rooms with private bathroom'),
                    ('Duplex', 'Two-story residential units'),
                    ('Bungalow', 'Single-story detached houses'),
                    ('Villa', 'Luxury residential properties'),
                    ('Hostel', 'Shared accommodations for students'),
                    ('Guesthouse', 'Short-term accommodation facilities'),
                ]
            },
            'COMMERCIAL': {
                'name': 'Commercial',
                'description': 'Business and trade properties in Cameroon',
                'icon': 'briefcase',
                'subcategories': [
                    ('Office', 'Professional office spaces'),
                    ('Shop', 'Retail and boutique spaces'),
                    ('Warehouse', 'Storage and distribution facilities'),
                    ('Hotel', 'Hospitality properties'),
                    ('Hall', 'Event halls and conference centers'),
                    ('Restaurant', 'Food and beverage establishments'),
                ]
            },
            'LAND': {
                'name': 'Land',
                'description': 'Plots, farmland, and undeveloped land in Cameroon',
                'icon': 'map',
                'subcategories': [
                    ('Residentialplot', 'Land for residential development'),
                    ('Commercialplot', 'Land for commercial development'),
                    ('Farm', 'Agricultural land and farms'),
                    ('Industrialplot', 'Land for industrial use'),
                ]
            },
            'INVESTMENT': {
                'name': 'Investment',
                'description': 'Investment properties and developments in Cameroon',
                'icon': 'chart-bar',
                'subcategories': [
                    ('Estate', 'Housing estates and schemes'),
                    ('Block', 'Multi-unit apartment buildings for investment'),
                    ('Mixeduse', 'Combined residential/commercial developments'),
                    ('Factory', 'Manufacturing and production facilities'),
                ]
            },
        }

        parent_categories = {}
        
        # Create parent categories
        for code, data in categories_data.items():
            parent, created = Category.objects.get_or_create(
                code=code,
                defaults={
                    'name': data['name'],
                    'slug': code.lower(),
                    'description': data['description'],
                    'icon': data['icon'],
                    'parent': None,
                }
            )
            parent_categories[code] = parent
            status = '✓ Created' if created else '• Exists'
            self.stdout.write(f"  {status}: {parent.name}")

            # Create subcategories
            for order, (sub_name, sub_desc) in enumerate(data['subcategories'], start=1):
                sub, created = Category.objects.get_or_create(
                    name=sub_name,
                    parent=parent,
                    defaults={
                        'slug': f"{code.lower()}-{sub_name.lower().replace(' ', '-').replace('/', '-')}",
                        'description': sub_desc,
                        'order': order,
                    }
                )
                status = '  ✓' if created else '  •'
                self.stdout.write(f"    {status} {sub_name}")

        self.stdout.write(self.style.SUCCESS(f'✓ Created {Category.objects.count()} categories'))

    def seed_states(self):
        """Seed property states - Cameroon Real Estate Lifecycle"""
        self.stdout.write('\nSeeding Property States (Cameroon)...')

        states_data = [
            {
                'code': PropertyState.DRAFT,
                'name': 'Draft',
                'description': 'Property listing not yet published',
                'color': '#6B7280',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 1,
            },
            {
                'code': PropertyState.PENDING,
                'name': 'Pending',
                'description': 'Awaiting admin or agent approval',
                'color': '#F59E0B',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 2,
            },
            {
                'code': PropertyState.AVAILABLE,
                'name': 'Available',
                'description': 'Ready for sale or rent in Cameroon',
                'color': '#10B981',
                'allows_inquiries': True,
                'is_publicly_visible': True,
                'order': 3,
            },
            {
                'code': PropertyState.NEW,
                'name': 'New',
                'description': 'Recently listed property',
                'color': '#3B82F6',
                'allows_inquiries': True,
                'is_publicly_visible': True,
                'order': 4,
            },
            {
                'code': PropertyState.UNDEROFFER,
                'name': 'Under Offer',
                'description': 'Deal being negotiated',
                'color': '#F59E0B',
                'allows_inquiries': True,
                'is_publicly_visible': True,
                'order': 5,
            },
            {
                'code': PropertyState.RESERVED,
                'name': 'Reserved',
                'description': 'Booked by potential buyer/tenant',
                'color': '#8B5CF6',
                'allows_inquiries': False,
                'is_publicly_visible': True,
                'order': 6,
            },
            {
                'code': PropertyState.RENTED,
                'name': 'Rented',
                'description': 'Currently occupied by tenant',
                'color': '#EC4899',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 7,
            },
            {
                'code': PropertyState.SOLD,
                'name': 'Sold',
                'description': 'Sale completed',
                'color': '#EF4444',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 8,
            },
            {
                'code': PropertyState.CONSTRUCTION,
                'name': 'Under Construction',
                'description': 'Property being built',
                'color': '#F59E0B',
                'allows_inquiries': True,
                'is_publicly_visible': True,
                'order': 9,
            },
            {
                'code': PropertyState.OFFPLAN,
                'name': 'Off Plan',
                'description': 'Pre-construction sales',
                'color': '#8B5CF6',
                'allows_inquiries': True,
                'is_publicly_visible': True,
                'order': 10,
            },
            {
                'code': PropertyState.INACTIVE,
                'name': 'Inactive',
                'description': 'Temporarily hidden',
                'color': '#6B7280',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 11,
            },
            {
                'code': PropertyState.EXPIRED,
                'name': 'Expired',
                'description': 'Listing period ended',
                'color': '#9CA3AF',
                'allows_inquiries': False,
                'is_publicly_visible': False,
                'order': 12,
            },
        ]

        for state_data in states_data:
            state, created = PropertyState.objects.get_or_create(
                code=state_data['code'],
                defaults=state_data
            )
            status = '✓ Created' if created else '• Exists'
            self.stdout.write(f"  {status}: {state.name}")

        self.stdout.write(self.style.SUCCESS(f'✓ Created {PropertyState.objects.count()} states'))

    def seed_tags(self):
        """Seed property tags - Cameroon-Specific"""
        self.stdout.write('\nSeeding Property Tags (Cameroon)...')

        # Get categories for association
        residential = Category.objects.get(code='RESIDENTIAL')
        commercial = Category.objects.get(code='COMMERCIAL')
        land = Category.objects.get(code='LAND')
        investment = Category.objects.get(code='INVESTMENT')

        tags_data = [
            # Transaction type tags (Cameroon market)
            {
                'name': 'Sale',
                'description': 'Available for purchase',
                'color': '#10B981',
                'applies_to': [],  # All categories
                'order': 1,
            },
            {
                'name': 'Rent',
                'description': 'Available for rental',
                'color': '#3B82F6',
                'applies_to': [residential, commercial],
                'order': 2,
            },
            {
                'name': 'Lease',
                'description': 'Long-term rental agreement',
                'color': '#8B5CF6',
                'applies_to': [commercial, investment],
                'order': 3,
            },
            {
                'name': 'Negotiable',
                'description': 'Price open for discussion',
                'color': '#F59E0B',
                'applies_to': [],  # All categories
                'order': 4,
            },
            # Furnishing status (Cameroon properties)
            {
                'name': 'Furnished',
                'description': 'Includes furniture and appliances',
                'color': '#EC4899',
                'applies_to': [residential],
                'order': 5,
            },
            {
                'name': 'Unfurnished',
                'description': 'No furniture included',
                'color': '#6B7280',
                'applies_to': [residential, commercial],
                'order': 6,
            },
            # Condition tags
            {
                'name': 'Newbuild',
                'description': 'Newly constructed property',
                'color': '#10B981',
                'applies_to': [residential, commercial],
                'order': 7,
            },
            {
                'name': 'Renovated',
                'description': 'Recently upgraded or repaired',
                'color': '#3B82F6',
                'applies_to': [residential, commercial],
                'order': 8,
            },
        ]

        for tag_data in tags_data:
            applies_to = tag_data.pop('applies_to', [])
            tag, created = PropertyTag.objects.get_or_create(
                name=tag_data['name'],
                defaults=tag_data
            )
            
            if applies_to:
                tag.applies_to.set(applies_to)
            
            status = '✓ Created' if created else '• Exists'
            self.stdout.write(f"  {status}: {tag.name}")

        self.stdout.write(self.style.SUCCESS(f'✓ Created {PropertyTag.objects.count()} tags'))
