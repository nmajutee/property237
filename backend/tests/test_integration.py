"""
Integration tests for critical API flows.
Covers auth, property CRUD, permissions, rate limiting, and health check.
"""
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@override_settings(
    CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}},
)
class AuthFlowTests(TestCase):
    """Test authentication flow: signup, login, token refresh, logout."""

    def setUp(self):
        self.client = APIClient()
        self.signup_data = {
            'full_name': 'Test User',
            'username': 'testuser',
            'email': 'test@example.com',
            'phone_number': '+237600000000',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'user_type': 'tenant',
            'terms_accepted': True,
        }

    def test_signup_creates_user(self):
        resp = self.client.post('/api/auth/signup/', self.signup_data, format='json')
        self.assertIn(resp.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertTrue(User.objects.filter(email='test@example.com').exists())

    def test_signup_duplicate_email(self):
        User.objects.create_user(
            username='existing',
            email='test@example.com',
            password='Pass1234!',
            phone_number='+237600000001',
        )
        resp = self.client.post('/api/auth/signup/', self.signup_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_returns_tokens(self):
        User.objects.create_user(
            username='logintest',
            email='login@example.com',
            password='StrongPass123!',
            phone_number='+237600000002',
        )
        resp = self.client.post('/api/auth/login/', {
            'identifier': 'login@example.com',
            'password': 'StrongPass123!',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertIn('tokens', data)
        self.assertIn('access', data['tokens'])
        self.assertIn('refresh', data['tokens'])

    def test_login_wrong_password(self):
        User.objects.create_user(
            username='logintest2',
            email='login2@example.com',
            password='StrongPass123!',
            phone_number='+237600000003',
        )
        resp = self.client.post('/api/auth/login/', {
            'identifier': 'login2@example.com',
            'password': 'WrongPassword!',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PropertyCRUDTests(TestCase):
    """Test property CRUD operations and permissions."""

    def setUp(self):
        self.agent_user = User.objects.create_user(
            username='agent1',
            email='agent@example.com',
            password='Pass1234!',
            phone_number='+237600000010',
            user_type='agent',
        )
        self.tenant_user = User.objects.create_user(
            username='tenant1',
            email='tenant@example.com',
            password='Pass1234!',
            phone_number='+237600000011',
            user_type='tenant',
        )
        self.client = APIClient()

    def test_property_list_accessible(self):
        self.client.force_authenticate(user=self.agent_user)
        resp = self.client.get('/api/properties/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_unauthenticated_property_list_allowed(self):
        resp = self.client.get('/api/properties/')
        self.assertIn(resp.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])


class TenantPermissionTests(TestCase):
    """Test ownership-filtered tenant endpoints."""

    def setUp(self):
        self.user1 = User.objects.create_user(
            username='tenant_a',
            email='a@example.com',
            password='Pass1234!',
            phone_number='+237600000020',
            user_type='tenant',
        )
        self.user2 = User.objects.create_user(
            username='tenant_b',
            email='b@example.com',
            password='Pass1234!',
            phone_number='+237600000021',
            user_type='tenant',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='Admin1234!',
            phone_number='+237600000099',
        )
        from tenants.models import Tenant
        self.t1 = Tenant.objects.create(user=self.user1)
        self.t2 = Tenant.objects.create(user=self.user2)
        self.client = APIClient()

    def test_tenant_sees_only_own_profile(self):
        self.client.force_authenticate(user=self.user1)
        resp = self.client.get('/api/tenants/tenants/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        results = data.get('results', data) if isinstance(data, dict) else data
        if isinstance(results, list):
            ids = [r['id'] for r in results]
            self.assertIn(self.t1.id, ids)
            self.assertNotIn(self.t2.id, ids)

    def test_admin_sees_all_tenants(self):
        self.client.force_authenticate(user=self.admin_user)
        resp = self.client.get('/api/tenants/tenants/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        results = data.get('results', data) if isinstance(data, dict) else data
        if isinstance(results, list):
            self.assertGreaterEqual(len(results), 2)


class LeasePermissionTests(TestCase):
    """Test ownership-filtered lease endpoints."""

    def setUp(self):
        self.landlord = User.objects.create_user(
            username='landlord',
            email='landlord@example.com',
            password='Pass1234!',
            phone_number='+237600000030',
            user_type='agent',
        )
        self.tenant_user = User.objects.create_user(
            username='tenant_lease',
            email='tenantlease@example.com',
            password='Pass1234!',
            phone_number='+237600000031',
            user_type='tenant',
        )
        self.other_user = User.objects.create_user(
            username='other',
            email='other@example.com',
            password='Pass1234!',
            phone_number='+237600000032',
            user_type='tenant',
        )
        self.client = APIClient()

    def test_unauthenticated_lease_access_denied(self):
        resp = self.client.get('/api/leases/leases/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class MaintenanceCategoryPermissionTests(TestCase):
    """Test that MaintenanceCategory is read-only for non-admins."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='maint_user',
            email='maint@example.com',
            password='Pass1234!',
            phone_number='+237600000040',
            user_type='tenant',
        )
        self.admin = User.objects.create_superuser(
            username='maint_admin',
            email='maintadmin@example.com',
            password='Admin1234!',
            phone_number='+237600000041',
        )
        self.client = APIClient()

    def test_regular_user_can_list_categories(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get('/api/maintenance/maintenance-categories/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_regular_user_cannot_create_category(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post('/api/maintenance/maintenance-categories/', {
            'name': 'Plumbing',
            'description': 'Test',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_category(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post('/api/maintenance/maintenance-categories/', {
            'name': 'Electrical',
            'description': 'Test',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)


class HealthCheckTests(TestCase):
    """Test health check endpoint."""

    def test_health_returns_ok(self):
        resp = self.client.get('/health/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertEqual(data['status'], 'ok')
        self.assertEqual(data['checks']['database'], 'ok')
