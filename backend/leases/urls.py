from rest_framework.routers import DefaultRouter
from .views import LeaseAgreementViewSet, RentScheduleViewSet


router = DefaultRouter()
router.register(r'leases', LeaseAgreementViewSet, basename='lease')
router.register(r'rent-schedule', RentScheduleViewSet, basename='rent-schedule')

urlpatterns = router.urls
