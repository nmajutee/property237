from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Tenant, TenantDocument, TenantApplication, TenantProfile
from .serializers import TenantSerializer, TenantDocumentSerializer, TenantApplicationSerializer


class TenantViewSet(viewsets.ModelViewSet):
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'employer_name']
    ordering_fields = ['created_at', 'monthly_income']

    def get_queryset(self):
        user = self.request.user
        qs = Tenant.objects.select_related('user')
        if user.is_staff:
            return qs.all()
        return qs.filter(user=user)


class TenantDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = TenantDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tenant__user__email']
    ordering_fields = ['uploaded_at']

    def get_queryset(self):
        user = self.request.user
        qs = TenantDocument.objects.select_related('tenant', 'tenant__user')
        if user.is_staff:
            return qs.all()
        return qs.filter(tenant__user=user)


class TenantApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for tenant applications"""
    serializer_class = TenantApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['property__title', 'status']
    ordering_fields = ['created_at', 'desired_move_in_date']
    ordering = ['-created_at']

    def get_queryset(self):
        # Users only see their own applications
        user = self.request.user
        if hasattr(user, 'tenant_profile'):
            return TenantApplication.objects.filter(
                tenant=user.tenant_profile
            ).select_related(
                'property', 'property__area__city', 'property__agent__user', 'tenant__user'
            ).prefetch_related('property__media_files')
        return TenantApplication.objects.none()

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw an application"""
        application = self.get_object()
        if application.status in ['approved', 'rejected', 'withdrawn']:
            return Response(
                {'detail': 'Cannot withdraw this application.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = 'withdrawn'
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def contract(self, request, pk=None):
        """Get contract for approved application"""
        application = self.get_object()
        if application.status != 'approved':
            return Response(
                {'detail': 'Contract only available for approved applications.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Return contract data
        contract_data = {
            'id': application.id,
            'tenant_name': application.tenant.user.get_full_name(),
            'tenant_email': application.tenant.user.email,
            'property_title': application.property.title,
            'property_address': f"{application.property.area.name}, {application.property.area.city.name}" if application.property.area else "",
            'monthly_rent': application.offered_rent,
            'lease_duration': application.lease_duration_months,
            'move_in_date': application.desired_move_in_date,
            'agent_name': application.property.agent.user.get_full_name() if application.property.agent else "",
            'created_at': application.created_at,
        }
        return Response(contract_data)

    @action(detail=True, methods=['post'], url_path='sign-contract')
    def sign_contract(self, request, pk=None):
        """Sign the rental contract"""
        application = self.get_object()
        if application.status != 'approved':
            return Response(
                {'detail': 'Can only sign contract for approved applications.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # In a real app, you would create a lease here
        return Response({
            'success': True,
            'message': 'Contract signed successfully!'
        })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tenant_credit_score(request):
    """Calculate and return the tenant's credit score."""
    try:
        profile = request.user.tenant_profile
    except TenantProfile.DoesNotExist:
        return Response(
            {'error': 'Tenant profile not found'},
            status=status.HTTP_404_NOT_FOUND,
        )

    from .scoring import calculate_tenant_score
    result = calculate_tenant_score(profile)
    return Response(result)
