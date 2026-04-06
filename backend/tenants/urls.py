from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TenantViewSet, TenantDocumentViewSet, TenantApplicationViewSet, tenant_credit_score


router = DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'tenant-documents', TenantDocumentViewSet, basename='tenant-document')
router.register(r'applications', TenantApplicationViewSet, basename='application')

urlpatterns = [
    path('credit-score/', tenant_credit_score, name='tenant-credit-score'),
] + router.urls
