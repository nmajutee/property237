from rest_framework import viewsets, permissions, filters
from .models import LeaseAgreement, RentSchedule
from .serializers import LeaseAgreementSerializer, RentScheduleSerializer


class LeaseAgreementViewSet(viewsets.ModelViewSet):
    queryset = LeaseAgreement.objects.select_related('property', 'tenant__user', 'landlord')
    serializer_class = LeaseAgreementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['property__title', 'tenant__user__email', 'landlord__email']
    ordering_fields = ['start_date', 'end_date', 'rent_amount', 'created_at']


class RentScheduleViewSet(viewsets.ModelViewSet):
    queryset = RentSchedule.objects.select_related('lease')
    serializer_class = RentScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['due_date', 'amount']
from django.shortcuts import render

# Create your views here.
