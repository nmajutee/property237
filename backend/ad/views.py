from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import AdPackage, Advertisement, AdBanner, PromotedProperty
from .serializers import (
    AdPackageSerializer, AdvertisementSerializer, AdvertisementCreateSerializer,
    AdBannerSerializer, PromotedPropertySerializer
)


class AdPackageListAPIView(generics.ListAPIView):
    """List active ad packages"""
    serializer_class = AdPackageSerializer
    permission_classes = [AllowAny]
    queryset = AdPackage.objects.filter(is_active=True).order_by('display_order', 'price')


class AdPackageDetailAPIView(generics.RetrieveAPIView):
    """Get ad package detail"""
    serializer_class = AdPackageSerializer
    permission_classes = [AllowAny]
    queryset = AdPackage.objects.filter(is_active=True)


# Advertisements (Campaigns)
class AdvertisementListCreateAPIView(generics.ListCreateAPIView):
    """List and create advertisements"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdvertisementCreateSerializer
        return AdvertisementSerializer

    def get_queryset(self):
        return Advertisement.objects.filter(advertiser=self.request.user).order_by('-created_at')


class AdvertisementDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, cancel advertisement"""
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Advertisement.objects.filter(advertiser=self.request.user)

    def perform_update(self, serializer):
        # Only allow updates on draft/pending ads
        instance = self.get_object()
        if instance.status not in ('draft', 'pending'):
            from rest_framework.exceptions import ValidationError
            raise ValidationError('Cannot update an active or expired ad')
        serializer.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_advertisement(request, pk):
    """Submit a draft ad for approval"""
    try:
        ad = Advertisement.objects.get(pk=pk, advertiser=request.user)
    except Advertisement.DoesNotExist:
        return Response({'error': 'Ad not found'}, status=status.HTTP_404_NOT_FOUND)
    if ad.status != 'draft':
        return Response({'error': 'Only draft ads can be submitted'}, status=status.HTTP_400_BAD_REQUEST)
    ad.status = 'pending'
    ad.save(update_fields=['status'])
    return Response(AdvertisementSerializer(ad).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pause_advertisement(request, pk):
    """Pause an active ad"""
    try:
        ad = Advertisement.objects.get(pk=pk, advertiser=request.user)
    except Advertisement.DoesNotExist:
        return Response({'error': 'Ad not found'}, status=status.HTTP_404_NOT_FOUND)
    if ad.status != 'active':
        return Response({'error': 'Only active ads can be paused'}, status=status.HTTP_400_BAD_REQUEST)
    ad.status = 'paused'
    ad.save(update_fields=['status'])
    return Response(AdvertisementSerializer(ad).data)


# Active ads for public display
class ActiveAdvertisementListAPIView(generics.ListAPIView):
    """List currently active advertisements (public)"""
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        qs = Advertisement.objects.filter(
            status='active', payment_status='paid',
            start_date__lte=now, end_date__gte=now
        )
        placement = self.request.query_params.get('placement')
        if placement:
            qs = qs.filter(placement=placement)
        return qs.order_by('-created_at')


# Ad Banners
class AdBannerListAPIView(generics.ListAPIView):
    """List active banners for a placement"""
    serializer_class = AdBannerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        qs = AdBanner.objects.filter(
            is_active=True, start_date__lte=now, end_date__gte=now
        )
        placement = self.request.query_params.get('placement')
        if placement:
            qs = qs.filter(placement=placement)
        size = self.request.query_params.get('size')
        if size:
            qs = qs.filter(size=size)
        return qs


# Promoted Properties
class PromotedPropertyListAPIView(generics.ListAPIView):
    """List currently promoted properties (public)"""
    serializer_class = PromotedPropertySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        qs = PromotedProperty.objects.filter(
            is_active=True, start_date__lte=now, end_date__gte=now
        ).order_by('-priority_score')
        promo_type = self.request.query_params.get('type')
        if promo_type:
            qs = qs.filter(promotion_type=promo_type)
        return qs


@api_view(['POST'])
@permission_classes([AllowAny])
def record_impression(request, pk):
    """Record an ad impression"""
    try:
        ad = Advertisement.objects.get(pk=pk, status='active')
    except Advertisement.DoesNotExist:
        return Response({'error': 'Ad not found'}, status=status.HTTP_404_NOT_FOUND)
    ad.impressions += 1
    ad.save(update_fields=['impressions'])
    return Response({'impressions': ad.impressions})


@api_view(['POST'])
@permission_classes([AllowAny])
def record_click(request, pk):
    """Record an ad click"""
    try:
        ad = Advertisement.objects.get(pk=pk, status='active')
    except Advertisement.DoesNotExist:
        return Response({'error': 'Ad not found'}, status=status.HTTP_404_NOT_FOUND)
    ad.clicks += 1
    ad.save(update_fields=['clicks'])
    return Response({'clicks': ad.clicks})
