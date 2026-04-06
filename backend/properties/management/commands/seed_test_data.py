"""
Management command to seed comprehensive test data for Property237.
Creates users, agents, tenants, properties, applications, credits, plans, etc.
"""
import random
from datetime import timedelta
from decimal import Decimal

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = 'Seed comprehensive test data for browser testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('  Property237 — Seeding Test Data'))
        self.stdout.write(self.style.SUCCESS('=' * 70))

        # Step 1: Seed base data (types, statuses, locations, categories)
        self._seed_base_data()

        # Step 2: Create users
        self._seed_users()

        # Step 3: Create agent profiles
        self._seed_agents()

        # Step 4: Create properties
        self._seed_properties()

        # Step 5: Create tenant profiles & applications
        self._seed_tenants()

        # Step 6: Create credit packages & balances
        self._seed_credits()

        # Step 7: Create tariff plans & subscriptions
        self._seed_tariff_plans()

        # Step 8: Create payment methods & currencies
        self._seed_payments()

        # Step 9: Create maintenance categories & requests
        self._seed_maintenance()

        # Step 10: Create notifications
        self._seed_notifications()

        # Step 11: Create leases
        self._seed_leases()

        # Step 12: Create chat conversations
        self._seed_chats()

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('  ALL TEST DATA SEEDED SUCCESSFULLY!'))
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('  Test Accounts:'))
        self.stdout.write('    Admin:  admin@property237.com  / admin123456')
        self.stdout.write('    Agent1: agent1@property237.com / testpass123')
        self.stdout.write('    Agent2: agent2@property237.com / testpass123')
        self.stdout.write('    Agent3: agent3@property237.com / testpass123')
        self.stdout.write('    Tenant1: tenant1@property237.com / testpass123')
        self.stdout.write('    Tenant2: tenant2@property237.com / testpass123')
        self.stdout.write('    Tenant3: tenant3@property237.com / testpass123')
        self.stdout.write('')

    def _seed_base_data(self):
        self.stdout.write('\n1. Seeding base data (types, statuses, locations)...')
        try:
            call_command('populate_property_data', verbosity=0)
            self.stdout.write('   ✓ Property types & statuses')
        except Exception as e:
            self.stdout.write(f'   ⚠ Property types: {e}')

        try:
            call_command('populate_cameroon_locations', verbosity=0)
            self.stdout.write('   ✓ Cameroon locations')
        except Exception as e:
            self.stdout.write(f'   ⚠ Locations: {e}')

        try:
            call_command('seed_property_categories', verbosity=0)
            self.stdout.write('   ✓ Property categories')
        except Exception as e:
            self.stdout.write(f'   ⚠ Categories: {e}')

    def _seed_users(self):
        from users.models import CustomUser

        self.stdout.write('\n2. Creating users...')
        now = timezone.now()

        users_data = [
            {
                'email': 'admin@property237.com',
                'username': 'admin237',
                'first_name': 'Admin',
                'last_name': 'Property237',
                'phone_number': '+237670000001',
                'user_type': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'password': 'admin123456',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'agent1@property237.com',
                'username': 'agent_paul',
                'first_name': 'Paul',
                'last_name': 'Mbarga',
                'phone_number': '+237671000001',
                'user_type': 'agent',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'agent2@property237.com',
                'username': 'agent_marie',
                'first_name': 'Marie',
                'last_name': 'Nkomo',
                'phone_number': '+237672000002',
                'user_type': 'agent',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'agent3@property237.com',
                'username': 'agent_jean',
                'first_name': 'Jean',
                'last_name': 'Fotso',
                'phone_number': '+237673000003',
                'user_type': 'agent',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'tenant1@property237.com',
                'username': 'tenant_alice',
                'first_name': 'Alice',
                'last_name': 'Njoya',
                'phone_number': '+237674000001',
                'user_type': 'tenant',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'tenant2@property237.com',
                'username': 'tenant_bruno',
                'first_name': 'Bruno',
                'last_name': 'Tchana',
                'phone_number': '+237675000002',
                'user_type': 'tenant',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
            {
                'email': 'tenant3@property237.com',
                'username': 'tenant_carine',
                'first_name': 'Carine',
                'last_name': 'Ewane',
                'phone_number': '+237676000003',
                'user_type': 'tenant',
                'password': 'testpass123',
                'is_phone_verified': True,
                'is_email_verified': True,
            },
        ]

        self.users = {}
        for data in users_data:
            password = data.pop('password')
            user, created = CustomUser.objects.get_or_create(
                email=data['email'],
                defaults=data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f'   ✓ Created {user.user_type}: {user.email}')
            else:
                self.stdout.write(f'   - Exists: {user.email}')
            self.users[data['email']] = user

    def _seed_agents(self):
        from agents.models import AgentProfile
        from locations.models import Area

        self.stdout.write('\n3. Creating agent profiles...')

        areas = list(Area.objects.all()[:10])

        agents_data = [
            {
                'user': self.users['agent1@property237.com'],
                'bio': 'Experienced real estate agent specializing in residential properties in Yaoundé. Over 5 years of experience helping families find their dream homes in the capital.',
                'agency_name': 'Mbarga Immobilier',
                'specialization': 'residential',
                'years_experience': '5-10',
                'is_verified': True,
                'is_active': True,
                'total_sales': 24,
                'total_rentals': 67,
                'client_rating': Decimal('4.50'),
                'total_reviews': 15,
                'languages_spoken': 'French, English',
                'city': 'Yaoundé',
                'region': 'Centre',
            },
            {
                'user': self.users['agent2@property237.com'],
                'bio': 'Premium real estate consultant in Douala with expertise in commercial properties and luxury apartments. Trusted by businesses and expatriates.',
                'agency_name': 'Nkomo Properties',
                'specialization': 'commercial',
                'years_experience': '3-5',
                'is_verified': True,
                'is_active': True,
                'total_sales': 12,
                'total_rentals': 45,
                'client_rating': Decimal('4.80'),
                'total_reviews': 22,
                'languages_spoken': 'French, English, Pidgin',
                'city': 'Douala',
                'region': 'Littoral',
            },
            {
                'user': self.users['agent3@property237.com'],
                'bio': 'Land and investment specialist covering Buea and Limbe areas. Expert in land title verification and property investment opportunities in the Southwest.',
                'agency_name': 'Fotso Land Solutions',
                'specialization': 'land',
                'years_experience': '1-3',
                'is_verified': True,
                'is_active': True,
                'total_sales': 8,
                'total_rentals': 15,
                'client_rating': Decimal('4.20'),
                'total_reviews': 7,
                'languages_spoken': 'English, French',
                'city': 'Buea',
                'region': 'Southwest',
            },
        ]

        self.agents = {}
        for data in agents_data:
            agent, created = AgentProfile.objects.get_or_create(
                user=data['user'],
                defaults=data
            )
            if created and areas:
                agent.service_areas.set(random.sample(areas, min(3, len(areas))))
            self.stdout.write(f'   {"✓ Created" if created else "- Exists"}: {agent.user.get_full_name()}')
            self.agents[data['user'].email] = agent

    def _seed_properties(self):
        from properties.models import Property, PropertyType, PropertyStatus
        from locations.models import Area

        self.stdout.write('\n4. Creating properties...')

        # Get references
        try:
            type_apartment = PropertyType.objects.filter(name__icontains='apartment').first()
            type_house = PropertyType.objects.filter(name__icontains='house').first() or PropertyType.objects.filter(name__icontains='villa').first()
            type_studio = PropertyType.objects.filter(name__icontains='studio').first()
            type_office = PropertyType.objects.filter(name__icontains='office').first()
            type_shop = PropertyType.objects.filter(name__icontains='shop').first() or PropertyType.objects.filter(name__icontains='commercial').first()
            type_land = PropertyType.objects.filter(name__icontains='land').first()

            # Fallback: just use whatever types exist
            all_types = list(PropertyType.objects.filter(is_active=True))
            if not all_types:
                self.stdout.write(self.style.ERROR('   ✗ No property types found. Run seed_all first.'))
                return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'   ✗ Error getting property types: {e}'))
            return

        try:
            status_available = PropertyStatus.objects.filter(name__icontains='available').first()
            status_published = PropertyStatus.objects.filter(name__icontains='published').first()
            active_status = status_available or status_published or PropertyStatus.objects.filter(is_active=True).first()
        except Exception:
            active_status = PropertyStatus.objects.first()

        if not active_status:
            self.stdout.write(self.style.ERROR('   ✗ No property statuses found.'))
            return

        areas = list(Area.objects.all())
        if not areas:
            self.stdout.write(self.style.ERROR('   ✗ No areas found. Run populate_cameroon_locations first.'))
            return

        # Helper to pick type
        def pick_type(preferred, fallback_list):
            return preferred or (fallback_list[0] if fallback_list else all_types[0])

        agent1 = self.agents.get('agent1@property237.com')
        agent2 = self.agents.get('agent2@property237.com')
        agent3 = self.agents.get('agent3@property237.com')

        properties_data = [
            # === Agent 1 (Yaoundé — Residential) ===
            {
                'title': 'Modern 3-Bedroom Apartment in Bastos',
                'description': 'Beautiful modern apartment in the prestigious Bastos neighborhood. Features 3 spacious bedrooms, 2 bathrooms, a large living room, and a fully equipped kitchen. Located near embassies and international schools. Secure compound with 24/7 security, parking, and backup generator.',
                'property_type': pick_type(type_apartment, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent1,
                'price': Decimal('350000'),
                'no_of_bedrooms': 3,
                'no_of_bathrooms': 2,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'has_parking': True,
                'has_security': True,
                'has_generator': True,
                'has_ac_preinstalled': True,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 2,
                'caution_months': 2,
                'featured': True,
                'is_active': True,
                'views_count': 245,
            },
            {
                'title': 'Cozy Studio near University of Yaoundé',
                'description': 'Affordable studio apartment perfect for students and young professionals. Located just 5 minutes walk from the University of Yaoundé I campus. Includes private bathroom, kitchenette, and small balcony. Water and electricity included in the rent.',
                'property_type': pick_type(type_studio, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent1,
                'price': Decimal('45000'),
                'no_of_bedrooms': 1,
                'no_of_bathrooms': 1,
                'no_of_living_rooms': 0,
                'no_of_kitchens': 1,
                'electricity_type': 'shared_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 1,
                'caution_months': 1,
                'is_active': True,
                'views_count': 189,
            },
            {
                'title': 'Spacious 4-Bedroom Villa in Omnisport',
                'description': 'Luxurious villa in the quiet Omnisport neighborhood. 4 bedrooms, 3 bathrooms, large garden, swimming pool, and staff quarters. Perfect for families looking for comfort and space. Close to shopping centers, restaurants, and the Omnisport stadium.',
                'property_type': pick_type(type_house, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent1,
                'price': Decimal('800000'),
                'no_of_bedrooms': 4,
                'no_of_bathrooms': 3,
                'no_of_living_rooms': 2,
                'no_of_kitchens': 1,
                'no_of_balconies': 1,
                'has_parking': True,
                'has_security': True,
                'has_pool': True,
                'has_generator': True,
                'has_ac_preinstalled': True,
                'has_hot_water': True,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 3,
                'caution_months': 3,
                'featured': True,
                'is_active': True,
                'views_count': 412,
            },
            {
                'title': '2-Bedroom Apartment in Mvan',
                'description': 'Well-maintained apartment in the bustling Mvan area. Two bedrooms, living room, modern kitchen and bathroom. Close to public transport, markets, and schools. Ideal for small families or couples.',
                'property_type': pick_type(type_apartment, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent1,
                'price': Decimal('120000'),
                'no_of_bedrooms': 2,
                'no_of_bathrooms': 1,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 2,
                'caution_months': 1,
                'is_active': True,
                'views_count': 98,
            },
            # === Agent 2 (Douala — Commercial + Residential) ===
            {
                'title': 'Prime Office Space in Bonanjo Business District',
                'description': 'Professional office space in the heart of Douala business district. 150 sqm open-plan office with meeting room, reception area, and private bathroom. Air-conditioned with fiber optic internet ready. Ideal for businesses, law firms, and consultancy offices.',
                'property_type': pick_type(type_office, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent2,
                'price': Decimal('500000'),
                'no_of_bathrooms': 1,
                'no_of_living_rooms': 1,
                'has_parking': True,
                'has_security': True,
                'has_elevator': True,
                'has_ac_preinstalled': True,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'featured': True,
                'is_active': True,
                'views_count': 178,
            },
            {
                'title': 'Commercial Shop at Marché Central Douala',
                'description': 'Strategic commercial space near Douala central market. Ground floor with large frontage, storage room at the back. High foot traffic area perfect for retail, electronics, or clothing business.',
                'property_type': pick_type(type_shop, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent2,
                'price': Decimal('200000'),
                'no_of_bathrooms': 1,
                'electricity_type': 'shared_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'is_active': True,
                'views_count': 132,
            },
            {
                'title': 'Luxury 3-Bedroom Apartment in Bonapriso',
                'description': 'High-end apartment in the upscale Bonapriso neighborhood. Modern finishes, marble floors, European kitchen, walk-in closets. Building has elevator, underground parking, gym, and 24/7 concierge. Popular with expatriates and diplomats.',
                'property_type': pick_type(type_apartment, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent2,
                'price': Decimal('650000'),
                'no_of_bedrooms': 3,
                'no_of_bathrooms': 2,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'has_parking': True,
                'has_security': True,
                'has_elevator': True,
                'has_gym': True,
                'has_ac_preinstalled': True,
                'has_hot_water': True,
                'has_generator': True,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 3,
                'caution_months': 2,
                'featured': True,
                'is_active': True,
                'views_count': 367,
            },
            {
                'title': '2-Bedroom House in Akwa',
                'description': 'Comfortable 2-bedroom house in the vibrant Akwa district. Tiled floors, modern bathroom, small courtyard. Walking distance to restaurants, nightlife, and shopping. Good for young professionals.',
                'property_type': pick_type(type_house, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent2,
                'price': Decimal('150000'),
                'no_of_bedrooms': 2,
                'no_of_bathrooms': 1,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'initial_months_payable': 2,
                'caution_months': 1,
                'is_active': True,
                'views_count': 87,
            },
            # === Agent 3 (Buea/Limbe — Land + Houses) ===
            {
                'title': '500 sqm Land Plot in Buea Town',
                'description': 'Prime residential land in Buea town with all documents and land title ready. Flat terrain, road accessible, with electricity and water connections nearby. Perfect for building a family home with a view of Mount Cameroon.',
                'property_type': pick_type(type_land, all_types),
                'status': active_status,
                'listing_type': 'sale',
                'agent': agent3,
                'price': Decimal('8000000'),
                'land_size_sqm': Decimal('500.00'),
                'has_land_title': True,
                'land_title_type': 'global',
                'road_is_tarred': True,
                'vehicle_access': 'suv',
                'featured': True,
                'is_active': True,
                'views_count': 156,
            },
            {
                'title': '3-Bedroom Bungalow in Limbe',
                'description': 'Charming bungalow just 10 minutes from the beach in Limbe. 3 bedrooms, 2 bathrooms, spacious living area and covered terrace. Large garden with fruit trees. Perfect for a family or holiday home by the Atlantic coast.',
                'property_type': pick_type(type_house, all_types),
                'status': active_status,
                'listing_type': 'sale',
                'agent': agent3,
                'price': Decimal('25000000'),
                'no_of_bedrooms': 3,
                'no_of_bathrooms': 2,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'no_of_balconies': 1,
                'has_parking': True,
                'electricity_type': 'private_meter',
                'water_type': 'camwater',
                'road_is_tarred': True,
                'has_land_title': True,
                'is_active': True,
                'views_count': 203,
            },
            {
                'title': '1000 sqm Plot in Mile 17 Buea',
                'description': 'Large plot of land in the rapidly developing Mile 17 area. Suitable for residential or commercial development. Road frontage, gentle slope. Documents available for verification.',
                'property_type': pick_type(type_land, all_types),
                'status': active_status,
                'listing_type': 'sale',
                'agent': agent3,
                'price': Decimal('12000000'),
                'land_size_sqm': Decimal('1000.00'),
                'has_land_title': True,
                'land_title_type': 'extract',
                'vehicle_access': 'low_car',
                'is_active': True,
                'views_count': 74,
            },
            {
                'title': 'Modern 2-Bedroom Flat in Molyko',
                'description': 'Newly built 2-bedroom apartment in the university town of Molyko, Buea. Modern finishes, tiled floors throughout. Close to University of Buea and all amenities. Ideal for students, lecturers, or young couples.',
                'property_type': pick_type(type_apartment, all_types),
                'status': active_status,
                'listing_type': 'rent',
                'agent': agent3,
                'price': Decimal('75000'),
                'no_of_bedrooms': 2,
                'no_of_bathrooms': 1,
                'no_of_living_rooms': 1,
                'no_of_kitchens': 1,
                'electricity_type': 'shared_meter',
                'water_type': 'camwater',
                'initial_months_payable': 1,
                'caution_months': 1,
                'is_active': True,
                'views_count': 143,
            },
        ]

        self.properties = []
        for i, data in enumerate(properties_data):
            # Assign area from seeded locations
            area = areas[i % len(areas)]
            data['area'] = area

            prop, created = Property.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
            self.stdout.write(f'   {"✓ Created" if created else "- Exists"}: {prop.title[:50]}...')
            self.properties.append(prop)

    def _seed_tenants(self):
        from tenants.models import TenantProfile, TenantApplication

        self.stdout.write('\n5. Creating tenant profiles & applications...')

        tenants_data = [
            {
                'user': self.users['tenant1@property237.com'],
                'preferred_location': 'Yaoundé, Centre Region',
                'budget_min': Decimal('50000'),
                'budget_max': Decimal('300000'),
                'employment_status': 'employed',
                'monthly_income_range': '200000-500000',
                'marital_status': 'single',
                'is_verified': True,
            },
            {
                'user': self.users['tenant2@property237.com'],
                'preferred_location': 'Douala, Littoral Region',
                'budget_min': Decimal('100000'),
                'budget_max': Decimal('500000'),
                'employment_status': 'employed',
                'monthly_income_range': '500000-1000000',
                'marital_status': 'married',
                'number_of_dependents': 2,
                'is_verified': True,
            },
            {
                'user': self.users['tenant3@property237.com'],
                'preferred_location': 'Buea, Southwest Region',
                'budget_min': Decimal('30000'),
                'budget_max': Decimal('100000'),
                'employment_status': 'student',
                'monthly_income_range': 'below_100000',
                'marital_status': 'single',
                'is_verified': False,
            },
        ]

        self.tenants = {}
        for data in tenants_data:
            tenant, created = TenantProfile.objects.get_or_create(
                user=data['user'],
                defaults=data
            )
            self.stdout.write(f'   {"✓ Created" if created else "- Exists"}: {tenant.user.get_full_name()}')
            self.tenants[data['user'].email] = tenant

        # Create applications
        if self.properties:
            now = timezone.now()
            applications = [
                {
                    'tenant': self.tenants.get('tenant1@property237.com'),
                    'property': self.properties[0],
                    'status': 'approved',
                    'desired_move_in_date': (now + timedelta(days=30)).date(),
                    'lease_duration_months': 12,
                    'offered_rent': self.properties[0].price,
                    'cover_letter': 'I am a working professional looking for a comfortable apartment in Bastos. I have stable income and excellent references.',
                },
                {
                    'tenant': self.tenants.get('tenant1@property237.com'),
                    'property': self.properties[6],
                    'status': 'submitted',
                    'desired_move_in_date': (now + timedelta(days=45)).date(),
                    'lease_duration_months': 12,
                    'offered_rent': self.properties[6].price,
                    'cover_letter': 'Interested in this luxury apartment in Bonapriso for relocation.',
                },
                {
                    'tenant': self.tenants.get('tenant2@property237.com'),
                    'property': self.properties[4],
                    'status': 'under_review',
                    'desired_move_in_date': (now + timedelta(days=15)).date(),
                    'lease_duration_months': 24,
                    'offered_rent': self.properties[4].price,
                    'cover_letter': 'We need office space for our growing tech startup in Douala.',
                },
                {
                    'tenant': self.tenants.get('tenant3@property237.com'),
                    'property': self.properties[11],
                    'status': 'submitted',
                    'desired_move_in_date': (now + timedelta(days=20)).date(),
                    'lease_duration_months': 12,
                    'offered_rent': self.properties[11].price,
                    'cover_letter': 'University student looking for affordable housing near campus.',
                },
            ]

            for app_data in applications:
                if app_data['tenant'] and app_data['property']:
                    app, created = TenantApplication.objects.get_or_create(
                        tenant=app_data['tenant'],
                        property=app_data['property'],
                        defaults=app_data
                    )
                    self.stdout.write(f'   {"✓ App" if created else "- App"}: {app.tenant.user.first_name} → {app.property.title[:30]}... ({app.status})')

    def _seed_credits(self):
        from credits.models import CreditBalance, CreditPackage

        self.stdout.write('\n6. Creating credit packages & balances...')

        packages = [
            {'name': 'Starter', 'credits': 10, 'bonus_credits': 0, 'price': Decimal('2000'), 'currency': 'XAF', 'display_order': 1},
            {'name': 'Basic', 'credits': 25, 'bonus_credits': 3, 'price': Decimal('4500'), 'currency': 'XAF', 'display_order': 2},
            {'name': 'Popular', 'credits': 50, 'bonus_credits': 10, 'price': Decimal('8000'), 'currency': 'XAF', 'is_popular': True, 'display_order': 3},
            {'name': 'Premium', 'credits': 100, 'bonus_credits': 25, 'price': Decimal('14000'), 'currency': 'XAF', 'display_order': 4},
            {'name': 'Business', 'credits': 250, 'bonus_credits': 75, 'price': Decimal('30000'), 'currency': 'XAF', 'display_order': 5},
        ]

        for pkg_data in packages:
            pkg, created = CreditPackage.objects.get_or_create(
                name=pkg_data['name'],
                defaults=pkg_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} Package: {pkg.name} ({pkg.credits}+{pkg.bonus_credits} for {pkg.price} XAF)')

        # Give test users some credits
        credit_amounts = {
            'agent1@property237.com': Decimal('150.00'),
            'agent2@property237.com': Decimal('75.00'),
            'agent3@property237.com': Decimal('30.00'),
            'tenant1@property237.com': Decimal('50.00'),
            'tenant2@property237.com': Decimal('25.00'),
        }

        for email, amount in credit_amounts.items():
            user = self.users.get(email)
            if user:
                balance, created = CreditBalance.objects.get_or_create(
                    user=user,
                    defaults={'balance': amount, 'total_purchased': amount}
                )
                if not created and balance.balance == 0:
                    balance.balance = amount
                    balance.total_purchased = amount
                    balance.save()
                self.stdout.write(f'   ✓ {user.first_name}: {balance.balance} credits')

    def _seed_tariff_plans(self):
        from tariffplans.models import TariffCategory, TariffPlan, UserSubscription

        self.stdout.write('\n7. Creating tariff plans...')

        cat, _ = TariffCategory.objects.get_or_create(
            name='Agent Plans',
            defaults={
                'description': 'Subscription plans for real estate agents',
                'target_audience': 'agents',
            }
        )

        plans = [
            {
                'name': 'Free Plan',
                'slug': 'free-plan',
                'description': 'Get started with basic features. List up to 2 properties with 5 photos each.',
                'category': cat,
                'plan_type': 'free',
                'price': Decimal('0'),
                'billing_cycle': 'monthly',
                'max_properties': 2,
                'max_photos_per_property': 5,
                'trial_days': 0,
            },
            {
                'name': 'Basic Plan',
                'slug': 'basic-plan',
                'description': 'For new agents. List up to 10 properties with 10 photos each. Analytics and priority support.',
                'category': cat,
                'plan_type': 'basic',
                'price': Decimal('5000'),
                'billing_cycle': 'monthly',
                'max_properties': 10,
                'max_photos_per_property': 10,
                'trial_days': 7,
            },
            {
                'name': 'Standard Plan',
                'slug': 'standard-plan',
                'description': 'For growing agents. Up to 50 properties, 20 photos, featured listings, and advanced analytics.',
                'category': cat,
                'plan_type': 'standard',
                'price': Decimal('15000'),
                'billing_cycle': 'monthly',
                'max_properties': 50,
                'max_photos_per_property': 20,
                'trial_days': 14,
            },
            {
                'name': 'Premium Plan',
                'slug': 'premium-plan',
                'description': 'For top agents. Unlimited properties and photos, priority placement, dedicated support, and white-label options.',
                'category': cat,
                'plan_type': 'premium',
                'price': Decimal('35000'),
                'billing_cycle': 'monthly',
                'max_properties': 999,
                'max_photos_per_property': 50,
                'trial_days': 30,
            },
        ]

        for plan_data in plans:
            plan, created = TariffPlan.objects.get_or_create(
                slug=plan_data['slug'],
                defaults=plan_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} Plan: {plan.name} — {plan.price} XAF/mo')

        # Subscribe agents
        now = timezone.now()
        basic_plan = TariffPlan.objects.filter(slug='basic-plan').first()
        standard_plan = TariffPlan.objects.filter(slug='standard-plan').first()

        if basic_plan:
            for email in ['agent1@property237.com', 'agent3@property237.com']:
                user = self.users.get(email)
                if user:
                    sub, created = UserSubscription.objects.get_or_create(
                        user=user,
                        plan=basic_plan,
                        defaults={
                            'status': 'active',
                            'start_date': now.date(),
                            'end_date': (now + timedelta(days=30)).date(),
                            'amount_paid': basic_plan.price,
                            'auto_renew': True,
                        }
                    )
                    if created:
                        self.stdout.write(f'   ✓ Subscribed {user.first_name} → {basic_plan.name}')
        if standard_plan:
            user = self.users.get('agent2@property237.com')
            if user:
                sub, created = UserSubscription.objects.get_or_create(
                    user=user,
                    plan=standard_plan,
                    defaults={
                        'status': 'active',
                        'start_date': now.date(),
                        'end_date': (now + timedelta(days=30)).date(),
                        'amount_paid': standard_plan.price,
                        'auto_renew': True,
                    }
                )
                if created:
                    self.stdout.write(f'   ✓ Subscribed {user.first_name} → {standard_plan.name}')

    def _seed_payments(self):
        from payment.models import PaymentMethod, Currency

        self.stdout.write('\n8. Creating payment methods & currencies...')

        currencies = [
            {'code': 'XAF', 'name': 'Central African CFA Franc', 'symbol': 'FCFA', 'exchange_rate': Decimal('1.0'), 'is_base_currency': True},
            {'code': 'USD', 'name': 'US Dollar', 'symbol': '$', 'exchange_rate': Decimal('610.00')},
            {'code': 'EUR', 'name': 'Euro', 'symbol': '€', 'exchange_rate': Decimal('655.96')},
        ]

        for cur_data in currencies:
            cur, created = Currency.objects.get_or_create(code=cur_data['code'], defaults=cur_data)
            self.stdout.write(f'   {"✓" if created else "-"} Currency: {cur.code} ({cur.symbol})')

        methods = [
            {
                'name': 'MTN Mobile Money',
                'code': 'mtn_momo',
                'gateway_type': 'mtn_momo',
                'is_online': True,
                'is_active': True,
                'processing_fee_percentage': Decimal('1.50'),
                'min_amount': Decimal('100'),
                'max_amount': Decimal('5000000'),
            },
            {
                'name': 'Orange Money',
                'code': 'orange_money',
                'gateway_type': 'orange_money',
                'is_online': True,
                'is_active': True,
                'processing_fee_percentage': Decimal('1.50'),
                'min_amount': Decimal('100'),
                'max_amount': Decimal('5000000'),
            },
        ]

        for method_data in methods:
            method, created = PaymentMethod.objects.get_or_create(
                code=method_data['code'],
                defaults=method_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} Method: {method.name}')

    def _seed_maintenance(self):
        from maintenance.models import MaintenanceCategory, ServiceProvider

        self.stdout.write('\n9. Creating maintenance categories & providers...')

        categories = [
            {'name': 'Plumbing', 'is_emergency': False, 'estimated_completion_hours': 4},
            {'name': 'Electrical', 'is_emergency': True, 'estimated_completion_hours': 3},
            {'name': 'Painting', 'is_emergency': False, 'estimated_completion_hours': 8},
            {'name': 'Carpentry', 'is_emergency': False, 'estimated_completion_hours': 6},
            {'name': 'General Cleaning', 'is_emergency': False, 'estimated_completion_hours': 4},
            {'name': 'AC / Cooling', 'is_emergency': False, 'estimated_completion_hours': 3},
            {'name': 'Lock & Security', 'is_emergency': True, 'estimated_completion_hours': 2},
        ]

        for cat_data in categories:
            cat, created = MaintenanceCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} Category: {cat.name}')

        providers = [
            {'name': 'QuickFix Yaoundé', 'provider_type': 'plumber', 'phone_number': '+237670111111', 'email': 'quickfix@example.com', 'hourly_rate': Decimal('5000'), 'rating': Decimal('4.50')},
            {'name': 'ElectroPro Douala', 'provider_type': 'electrician', 'phone_number': '+237671222222', 'email': 'electropro@example.com', 'hourly_rate': Decimal('7500'), 'rating': Decimal('4.80')},
            {'name': 'PaintMasters CM', 'provider_type': 'painter', 'phone_number': '+237672333333', 'email': 'paintmasters@example.com', 'hourly_rate': Decimal('4000'), 'rating': Decimal('4.20')},
        ]

        for prov_data in providers:
            prov, created = ServiceProvider.objects.get_or_create(
                name=prov_data['name'],
                defaults=prov_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} Provider: {prov.name}')

    def _seed_notifications(self):
        from notifications.models import Notification

        self.stdout.write('\n10. Creating sample notifications...')

        now = timezone.now()
        notifications = [
            {
                'recipient': self.users['tenant1@property237.com'],
                'sender': self.users['agent1@property237.com'],
                'notification_type': 'in_app',
                'subject': 'Application Approved!',
                'message': 'Your application for "Modern 3-Bedroom Apartment in Bastos" has been approved. Please proceed to sign the contract.',
                'status': 'delivered',
                'priority': 'high',
            },
            {
                'recipient': self.users['tenant2@property237.com'],
                'sender': self.users['agent2@property237.com'],
                'notification_type': 'in_app',
                'subject': 'Application Under Review',
                'message': 'Your application for office space in Bonanjo is being reviewed. We will get back to you within 48 hours.',
                'status': 'delivered',
                'priority': 'normal',
            },
            {
                'recipient': self.users['agent1@property237.com'],
                'notification_type': 'in_app',
                'subject': 'New Application Received',
                'message': 'A new application has been submitted for your listing "Modern 3-Bedroom Apartment in Bastos".',
                'status': 'delivered',
                'priority': 'normal',
            },
            {
                'recipient': self.users['agent2@property237.com'],
                'notification_type': 'in_app',
                'subject': 'Property View Milestone',
                'message': 'Congratulations! Your listing "Luxury 3-Bedroom Apartment in Bonapriso" has reached 350+ views.',
                'status': 'sent',
                'priority': 'low',
            },
            {
                'recipient': self.users['tenant3@property237.com'],
                'sender': self.users['admin@property237.com'],
                'notification_type': 'in_app',
                'subject': 'Welcome to Property237!',
                'message': 'Welcome to Property237, Cameroon\'s premier real estate platform. Complete your profile to start finding your perfect home.',
                'status': 'delivered',
                'priority': 'normal',
            },
            {
                'recipient': self.users['agent3@property237.com'],
                'sender': self.users['admin@property237.com'],
                'notification_type': 'in_app',
                'subject': 'Verification Complete',
                'message': 'Your agent profile has been verified. You can now list properties and receive applications.',
                'status': 'read',
                'priority': 'high',
            },
        ]

        for notif_data in notifications:
            notif, created = Notification.objects.get_or_create(
                recipient=notif_data['recipient'],
                subject=notif_data['subject'],
                defaults=notif_data
            )
            self.stdout.write(f'   {"✓" if created else "-"} → {notif.recipient.first_name}: {notif.subject}')

    def _seed_leases(self):
        from leases.models import LeaseAgreement, RentSchedule
        from tenants.models import TenantApplication

        self.stdout.write('\n11. Creating leases...')

        # Create a lease for the approved application
        approved_apps = TenantApplication.objects.filter(status='approved')
        if not approved_apps.exists() or not self.properties:
            self.stdout.write('   - No approved applications for leases')
            return

        now = timezone.now()
        for app in approved_apps[:2]:
            try:
                lease, created = LeaseAgreement.objects.get_or_create(
                    rental_property=app.property,
                    tenant=app.tenant,
                    defaults={
                        'landlord': app.property.agent.user,
                        'agent': app.property.agent,
                        'start_date': (now + timedelta(days=30)).date(),
                        'end_date': (now + timedelta(days=395)).date(),
                        'rent_amount': app.property.price,
                        'currency': 'XAF',
                        'initial_months_payable': app.property.initial_months_payable or 1,
                        'security_deposit': app.property.price * (app.property.caution_months or 1),
                        'caution_months': app.property.caution_months or 1,
                        'status': 'pending_signature',
                    }
                )
                if created:
                    # Create rent schedule for 12 months
                    for month in range(12):
                        due = (now + timedelta(days=30 + month * 30)).date()
                        RentSchedule.objects.get_or_create(
                            lease=lease,
                            due_date=due,
                            defaults={
                                'amount': lease.rent_amount,
                                'is_paid': month == 0,
                                'paid_amount': lease.rent_amount if month == 0 else Decimal('0'),
                                'payment_date': due if month == 0 else None,
                            }
                        )
                    self.stdout.write(f'   ✓ Lease: {lease.tenant.user.first_name} → {lease.rental_property.title[:40]}... (12 months)')
                else:
                    self.stdout.write(f'   - Exists: {lease.tenant.user.first_name} → {lease.rental_property.title[:40]}...')
            except Exception as e:
                self.stdout.write(f'   ⚠ Lease error: {e}')

    def _seed_chats(self):
        from chat.models import Conversation, Message

        self.stdout.write('\n12. Creating chat conversations...')

        now = timezone.now()
        tenant1 = self.users.get('tenant1@property237.com')
        agent1 = self.users.get('agent1@property237.com')
        tenant2 = self.users.get('tenant2@property237.com')
        agent2 = self.users.get('agent2@property237.com')

        if not (tenant1 and agent1):
            self.stdout.write('   - Missing users for chats')
            return

        # Conversation 1: Tenant1 ↔ Agent1 about property
        conv1, created = Conversation.objects.get_or_create(
            conversation_type='property_inquiry',
            property=self.properties[0] if self.properties else None,
            defaults={'is_active': True}
        )
        if created:
            conv1.participants.set([tenant1, agent1])

        messages_1 = [
            (tenant1, 'Bonjour! I\'m interested in the 3-bedroom apartment in Bastos. Is it still available?'),
            (agent1, 'Hello! Yes, the apartment is still available. When would you like to schedule a visit?'),
            (tenant1, 'I\'m free this weekend, Saturday morning preferably. Can we do 10 AM?'),
            (agent1, 'Perfect! Saturday at 10 AM works. I\'ll send you the exact address. Please bring your ID for the security gate.'),
            (tenant1, 'Great, thank you! I\'ll be there. Looking forward to it.'),
        ]

        for i, (sender, content) in enumerate(messages_1):
            msg, msg_created = Message.objects.get_or_create(
                conversation=conv1,
                sender=sender,
                content=content,
                defaults={
                    'message_type': 'text',
                    'is_read': i < len(messages_1) - 1,
                }
            )

        self.stdout.write(f'   {"✓ Created" if created else "- Exists"}: {tenant1.first_name} ↔ {agent1.first_name} ({len(messages_1)} messages)')

        # Conversation 2: Tenant2 ↔ Agent2
        if tenant2 and agent2 and len(self.properties) > 4:
            conv2, created = Conversation.objects.get_or_create(
                conversation_type='property_inquiry',
                property=self.properties[4],
                defaults={'is_active': True}
            )
            if created:
                conv2.participants.set([tenant2, agent2])

            messages_2 = [
                (tenant2, 'Good morning. I saw your office space listing in Bonanjo. Is the price negotiable?'),
                (agent2, 'Good morning! Yes, for a long-term lease we can discuss the price. What duration are you considering?'),
                (tenant2, 'We\'re looking at a 2-year lease minimum. Our company is expanding to Douala.'),
                (agent2, 'For a 2-year commitment, we can offer a 10% discount. That would bring it to 450,000 XAF/month. Would you like to visit?'),
            ]

            for i, (sender, content) in enumerate(messages_2):
                Message.objects.get_or_create(
                    conversation=conv2,
                    sender=sender,
                    content=content,
                    defaults={
                        'message_type': 'text',
                        'is_read': i < len(messages_2) - 1,
                    }
                )

            self.stdout.write(f'   {"✓ Created" if created else "- Exists"}: {tenant2.first_name} ↔ {agent2.first_name} ({len(messages_2)} messages)')
