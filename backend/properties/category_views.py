"""
API Views for Categories, Tags, and States
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.db.models import Q

from .category_models import Category, PropertyTag, PropertyState
from .category_serializers import (
    CategorySerializer,
    SubcategorySerializer,
    PropertyTagSerializer,
    PropertyStateSerializer,
    CategoryWithFiltersSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for property categories

    Endpoints:
    - GET /categories/ - List all parent categories
    - GET /categories/{id}/ - Get category details
    - GET /categories/parents/ - Get only parent categories
    - GET /categories/{id}/subcategories/ - Get subcategories for a parent
    - GET /categories/{id}/with_filters/ - Get category with applicable tags/states
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def parents(self, request):
        """Get all parent categories"""
        parents = Category.get_parent_categories()
        serializer = self.get_serializer(parents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def subcategories(self, request, slug=None):
        """Get all subcategories for a parent category"""
        parent = self.get_object()

        if not parent.is_parent():
            return Response(
                {'error': 'This is not a parent category'},
                status=status.HTTP_400_BAD_REQUEST
            )

        subcats = parent.get_all_subcategories()
        serializer = SubcategorySerializer(subcats, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def with_filters(self, request, slug=None):
        """Get category with all applicable tags and states"""
        category = self.get_object()
        serializer = CategoryWithFiltersSerializer(category)
        return Response(serializer.data)


class PropertyTagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for property tags

    Endpoints:
    - GET /tags/ - List all active tags
    - GET /tags/{id}/ - Get tag details
    - GET /tags/for_category/{category_id}/ - Get tags applicable to category
    """
    queryset = PropertyTag.objects.filter(is_active=True)
    serializer_class = PropertyTagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=False, methods=['get'], url_path='for_category/(?P<category_id>[^/.]+)')
    def for_category(self, request, category_id=None):
        """Get all tags applicable to a specific category"""
        try:
            category = Category.objects.get(id=category_id, is_active=True)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Tags with no specific categories OR tags that include this category
        tags = PropertyTag.objects.filter(
            is_active=True
        ).filter(
            Q(applies_to__isnull=True) | Q(applies_to=category)
        ).distinct()

        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)


class PropertyStateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for property states

    Endpoints:
    - GET /states/ - List all active states
    - GET /states/{code}/ - Get state details
    - GET /states/for_category/{category_id}/ - Get states applicable to category
    - GET /states/public/ - Get only publicly visible states
    """
    queryset = PropertyState.objects.filter(is_active=True)
    serializer_class = PropertyStateSerializer
    permission_classes = [AllowAny]
    lookup_field = 'code'

    @action(detail=False, methods=['get'])
    def public(self, request):
        """Get only publicly visible states"""
        states = self.queryset.filter(is_publicly_visible=True)
        serializer = self.get_serializer(states, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='for_category/(?P<category_id>[^/.]+)')
    def for_category(self, request, category_id=None):
        """Get all states applicable to a specific category"""
        try:
            category = Category.objects.get(id=category_id, is_active=True)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # States with no specific categories OR states that include this category
        states = PropertyState.objects.filter(
            is_active=True
        ).filter(
            Q(applies_to__isnull=True) | Q(applies_to=category)
        ).distinct()

        serializer = self.get_serializer(states, many=True)
        return Response(serializer.data)


class PropertyFormDataViewSet(viewsets.ViewSet):
    """
    Special viewset to provide all form data in one request
    Optimizes frontend form initialization

    Endpoint:
    - GET /form-data/ - Get categories, tags, states
    - GET /form-data/for_category/{category_id}/ - Get filtered data for specific category
    """
    permission_classes = [AllowAny]

    def list(self, request):
        """Get all form data"""
        return Response({
            'categories': CategorySerializer(
                Category.get_parent_categories(),
                many=True
            ).data,
            'tags': PropertyTagSerializer(
                PropertyTag.objects.filter(is_active=True),
                many=True
            ).data,
            'states': PropertyStateSerializer(
                PropertyState.objects.filter(is_active=True),
                many=True
            ).data,
        })

    @action(detail=False, methods=['get'], url_path='for_category/(?P<category_id>[^/.]+)')
    def for_category(self, request, category_id=None):
        """Get filtered form data for a specific category"""
        try:
            category = Category.objects.get(id=category_id, is_active=True)
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get subcategories
        if category.is_parent():
            subcategories = category.get_all_subcategories()
        else:
            subcategories = Category.objects.none()

        # Get applicable tags
        tags = PropertyTag.objects.filter(
            is_active=True
        ).filter(
            Q(applies_to__isnull=True) | Q(applies_to=category)
        ).distinct()

        # Get applicable states
        states = PropertyState.objects.filter(
            is_active=True
        ).filter(
            Q(applies_to__isnull=True) | Q(applies_to=category)
        ).distinct()

        return Response({
            'category': CategorySerializer(category).data,
            'subcategories': SubcategorySerializer(subcategories, many=True).data,
            'tags': PropertyTagSerializer(tags, many=True).data,
            'states': PropertyStateSerializer(states, many=True).data,
        })
