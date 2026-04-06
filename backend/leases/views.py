from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import LeaseAgreement, RentSchedule
from .serializers import LeaseAgreementSerializer, RentScheduleSerializer


class LeaseAgreementViewSet(viewsets.ModelViewSet):
    serializer_class = LeaseAgreementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['rental_property__title', 'tenant__user__email', 'landlord__email']
    ordering_fields = ['start_date', 'end_date', 'rent_amount', 'created_at']

    def get_queryset(self):
        user = self.request.user
        qs = LeaseAgreement.objects.select_related(
            'rental_property', 'tenant__user', 'landlord'
        ).prefetch_related('rent_schedule')
        if user.is_staff:
            return qs.all()
        return qs.filter(Q(tenant__user=user) | Q(landlord=user))


class RentScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = RentScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['due_date', 'amount']

    def get_queryset(self):
        user = self.request.user
        qs = RentSchedule.objects.select_related(
            'lease', 'lease__tenant__user', 'lease__landlord'
        )
        if user.is_staff:
            return qs.all()
        return qs.filter(
            Q(lease__tenant__user=user) | Q(lease__landlord=user)
        )
