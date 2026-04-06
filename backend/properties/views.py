from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
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
        from django.db.models import Subquery, OuterRef, IntegerField, Value
        from django.db.models.functions import Coalesce
        from django.utils import timezone

        now = timezone.now()

        # Subquery: max priority_score of active promotions for each property
        from ad.models import PromotedProperty
        active_promo = PromotedProperty.objects.filter(
            property_listing=OuterRef('pk'),
            is_active=True,
            start_date__lte=now,
            end_date__gte=now,
        ).order_by('-priority_score').values('priority_score')[:1]

        return Property.objects.filter(
            is_active=True
        ).exclude(
            status__name='draft'
        ).select_related(
            'property_type', 'status', 'area__city__region', 'agent__user'
        ).prefetch_related('additional_features').annotate(
            promo_score=Coalesce(
                Subquery(active_promo, output_field=IntegerField()),
                Value(0),
            )
        ).order_by('-promo_score', '-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer

    def perform_create(self, serializer):
        # Ensure only agents can create properties
        import logging
        logger = logging.getLogger(__name__)

        logger.info(f"User creating property: {self.request.user.email}, type: {self.request.user.user_type}")

        if self.request.user.user_type == 'agent':
            # Try to get agent profile, create if doesn't exist
            try:
                agent_profile = self.request.user.agents_profile
                logger.info(f"Found existing agent profile: {agent_profile.id}")
            except AgentProfile.DoesNotExist:
                logger.info("Creating new agent profile")
                agent_profile = AgentProfile.objects.create(
                    user=self.request.user,
                    bio='Real estate agent',
                    is_verified=True,
                    terms_accepted=True,
                    data_consent_accepted=True
                )
                logger.info(f"Created agent profile: {agent_profile.id}")

            # Subscription enforcement: check property limit
            from tariffplans.models import UserSubscription
            active_sub = UserSubscription.objects.filter(
                user=self.request.user,
                status__in=['active', 'trial'],
            ).select_related('plan').first()

            if active_sub and active_sub.is_active:
                current_count = Property.objects.filter(agent=agent_profile, is_active=True).count()
                if current_count >= active_sub.plan.max_properties:
                    raise PermissionDenied(
                        f"Your {active_sub.plan.name} plan allows {active_sub.plan.max_properties} properties. "
                        f"You have {current_count}. Please upgrade your plan."
                    )

            try:
                instance = serializer.save(agent=agent_profile)
                logger.info("Property saved successfully")

                # Track subscription usage
                if active_sub and active_sub.is_active:
                    active_sub.properties_used += 1
                    active_sub.save(update_fields=['properties_used'])

                # Run auto-checks asynchronously
                try:
                    from moderation.tasks import run_listing_auto_checks
                    run_listing_auto_checks.delay(instance.id)
                except Exception:
                    pass
            except Exception as e:
                logger.error(f"Error saving property: {str(e)}", exc_info=True)
                raise
        else:
            logger.warning(f"Non-agent user {self.request.user.email} tried to create property")
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
        if self.request.method == 'GET':
            self._track_view(obj)
        return obj

    def _track_view(self, prop):
        """Record view event with deduplication (1 unique view per user/IP per hour)."""
        from analytics.models import PropertyViewEvent, PropertyAnalytics
        from django.utils import timezone as tz
        import datetime

        request = self.request
        user = request.user if request.user.is_authenticated else None
        ip = self._get_client_ip(request)
        one_hour_ago = tz.now() - datetime.timedelta(hours=1)

        # Deduplicate: check if same user/IP viewed this property in the last hour
        recent_qs = PropertyViewEvent.objects.filter(
            property=prop, viewed_at__gte=one_hour_ago,
        )
        if user:
            is_duplicate = recent_qs.filter(user=user).exists()
        else:
            is_duplicate = recent_qs.filter(ip_address=ip, user__isnull=True).exists()

        # Always increment total views
        prop.views_count += 1
        prop.save(update_fields=['views_count'])

        # Record event
        PropertyViewEvent.objects.create(
            property=prop,
            user=user,
            ip_address=ip,
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            referrer=request.META.get('HTTP_REFERER', '')[:200],
        )

        # Update PropertyAnalytics
        analytics, _ = PropertyAnalytics.objects.get_or_create(property=prop)
        analytics.total_views += 1
        analytics.this_month_views += 1
        if not is_duplicate:
            analytics.unique_views += 1
        analytics.save(update_fields=['total_views', 'unique_views', 'this_month_views'])

    @staticmethod
    def _get_client_ip(request):
        xff = request.META.get('HTTP_X_FORWARDED_FOR')
        if xff:
            return xff.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def perform_update(self, serializer):
        # Only property owner or admin can update
        property_obj = self.get_object()
        if (self.request.user == property_obj.agent.user or
            self.request.user.is_staff):
            serializer.save()
        else:
            raise PermissionDenied("You don't have permission to update this property")

    def perform_destroy(self, instance):
        # Only property owner or admin can delete
        import logging
        logger = logging.getLogger(__name__)

        logger.info(f"Delete attempt - User: {self.request.user}, Property: {instance.title}")
        logger.info(f"Property agent: {instance.agent}, Agent user: {instance.agent.user if instance.agent else 'No agent'}")
        logger.info(f"Is staff: {self.request.user.is_staff}")
        logger.info(f"Match: {self.request.user == instance.agent.user if instance.agent else False}")

        if not instance.agent:
            raise PermissionDenied("Property has no agent assigned")

        if (self.request.user == instance.agent.user or
            self.request.user.is_staff):
            logger.info(f"Deleting property {instance.title}")
            instance.delete()
            logger.info(f"Property {instance.title} deleted successfully")
        else:
            raise PermissionDenied("You don't have permission to delete this property")


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
    permission_classes = [AllowAny]
    queryset = PropertyType.objects.filter(is_active=True)
    serializer_class = PropertyTypeSerializer


class PropertyStatusListAPIView(generics.ListAPIView):
    """List all active property statuses"""
    permission_classes = [AllowAny]
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
    Returns ALL properties created by the authenticated agent (including drafts, inactive, etc.)
    This is different from the public API which only shows published/available properties
    """
    import logging
    logger = logging.getLogger(__name__)

    try:
        logger.info(f"Fetching properties for user: {request.user.email}")

        # Get agent profile for current user
        agent_profile = request.user.agents_profile
        logger.info(f"Found agent profile: {agent_profile.id}")

        # Get all properties owned by this agent (both active and inactive)
        properties = Property.objects.filter(
            agent=agent_profile
        ).select_related(
            'property_type', 'status', 'area__city__region'
        ).prefetch_related('images').order_by('-created_at')

        logger.info(f"Found {properties.count()} properties")

        # Serialize and return
        serializer = PropertyListSerializer(
            properties,
            many=True,
            context={'request': request}
        )

        # Debug: Log image data for each property
        for prop_data in serializer.data:
            logger.info(f"Property: {prop_data.get('title')}")
            logger.info(f"  Images count: {len(prop_data.get('images', []))}")
            if prop_data.get('images'):
                for idx, img in enumerate(prop_data['images']):
                    logger.info(f"  Image {idx}: image_url={img.get('image_url')}, thumbnail_url={img.get('thumbnail_url')}")
            logger.info(f"  Primary image: {prop_data.get('primary_image')}")

        return Response({
            'count': properties.count(),
            'results': serializer.data
        })

    except AgentProfile.DoesNotExist:
        logger.error(f"Agent profile not found for user: {request.user.email}")
        return Response({
            'error': 'Agent profile not found. Please complete your agent registration.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f'Error fetching properties: {str(e)}', exc_info=True)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_properties(request):
    """List properties pending moderation (admin only)"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    properties = Property.objects.filter(is_active=False).select_related(
        'property_type', 'status', 'area__city__region', 'agent__user'
    ).order_by('-created_at')
    serializer = PropertyListSerializer(properties, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_property(request, pk):
    """Approve a property listing (admin only)"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    prop = get_object_or_404(Property, pk=pk)
    prop.is_active = True
    prop.save()

    from moderation.views import log_moderation_action
    log_moderation_action(
        request.user, 'property_approved', prop,
        reason=request.data.get('reason', 'Listing approved'),
    )

    return Response({'message': 'Property approved', 'id': prop.id})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_property(request, pk):
    """Reject a property listing (admin only)"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    prop = get_object_or_404(Property, pk=pk)

    from moderation.views import log_moderation_action
    log_moderation_action(
        request.user, 'property_rejected', prop,
        reason=request.data.get('reason', 'Listing rejected'),
    )

    prop.delete()
    return Response({'message': 'Property rejected and removed'})


@api_view(['GET'])
def proximity_search(request):
    """
    Search properties near a location using Haversine formula.
    Query params: lat, lng, radius_km (default 5), plus all PropertyFilter params.
    Works with both SQLite and PostgreSQL (no PostGIS required).
    """
    lat = request.query_params.get('lat')
    lng = request.query_params.get('lng')
    radius_km = float(request.query_params.get('radius_km', 5))

    if not lat or not lng:
        return Response(
            {'error': 'lat and lng query parameters are required'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        return Response(
            {'error': 'lat and lng must be valid numbers'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if radius_km <= 0 or radius_km > 200:
        return Response(
            {'error': 'radius_km must be between 0 and 200'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from django.db.models import F, FloatField, Value
    from django.db.models.functions import Cos, Sin, ACos, Radians
    import math

    # Haversine via Django ORM expressions
    # distance = 6371 * acos(cos(radians(lat)) * cos(radians(prop_lat)) *
    #            cos(radians(prop_lng) - radians(lng)) +
    #            sin(radians(lat)) * sin(radians(prop_lat)))
    base_qs = Property.objects.filter(is_active=True).exclude(status__name='draft')

    # Apply standard filters first
    filterset = PropertyFilter(request.GET, queryset=base_qs)
    if filterset.is_valid():
        base_qs = filterset.qs

    # Properties with direct coordinates
    qs_direct = base_qs.filter(latitude__isnull=False, longitude__isnull=False)
    # Properties without coords — use area lat/lng
    qs_area = base_qs.filter(
        latitude__isnull=True,
        area__latitude__isnull=False,
        area__longitude__isnull=False,
    )

    results = []
    lat_rad = math.radians(lat)
    lng_rad = math.radians(lng)

    # Process direct-coordinate properties
    for prop in qs_direct.select_related('property_type', 'status', 'area__city__region', 'agent__user'):
        p_lat = float(prop.latitude)
        p_lng = float(prop.longitude)
        dist = _haversine(lat, lng, p_lat, p_lng)
        if dist <= radius_km:
            results.append((dist, prop))

    # Process area-coordinate properties
    for prop in qs_area.select_related('property_type', 'status', 'area__city__region', 'agent__user'):
        p_lat = float(prop.area.latitude)
        p_lng = float(prop.area.longitude)
        dist = _haversine(lat, lng, p_lat, p_lng)
        if dist <= radius_km:
            results.append((dist, prop))

    # Sort by distance
    results.sort(key=lambda x: x[0])

    # Serialize
    properties = [r[1] for r in results]
    serializer = PropertyListSerializer(properties, many=True, context={'request': request})

    # Attach distance to each result
    data = serializer.data
    for i, (dist, _) in enumerate(results):
        if i < len(data):
            data[i]['distance_km'] = round(dist, 2)

    return Response({
        'count': len(data),
        'center': {'lat': lat, 'lng': lng},
        'radius_km': radius_km,
        'results': data,
    })


def _haversine(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two points using Haversine formula."""
    import math
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


@api_view(['GET'])
def similar_properties(request, slug):
    """Find similar properties based on area, type, price range."""
    prop = get_object_or_404(Property, slug=slug, is_active=True)
    price_range = float(prop.price) * 0.3  # 30% price range

    similar = Property.objects.filter(
        is_active=True,
        area__city=prop.area.city,
        listing_type=prop.listing_type,
        price__gte=float(prop.price) - price_range,
        price__lte=float(prop.price) + price_range,
    ).exclude(
        id=prop.id
    ).exclude(
        status__name='draft'
    ).select_related(
        'property_type', 'status', 'area__city__region', 'agent__user'
    ).order_by('-created_at')[:10]

    serializer = PropertyListSerializer(similar, many=True, context={'request': request})
    return Response(serializer.data)