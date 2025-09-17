from rest_framework import viewsets, permissions, filters
from .models import Tenant, TenantDocument
from .serializers import TenantSerializer, TenantDocumentSerializer


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.select_related('user').all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'employer_name']
    ordering_fields = ['created_at', 'monthly_income']


class TenantDocumentViewSet(viewsets.ModelViewSet):
    queryset = TenantDocument.objects.select_related('tenant', 'tenant__user').all()
    serializer_class = TenantDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tenant__user__email']
    ordering_fields = ['uploaded_at']
