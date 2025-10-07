from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TenantViewSet, TenantDocumentViewSet, TenantApplicationViewSet


router = DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'tenant-documents', TenantDocumentViewSet, basename='tenant-document')
router.register(r'applications', TenantApplicationViewSet, basename='application')

urlpatterns = router.urls
