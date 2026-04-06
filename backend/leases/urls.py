from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LeaseAgreementViewSet, RentScheduleViewSet, lease_pdf


router = DefaultRouter()
router.register(r'leases', LeaseAgreementViewSet, basename='lease')
router.register(r'rent-schedule', RentScheduleViewSet, basename='rent-schedule')

urlpatterns = [
    path('leases/<int:pk>/pdf/', lease_pdf, name='lease-pdf'),
] + router.urls
