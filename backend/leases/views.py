from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import api_view, permission_classes as perm_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.http import HttpResponse
from django.template.loader import render_to_string
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


@api_view(['GET'])
@perm_classes([IsAuthenticated])
def lease_pdf(request, pk):
    """Generate and return a PDF for a lease agreement."""
    try:
        qs = LeaseAgreement.objects.select_related(
            'rental_property', 'rental_property__area',
            'tenant__user', 'landlord', 'agent__user',
        )
        if request.user.is_staff:
            lease = qs.get(pk=pk)
        else:
            lease = qs.get(
                Q(tenant__user=request.user) | Q(landlord=request.user),
                pk=pk,
            )
    except LeaseAgreement.DoesNotExist:
        return HttpResponse('Lease not found', status=404)

    html = render_to_string('leases/lease_pdf.html', {'lease': lease})

    from weasyprint import HTML
    pdf = HTML(string=html).write_pdf()

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="lease-{lease.lease_number}.pdf"'
    return response
