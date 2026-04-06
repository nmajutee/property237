from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import MaintenanceRequest, MaintenanceCategory, ServiceProvider
from .serializers import MaintenanceRequestSerializer, MaintenanceCategorySerializer, ServiceProviderSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read access to all authenticated users, write access only to admins."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'related_property__title', 'tenant__user__email']
    ordering_fields = ['requested_date', 'priority']

    def get_queryset(self):
        user = self.request.user
        qs = MaintenanceRequest.objects.select_related(
            'related_property', 'tenant__user', 'category', 'assigned_to'
        )
        if user.is_staff:
            return qs.all()
        return qs.filter(Q(landlord=user) | Q(tenant__user=user))


class MaintenanceCategoryViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceCategory.objects.all()
    serializer_class = MaintenanceCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]


class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
