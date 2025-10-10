"""
Management command to create a test property with sample data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from properties.models import Property, PropertyType, PropertyStatus
from locations.models import Region, City, Area
from agents.models import AgentProfile
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a test property with sample data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='admin@property237.com',
            help='Email of the user to assign as property owner'
        )

    def handle(self, *args, **options):
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('Creating Test Property...'))
        self.stdout.write('='*70 + '\n')

        email = options['email']

        # Get or create user
        try:
            user = User.objects.get(email=email)
            self.stdout.write(self.style.SUCCESS(f'✓ Found user: {user.email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'✗ User with email {email} not found!'))
            self.stdout.write(self.style.WARNING('  Creating admin user...'))
            user = User.objects.create_superuser(
                email=email,
                password='Admin@123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Created admin user: {user.email}'))
            self.stdout.write(self.style.WARNING(f'  Password: Admin@123'))

        # Get or create agent profile
        agent_profile, created = AgentProfile.objects.get_or_create(
            user=user,
            defaults={
                'agency_name': 'Property237 Realty',
                'is_verified': True,
                'is_active': True,
                'license_number': 'AG-001-2025',
                'bio': 'Professional real estate agent with years of experience in Cameroon property market.'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created agent profile for {user.email}'))
        else:
            self.stdout.write(f'  - Agent profile already exists for {user.email}')

        # Ensure property types and statuses exist
        property_type, _ = PropertyType.objects.get_or_create(
            name='Apartment',
            defaults={
                'category': 'residential',
                'subtype': 'apartment',
                'description': 'Self-contained housing unit in a building',
                'is_active': True
            }
        )

        property_status, _ = PropertyStatus.objects.get_or_create(
            name='available',
            defaults={
                'description': 'Property is available for rent/sale',
                'is_active': True,
                'allows_inquiries': True
            }
        )

        # Get or create location data
        region, _ = Region.objects.get_or_create(
            name='Centre',
            defaults={
                'code': 'CE'
            }
        )

        city, _ = City.objects.get_or_create(
            name='Yaoundé',
            defaults={
                'region': region,
                'is_major': True
            }
        )

        area, _ = Area.objects.get_or_create(
            name='Bastos',
            defaults={
                'city': city,
                'area_type': 'neighborhood'
            }
        )

        self.stdout.write(self.style.SUCCESS(f'✓ Location: {area.name}, {city.name}, {region.name}'))

        # Create test property
        property_data = {
            'title': 'Modern 2-Bedroom Apartment in Bastos',
            'description': '''
Beautiful and spacious 2-bedroom apartment located in the prestigious Bastos neighborhood.

Features:
- 2 spacious bedrooms with built-in wardrobes
- Modern full-size kitchen
- 2 bathrooms (1 ensuite)
- Large living room with balcony
- Secure parking space
- 24/7 security
- Generator backup
- Hot water system
- AC pre-installed in all rooms

Perfect for families or professionals looking for comfort and security in a prime location.
Close to international schools, embassies, and shopping centers.
            '''.strip(),
            'property_type': property_type,
            'status': property_status,
            'listing_type': 'rent',
            'area': area,
            'distance_from_main_road': 200,
            'road_is_tarred': True,
            'vehicle_access': 'low_car',
            'no_of_bedrooms': 2,
            'no_of_living_rooms': 1,
            'no_of_bathrooms': 2,
            'no_of_kitchens': 1,
            'kitchen_type': 'full_size',
            'no_of_balconies': 1,
            'no_of_floors': 3,
            'floor_number': 2,
            'room_size': 120,
            'has_dressing_cupboard': True,
            'electricity_type': 'private_meter',
            'electricity_payment': 'prepaid',
            'water_type': 'camwater',
            'has_ac_preinstalled': True,
            'has_hot_water': True,
            'has_generator': True,
            'has_parking': True,
            'has_security': True,
            'has_pool': False,
            'has_gym': False,
            'has_elevator': True,
            'price': Decimal('250000'),
            'currency': 'XAF',
            'initial_months_payable': 3,
            'caution_months': 2,
            'visit_fee': Decimal('5000'),
            'requires_contract_registration': True,
            'agent': agent_profile,
            'agent_commission_percentage': Decimal('10.00'),
            'agent_commission_months': 1,
            'is_verified': True,
            'verified_by': user
        }

        # Check if property already exists
        existing_property = Property.objects.filter(
            title=property_data['title'],
            agent=agent_profile
        ).first()

        if existing_property:
            self.stdout.write(self.style.WARNING(f'\n⚠ Test property already exists: {existing_property.title}'))
            self.stdout.write(f'  ID: {existing_property.id}')
            self.stdout.write(f'  Price: {existing_property.price} {existing_property.currency}/month')
            self.stdout.write(f'  Location: {existing_property.area.name}')
        else:
            property_obj = Property.objects.create(**property_data)
            self.stdout.write(self.style.SUCCESS(f'\n✓ Created test property: {property_obj.title}'))
            self.stdout.write(f'  ID: {property_obj.id}')
            self.stdout.write(f'  Price: {property_obj.price} {property_obj.currency}/month')
            self.stdout.write(f'  Location: {property_obj.area.name}')
            self.stdout.write(f'  Bedrooms: {property_obj.no_of_bedrooms}')
            self.stdout.write(f'  Bathrooms: {property_obj.no_of_bathrooms}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✓ Test property creation complete!'))
        self.stdout.write('='*70 + '\n')
        self.stdout.write(self.style.SUCCESS('Next steps:'))
        self.stdout.write('  1. Log into Django admin')
        self.stdout.write('  2. Go to Properties section')
        self.stdout.write('  3. Add images to the test property')
        self.stdout.write('  4. Verify images are stored in /data/media on Render')
        self.stdout.write('\n')

