from rest_framework.routers import DefaultRouter
from .views import MaintenanceRequestViewSet, MaintenanceCategoryViewSet, ServiceProviderViewSet


router = DefaultRouter()
router.register(r'maintenance', MaintenanceRequestViewSet, basename='maintenance')
router.register(r'maintenance-categories', MaintenanceCategoryViewSet, basename='maintenance-category')
router.register(r'service-providers', ServiceProviderViewSet, basename='service-provider')

urlpatterns = router.urls
