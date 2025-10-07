from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from utils.permissions import IsAgentOrReadOnly, IsOwnerOrReadOnly
from agents.models import AgentProfile
from .models import Property, PropertyType, PropertyStatus, PropertyViewing, PropertyFavorite
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer, PropertyCreateSerializer,
    PropertyTypeSerializer, PropertyStatusSerializer, PropertyViewingSerializer
)
from .filters import PropertyFilter


class PropertyListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: List properties with filtering, search, and pagination
    POST: Create new property (authenticated agents only)
    """
    permission_classes = [IsAgentOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'area__name', 'area__city__name']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        return Property.objects.filter(is_active=True).select_related(
            'property_type', 'status', 'area__city__region', 'agent__user'
        ).prefetch_related('additional_features').order_by('-created_at')  # media_files is now available

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer

    def perform_create(self, serializer):
        # Ensure only agents can create properties
        if self.request.user.user_type == 'agent':
            # Try to get agent profile, create if doesn't exist
            try:
                agent_profile = self.request.user.agents_profile
            except AgentProfile.DoesNotExist:
                from agents.models import AgentProfile
                agent_profile = AgentProfile.objects.create(
                    user=self.request.user,
                    bio='Real estate agent',
                    is_verified=True,
                    terms_accepted=True,
                    data_consent_accepted=True
                )
            serializer.save(agent=agent_profile)
        else:
            raise PermissionDenied("Only agents can create properties")


class PropertyDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Property detail with full information
    PUT/PATCH: Update property (owner/agent only)
    DELETE: Delete property (owner/agent only)
    """
    queryset = Property.objects.select_related(
        'property_type', 'status', 'area__city__region', 'agent__user'
    ).prefetch_related('additional_features')  # media_files now available
    serializer_class = PropertyDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # Increment views count for GET requests (only for anonymous users)
        if self.request.method == 'GET' and not self.request.user.is_authenticated:
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj

    def perform_update(self, serializer):
        # Only property owner or admin can update
        property_obj = self.get_object()
        if (self.request.user == property_obj.agent.user or
            self.request.user.is_staff):
            serializer.save()
        else:
            raise PermissionDenied("You can only update your own properties")

    def perform_destroy(self, instance):
        # Soft delete - mark as inactive
        if (self.request.user == instance.agent.user or
            self.request.user.is_staff):
            instance.is_active = False
            instance.save()
        else:
            raise PermissionDenied("You can only delete your own properties")


@api_view(['GET'])
def property_search(request):
    """Advanced property search with multiple filters"""
    properties = Property.objects.filter(is_active=True)

    # Apply filters
    filterset = PropertyFilter(request.GET, queryset=properties)
    if filterset.is_valid():
        properties = filterset.qs

    # Serialize results
    serializer = PropertyListSerializer(properties, many=True)
    return Response({
        'count': properties.count(),
        'results': serializer.data
    })


class PropertyTypeListAPIView(generics.ListAPIView):
    """List all active property types"""
    queryset = PropertyType.objects.filter(is_active=True)
    serializer_class = PropertyTypeSerializer


class PropertyStatusListAPIView(generics.ListAPIView):
    """List all active property statuses"""
    queryset = PropertyStatus.objects.filter(is_active=True)
    serializer_class = PropertyStatusSerializer


class PropertyViewingCreateAPIView(generics.CreateAPIView):
    """Schedule property viewing"""
    queryset = PropertyViewing.objects.all()
    serializer_class = PropertyViewingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(viewer=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_properties_list(request):
    """
    Get properties owned by the current user (agent)
    Returns all properties created by the authenticated agent
    """
    try:
        # Get agent profile for current user
        agent_profile = request.user.agents_profile

        # Get all properties owned by this agent (both active and inactive)
        properties = Property.objects.filter(
            agent=agent_profile
        ).select_related(
            'property_type', 'status', 'area__city__region'
        ).prefetch_related('images').order_by('-created_at')

        # Serialize and return
        serializer = PropertyListSerializer(
            properties,
            many=True,
            context={'request': request}
        )

        return Response({
            'count': properties.count(),
            'results': serializer.data
        })

    except AgentProfile.DoesNotExist:
        return Response({
            'error': 'Agent profile not found. Please complete your agent registration.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error fetching properties: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def favorites_list(request):
    """Get user's favorite properties"""
    favorites = PropertyFavorite.objects.filter(
        user=request.user
    ).select_related('property', 'property__area__city')

    properties = [fav.property for fav in favorites]
    serializer = PropertyListSerializer(properties, many=True)
    return Response(serializer.data)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, slug):
    """Add or remove property from favorites"""
    property_obj = get_object_or_404(Property, slug=slug)

    if request.method == 'POST':
        favorite, created = PropertyFavorite.objects.get_or_create(
            user=request.user,
            property=property_obj
        )
        if created:
            return Response({'message': 'Added to favorites'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already in favorites'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        deleted_count, _ = PropertyFavorite.objects.filter(
            user=request.user,
            property=property_obj
        ).delete()
        if deleted_count:
            return Response({'message': 'Removed from favorites'}, status=status.HTTP_200_OK)
        return Response({'message': 'Not in favorites'}, status=status.HTTP_404_NOT_FOUND)