from django.core.management.base import BaseCommand
from locations.models import Country, Region, City, Area


class Command(BaseCommand):
    help = 'Populate database with Cameroon locations'

    def handle(self, *args, **options):
        self.stdout.write('Starting Cameroon locations population...')

        # Create Cameroon
        cameroon, created = Country.objects.get_or_create(
            code='CMR',
            defaults={
                'name': 'Cameroon',
                'phone_code': '+237',
                'currency': 'XAF'
            }
        )

        if created:
            self.stdout.write(f'Created country: {cameroon.name}')
        else:
            self.stdout.write(f'Country already exists: {cameroon.name}')

        # Create ALL 10 Regions of Cameroon
        regions_data = [
            ('centre', 'Centre'),
            ('littoral', 'Littoral'),
            ('northwest', 'Northwest'),
            ('southwest', 'Southwest'),
            ('west', 'West'),
            ('adamawa', 'Adamawa'),
            ('east', 'East'),
            ('far_north', 'Far North'),
            ('north', 'North'),
            ('south', 'South'),
        ]

        regions = {}
        for code, name in regions_data:
            region, created = Region.objects.get_or_create(
                code=code,
                country=cameroon,
                defaults={'name': name}
            )
            regions[code] = region
            if created:
                self.stdout.write(f'Created region: {region.name}')
            else:
                self.stdout.write(f'Region already exists: {region.name}')

        # Create Cities - Major cities from all 10 regions
        cities_data = [
            # Littoral Region
            {'name': 'Douala', 'region': 'littoral', 'is_major': True, 'lat': 4.0511, 'lng': 9.7679},
            {'name': 'Nkongsamba', 'region': 'littoral', 'is_major': False, 'lat': 4.9547, 'lng': 9.9400},
            {'name': 'Edéa', 'region': 'littoral', 'is_major': False, 'lat': 3.7833, 'lng': 10.1333},

            # Centre Region
            {'name': 'Yaoundé', 'region': 'centre', 'is_major': True, 'lat': 3.8480, 'lng': 11.5021},
            {'name': 'Mbalmayo', 'region': 'centre', 'is_major': False, 'lat': 3.5167, 'lng': 11.5000},
            {'name': 'Obala', 'region': 'centre', 'is_major': False, 'lat': 4.1667, 'lng': 11.5333},

            # Northwest Region
            {'name': 'Bamenda', 'region': 'northwest', 'is_major': True, 'lat': 5.9631, 'lng': 10.1591},
            {'name': 'Kumbo', 'region': 'northwest', 'is_major': False, 'lat': 6.2028, 'lng': 10.6764},
            {'name': 'Ndop', 'region': 'northwest', 'is_major': False, 'lat': 5.9667, 'lng': 10.4500},

            # Southwest Region
            {'name': 'Buea', 'region': 'southwest', 'is_major': True, 'lat': 4.1544, 'lng': 9.2349},
            {'name': 'Limbe', 'region': 'southwest', 'is_major': True, 'lat': 4.0186, 'lng': 9.2006},
            {'name': 'Kumba', 'region': 'southwest', 'is_major': True, 'lat': 4.6333, 'lng': 9.4500},
            {'name': 'Tiko', 'region': 'southwest', 'is_major': False, 'lat': 4.0833, 'lng': 9.3667},

            # West Region
            {'name': 'Bafoussam', 'region': 'west', 'is_major': True, 'lat': 5.4781, 'lng': 10.4175},
            {'name': 'Dschang', 'region': 'west', 'is_major': False, 'lat': 5.4500, 'lng': 10.0667},
            {'name': 'Foumban', 'region': 'west', 'is_major': False, 'lat': 5.7286, 'lng': 10.9008},
            {'name': 'Mbouda', 'region': 'west', 'is_major': False, 'lat': 5.6264, 'lng': 10.2544},

            # Adamawa Region
            {'name': 'Ngaoundéré', 'region': 'adamawa', 'is_major': True, 'lat': 7.3167, 'lng': 13.5833},
            {'name': 'Meiganga', 'region': 'adamawa', 'is_major': False, 'lat': 6.5167, 'lng': 14.3000},
            {'name': 'Tibati', 'region': 'adamawa', 'is_major': False, 'lat': 6.4667, 'lng': 12.6333},

            # East Region
            {'name': 'Bertoua', 'region': 'east', 'is_major': True, 'lat': 4.5833, 'lng': 13.6833},
            {'name': 'Batouri', 'region': 'east', 'is_major': False, 'lat': 4.4333, 'lng': 14.3667},
            {'name': 'Abong-Mbang', 'region': 'east', 'is_major': False, 'lat': 3.9833, 'lng': 13.1833},

            # Far North Region
            {'name': 'Maroua', 'region': 'far_north', 'is_major': True, 'lat': 10.5908, 'lng': 14.3158},
            {'name': 'Kousseri', 'region': 'far_north', 'is_major': False, 'lat': 12.0781, 'lng': 15.0311},
            {'name': 'Mokolo', 'region': 'far_north', 'is_major': False, 'lat': 10.7333, 'lng': 13.8000},
            {'name': 'Yagoua', 'region': 'far_north', 'is_major': False, 'lat': 10.3333, 'lng': 15.2333},

            # North Region
            {'name': 'Garoua', 'region': 'north', 'is_major': True, 'lat': 9.3000, 'lng': 13.4000},
            {'name': 'Guider', 'region': 'north', 'is_major': False, 'lat': 9.9333, 'lng': 13.9500},
            {'name': 'Poli', 'region': 'north', 'is_major': False, 'lat': 8.5167, 'lng': 13.2500},

            # South Region
            {'name': 'Ebolowa', 'region': 'south', 'is_major': True, 'lat': 2.9000, 'lng': 11.1500},
            {'name': 'Kribi', 'region': 'south', 'is_major': True, 'lat': 2.9500, 'lng': 9.9083},
            {'name': 'Sangmélima', 'region': 'south', 'is_major': False, 'lat': 2.9333, 'lng': 11.9833},
            {'name': 'Ambam', 'region': 'south', 'is_major': False, 'lat': 2.3833, 'lng': 11.2667},
        ]

        cities = {}
        for city_data in cities_data:
            city, created = City.objects.get_or_create(
                name=city_data['name'],
                region=regions[city_data['region']],
                defaults={
                    'is_major_city': city_data['is_major'],
                    'latitude': city_data['lat'],
                    'longitude': city_data['lng']
                }
            )
            cities[city_data['name']] = city
            if created:
                self.stdout.write(f'Created city: {city.name}')
            else:
                self.stdout.write(f'City already exists: {city.name}')

        # Create Areas/Quarters - All major neighborhoods in Cameroon cities
        areas_data = [
            # Douala Areas (Economic Capital)
            {'name': 'Akwa', 'city': 'Douala', 'is_commercial': True},
            {'name': 'Bonabéri', 'city': 'Douala'},
            {'name': 'Bonanjo', 'city': 'Douala', 'is_commercial': True},
            {'name': 'Bassa', 'city': 'Douala'},
            {'name': 'Deido', 'city': 'Douala'},
            {'name': 'New Bell', 'city': 'Douala'},
            {'name': 'Logpom', 'city': 'Douala'},
            {'name': 'Makepe', 'city': 'Douala'},
            {'name': 'Bonapriso', 'city': 'Douala', 'is_commercial': True},
            {'name': 'Kotto', 'city': 'Douala'},
            {'name': 'PK8', 'city': 'Douala'},
            {'name': 'PK12', 'city': 'Douala'},
            {'name': 'PK14', 'city': 'Douala'},
            {'name': 'PK17', 'city': 'Douala'},
            {'name': 'Ndogpassi', 'city': 'Douala'},
            {'name': 'Bépanda', 'city': 'Douala'},
            {'name': 'Cité SIC', 'city': 'Douala'},
            {'name': 'Kassalafam', 'city': 'Douala'},
            {'name': 'Yassa', 'city': 'Douala'},
            {'name': 'Japoma', 'city': 'Douala'},
            {'name': 'Ngangue', 'city': 'Douala'},
            {'name': 'Village', 'city': 'Douala'},
            {'name': 'Cite des Palmiers', 'city': 'Douala'},
            {'name': 'Bonamoussadi', 'city': 'Douala'},

            # Yaoundé Areas (Political Capital)
            {'name': 'Centre Ville', 'city': 'Yaoundé', 'is_commercial': True},
            {'name': 'Bastos', 'city': 'Yaoundé'},
            {'name': 'Melen', 'city': 'Yaoundé'},
            {'name': 'Kondengui', 'city': 'Yaoundé'},
            {'name': 'Emana', 'city': 'Yaoundé'},
            {'name': 'Obobogo', 'city': 'Yaoundé'},
            {'name': 'Nkol-Eton', 'city': 'Yaoundé'},
            {'name': 'Olézoa', 'city': 'Yaoundé'},
            {'name': 'Mimboman', 'city': 'Yaoundé'},
            {'name': 'Carrière', 'city': 'Yaoundé'},
            {'name': 'Mokolo', 'city': 'Yaoundé'},
            {'name': 'Mvog-Ada', 'city': 'Yaoundé'},
            {'name': 'Essos', 'city': 'Yaoundé'},
            {'name': 'Nsam', 'city': 'Yaoundé'},
            {'name': 'Mvog-Mbi', 'city': 'Yaoundé'},
            {'name': 'Ekounou', 'city': 'Yaoundé'},
            {'name': 'Etoug-Ebe', 'city': 'Yaoundé'},
            {'name': 'Biyem-Assi', 'city': 'Yaoundé'},
            {'name': 'Djoungolo', 'city': 'Yaoundé'},
            {'name': 'Nkomo', 'city': 'Yaoundé'},
            {'name': 'Simbock', 'city': 'Yaoundé'},
            {'name': 'Nkolbisson', 'city': 'Yaoundé'},

            # Bamenda Areas (Northwest Regional Capital)
            {'name': 'Commercial Avenue', 'city': 'Bamenda', 'is_commercial': True},
            {'name': 'Up Station', 'city': 'Bamenda'},
            {'name': 'Mile 4', 'city': 'Bamenda'},
            {'name': 'Ntarikon', 'city': 'Bamenda'},
            {'name': 'Mulang', 'city': 'Bamenda'},
            {'name': 'Nkwen', 'city': 'Bamenda'},
            {'name': 'Mankon', 'city': 'Bamenda'},
            {'name': 'Cow Street', 'city': 'Bamenda'},
            {'name': 'Foncha Street', 'city': 'Bamenda'},
            {'name': 'Food Market', 'city': 'Bamenda'},
            {'name': 'Old Town', 'city': 'Bamenda'},

            # Limbe Areas (Coastal City)
            {'name': 'Down Beach', 'city': 'Limbe'},
            {'name': 'Church Street', 'city': 'Limbe'},
            {'name': 'New Town', 'city': 'Limbe'},
            {'name': 'Mile 2', 'city': 'Limbe'},
            {'name': 'Mile 1', 'city': 'Limbe'},
            {'name': 'Batoke', 'city': 'Limbe'},
            {'name': 'Half Mile', 'city': 'Limbe'},
            {'name': 'Gardens', 'city': 'Limbe'},
            {'name': 'Checket', 'city': 'Limbe'},
            {'name': 'Motowo', 'city': 'Limbe'},

            # Buea Areas (University Town)
            {'name': 'Molyko', 'city': 'Buea'},
            {'name': 'Great Soppo', 'city': 'Buea'},
            {'name': 'Government Station', 'city': 'Buea'},
            {'name': 'Bonduma', 'city': 'Buea'},
            {'name': 'Mile 16', 'city': 'Buea'},
            {'name': 'Mile 15', 'city': 'Buea'},
            {'name': 'Mile 14', 'city': 'Buea'},
            {'name': 'Sandpit', 'city': 'Buea'},
            {'name': 'Bokwongo', 'city': 'Buea'},
            {'name': 'Lower Farms', 'city': 'Buea'},
            {'name': 'Upper Farms', 'city': 'Buea'},
            {'name': 'Clerks Quarters', 'city': 'Buea'},

            # Kumba Areas (Southwest)
            {'name': 'Fiango', 'city': 'Kumba'},
            {'name': 'Mile 4', 'city': 'Kumba'},
            {'name': 'Kosala', 'city': 'Kumba'},
            {'name': 'Mbonge Road', 'city': 'Kumba'},
            {'name': 'New Layout', 'city': 'Kumba'},

            # Bafoussam Areas (West Region)
            {'name': 'Marché A', 'city': 'Bafoussam', 'is_commercial': True},
            {'name': 'Marché B', 'city': 'Bafoussam', 'is_commercial': True},
            {'name': 'Tamdja', 'city': 'Bafoussam'},
            {'name': 'Famla', 'city': 'Bafoussam'},
            {'name': 'Djeleng', 'city': 'Bafoussam'},
            {'name': 'Koptchou', 'city': 'Bafoussam'},

            # Garoua Areas (North Region)
            {'name': 'Centre Ville', 'city': 'Garoua', 'is_commercial': True},
            {'name': 'Ouro-Kessoum', 'city': 'Garoua'},
            {'name': 'Plateau', 'city': 'Garoua'},
            {'name': 'Doualaré', 'city': 'Garoua'},
            {'name': 'Roumdé-Adjia', 'city': 'Garoua'},

            # Maroua Areas (Far North Region)
            {'name': 'Domayo', 'city': 'Maroua'},
            {'name': 'Djarengol', 'city': 'Maroua'},
            {'name': 'Centre Ville', 'city': 'Maroua', 'is_commercial': True},
            {'name': 'Pitoaré', 'city': 'Maroua'},
            {'name': 'Hardé', 'city': 'Maroua'},

            # Ngaoundéré Areas (Adamawa Region)
            {'name': 'Centre Ville', 'city': 'Ngaoundéré', 'is_commercial': True},
            {'name': 'Petit Marché', 'city': 'Ngaoundéré', 'is_commercial': True},
            {'name': 'Dang', 'city': 'Ngaoundéré'},
            {'name': 'Bamyanga', 'city': 'Ngaoundéré'},
            {'name': 'Haoussa', 'city': 'Ngaoundéré'},

            # Bertoua Areas (East Region)
            {'name': 'Centre Ville', 'city': 'Bertoua', 'is_commercial': True},
            {'name': 'Nkolbikon', 'city': 'Bertoua'},
            {'name': 'Mokolo', 'city': 'Bertoua'},
            {'name': 'Ndokayo', 'city': 'Bertoua'},

            # Ebolowa Areas (South Region)
            {'name': 'Centre Ville', 'city': 'Ebolowa', 'is_commercial': True},
            {'name': 'Angale', 'city': 'Ebolowa'},
            {'name': 'Nkoabang', 'city': 'Ebolowa'},
            {'name': 'Nko\'ovos', 'city': 'Ebolowa'},

            # Kribi Areas (Coastal South)
            {'name': 'Centre Ville', 'city': 'Kribi', 'is_commercial': True},
            {'name': 'Grand Batanga', 'city': 'Kribi'},
            {'name': 'Mboro', 'city': 'Kribi'},
            {'name': 'Bongahele', 'city': 'Kribi'},

            # Dschang Areas (West Region)
            {'name': 'Centre Ville', 'city': 'Dschang', 'is_commercial': True},
            {'name': 'Fongo-Tongo', 'city': 'Dschang'},
            {'name': 'Foto', 'city': 'Dschang'},

            # Foumban Areas (West Region)
            {'name': 'Palais Royal', 'city': 'Foumban', 'is_commercial': True},
            {'name': 'Massif', 'city': 'Foumban'},
            {'name': 'Njinka', 'city': 'Foumban'},

            # Nkongsamba Areas (Littoral)
            {'name': 'Centre Ville', 'city': 'Nkongsamba', 'is_commercial': True},
            {'name': 'New Town', 'city': 'Nkongsamba'},
            {'name': 'Mbouda', 'city': 'Nkongsamba'},

            # Kumbo Areas (Northwest)
            {'name': 'Town', 'city': 'Kumbo', 'is_commercial': True},
            {'name': 'Tobin', 'city': 'Kumbo'},
            {'name': 'Tatum', 'city': 'Kumbo'},
        ]

        areas_created = 0
        areas_existing = 0

        for area_data in areas_data:
            city = cities[area_data['city']]
            area, created = Area.objects.get_or_create(
                name=area_data['name'],
                city=city,
                defaults={
                    'is_commercial': area_data.get('is_commercial', False),
                    'is_residential': True,
                    'has_tarred_roads': True if area_data.get('is_commercial') else False,
                    'has_electricity': True,
                    'has_water_supply': True,
                }
            )
            if created:
                areas_created += 1
                self.stdout.write(f'✓ Created area: {area.name}, {city.name}')
            else:
                areas_existing += 1

        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(
            self.style.SUCCESS(
                f'🎉 Successfully populated Cameroon locations!\n'
                f'📍 Country: Cameroon\n'
                f'🏛️  Regions: {len(regions_data)}\n'
                f'🏙️  Cities: {len(cities_data)}\n'
                f'🏘️  Areas: {areas_created} created, {areas_existing} already existed\n'
                f'📊 Total Areas: {areas_created + areas_existing}'
            )
        )
        self.stdout.write('='*50)

        # Display some examples
        self.stdout.write('\n📋 Sample locations created:')
        for city_name in ['Douala', 'Yaoundé']:
            city = cities[city_name]
            sample_areas = Area.objects.filter(city=city)[:3]
            self.stdout.write(f'  {city_name}: {", ".join([area.name for area in sample_areas])}...')

        self.stdout.write(f'\n✅ Ready for Property237.com! 🏠')