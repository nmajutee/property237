from rest_framework import viewsets, permissions, filters
from .models import MaintenanceRequest, MaintenanceCategory, ServiceProvider
from .serializers import MaintenanceRequestSerializer, MaintenanceCategorySerializer, ServiceProviderSerializer


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.select_related('property', 'tenant__user', 'category', 'assigned_to')
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'property__title', 'tenant__user__email']
    ordering_fields = ['requested_date', 'priority']


class MaintenanceCategoryViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceCategory.objects.all()
    serializer_class = MaintenanceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticated]
from django.shortcuts import render

# Create your views here.
