from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from agents.models import AgentProfile
from locations.models import Area, City, Country, Region
from properties.models import Property, PropertySearchSync, PropertyStatus, PropertyType

User = get_user_model()


class PropertySearchSyncTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='searchsync',
            email='searchsync@example.com',
            password='testpass123',
            user_type='agent',
        )
        self.agent_profile = AgentProfile.objects.create(
            user=self.user,
            license_number='SYNC123',
            license_expiry=date(2030, 12, 31),
            years_experience='1-3',
            specialization='residential',
            bio='Sync test agent',
            agency_name='Sync Realty',
        )
        self.country = Country.objects.create(name='Cameroon', code='CM')
        self.region = Region.objects.create(name='Littoral', code='littoral', country=self.country)
        self.city = City.objects.create(name='Douala', region=self.region)
        self.area = Area.objects.create(name='Bonapriso', city=self.city)
        self.property_type = PropertyType.objects.create(name='Apartment', category='residential')
        self.property_status = PropertyStatus.objects.create(name='available')

    def create_property(self, title='Search Sync Property'):
        return Property.objects.create(
            title=title,
            description='Search sync test property',
            property_type=self.property_type,
            status=self.property_status,
            listing_type='rent',
            price=250000,
            currency='XAF',
            area=self.area,
            agent=self.agent_profile,
        )

    def test_property_create_enqueues_upsert_event(self):
        with self.captureOnCommitCallbacks(execute=True):
            property_obj = self.create_property()

        event = PropertySearchSync.objects.get(property=property_obj)
        self.assertEqual(event.action, PropertySearchSync.Action.UPSERT)
        self.assertEqual(event.status, PropertySearchSync.Status.PENDING)
        self.assertEqual(event.payload['slug'], property_obj.slug)
        self.assertEqual(event.payload['location']['city'], 'Douala')

    def test_views_count_only_update_does_not_enqueue_search_sync(self):
        with self.captureOnCommitCallbacks(execute=True):
            property_obj = self.create_property('View Counter Property')

        PropertySearchSync.objects.all().delete()

        with self.captureOnCommitCallbacks(execute=True):
            property_obj.views_count += 1
            property_obj.save(update_fields=['views_count'])

        self.assertFalse(PropertySearchSync.objects.exists())

    def test_property_delete_enqueues_delete_event(self):
        with self.captureOnCommitCallbacks(execute=True):
            property_obj = self.create_property('Delete Property')

        PropertySearchSync.objects.all().delete()
        property_slug = property_obj.slug
        property_id = property_obj.id

        with self.captureOnCommitCallbacks(execute=True):
            property_obj.delete()

        event = PropertySearchSync.objects.get(action=PropertySearchSync.Action.DELETE)
        self.assertIsNone(event.property)
        self.assertEqual(event.property_slug, property_slug)
        self.assertEqual(event.payload['id'], property_id)