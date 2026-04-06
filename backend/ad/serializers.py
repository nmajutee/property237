from rest_framework import serializers
from .models import AdPackage, Advertisement, AdBanner, PromotedProperty


class AdPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdPackage
        fields = [
            'id', 'name', 'description', 'duration_days', 'price', 'currency',
            'featured_listing', 'priority_placement', 'social_media_boost',
            'email_marketing', 'analytics_access', 'max_photos', 'max_videos',
            'virtual_tour_included', 'display_order', 'is_popular', 'is_active'
        ]


class AdvertisementSerializer(serializers.ModelSerializer):
    click_through_rate = serializers.FloatField(read_only=True)
    conversion_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = Advertisement
        fields = [
            'id', 'property_listing', 'package', 'title', 'description',
            'call_to_action', 'target_url', 'placement', 'target_audience',
            'start_date', 'end_date', 'status', 'total_cost', 'paid_amount',
            'currency', 'payment_status', 'impressions', 'clicks', 'conversions',
            'click_through_rate', 'conversion_rate', 'rejection_reason',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'impressions', 'clicks', 'conversions', 'paid_amount',
            'approved_by', 'approved_at', 'rejection_reason', 'created_at', 'updated_at'
        ]


class AdvertisementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = [
            'property_listing', 'package', 'title', 'description',
            'call_to_action', 'target_url', 'placement', 'target_audience',
            'start_date', 'end_date'
        ]

    def create(self, validated_data):
        validated_data['advertiser'] = self.context['request'].user
        package = validated_data['package']
        validated_data['total_cost'] = package.price
        validated_data['currency'] = package.currency
        return super().create(validated_data)


class AdBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdBanner
        fields = [
            'id', 'title', 'image', 'link_url', 'alt_text', 'size',
            'placement', 'start_date', 'end_date', 'is_active',
            'cost_per_impression', 'cost_per_click', 'max_budget',
            'spent_budget', 'impressions', 'clicks', 'created_at'
        ]
        read_only_fields = ['id', 'spent_budget', 'impressions', 'clicks', 'created_at']


class PromotedPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotedProperty
        fields = [
            'id', 'property_listing', 'agent', 'promotion_type',
            'start_date', 'end_date', 'is_active', 'cost', 'currency',
            'priority_score', 'badge_text', 'highlight_color', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
