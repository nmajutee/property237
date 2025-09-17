from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, TenantDocumentViewSet


router = DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'tenant-documents', TenantDocumentViewSet, basename='tenant-document')

urlpatterns = router.urls
