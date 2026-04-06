from rest_framework import serializers
from .models import (
    TariffCategory, TariffPlan, PlanFeature, PlanFeatureValue,
    UserSubscription, SubscriptionUsage, PlanUpgrade
)


class TariffCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TariffCategory
        fields = ['id', 'name', 'description', 'target_audience', 'is_active', 'display_order']


class PlanFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanFeature
        fields = ['id', 'name', 'description', 'feature_type', 'category', 'is_core_feature']


class PlanFeatureValueSerializer(serializers.ModelSerializer):
    feature = PlanFeatureSerializer(read_only=True)

    class Meta:
        model = PlanFeatureValue
        fields = ['id', 'feature', 'value', 'is_unlimited', 'is_included']


class TariffPlanSerializer(serializers.ModelSerializer):
    category = TariffCategorySerializer(read_only=True)
    feature_values = PlanFeatureValueSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    monthly_equivalent_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = TariffPlan
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'plan_type',
            'price', 'original_price', 'currency', 'billing_cycle',
            'trial_days', 'setup_fee',
            'max_properties', 'max_photos_per_property', 'max_videos_per_property',
            'max_virtual_tours', 'max_featured_properties',
            'max_ad_campaigns', 'max_promoted_properties',
            'social_media_posting', 'email_marketing',
            'basic_analytics', 'advanced_analytics', 'custom_reports', 'export_data',
            'email_support', 'phone_support', 'priority_support', 'dedicated_manager',
            'api_access', 'api_calls_per_month', 'webhook_support', 'third_party_integrations',
            'remove_branding', 'custom_domain', 'custom_themes', 'white_label',
            'is_popular', 'is_featured', 'display_order', 'badge_text', 'highlight_color',
            'feature_values', 'discount_percentage', 'monthly_equivalent_price',
            'created_at'
        ]


class TariffPlanListSerializer(serializers.ModelSerializer):
    """Lightweight plan listing"""
    category_name = serializers.SerializerMethodField()
    discount_percentage = serializers.IntegerField(read_only=True)

    class Meta:
        model = TariffPlan
        fields = [
            'id', 'name', 'slug', 'plan_type', 'price', 'original_price',
            'currency', 'billing_cycle', 'category_name',
            'max_properties', 'is_popular', 'is_featured',
            'badge_text', 'highlight_color', 'discount_percentage',
            'display_order'
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = TariffPlanListSerializer(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            'id', 'plan', 'status', 'start_date', 'end_date',
            'trial_end_date', 'next_billing_date', 'amount_paid',
            'currency', 'billing_cycle', 'auto_renew',
            'cancelled_at', 'cancellation_reason',
            'properties_used', 'photos_used', 'videos_used', 'api_calls_used',
            'is_active', 'days_remaining', 'created_at'
        ]
        read_only_fields = [
            'id', 'start_date', 'end_date', 'amount_paid',
            'properties_used', 'photos_used', 'videos_used', 'api_calls_used',
            'created_at'
        ]


class SubscribeSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()
    billing_cycle = serializers.ChoiceField(choices=TariffPlan.BILLING_CYCLES, default='monthly')
    auto_renew = serializers.BooleanField(default=True)


class SubscriptionUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionUsage
        fields = ['id', 'usage_type', 'quantity', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class PlanUpgradeSerializer(serializers.ModelSerializer):
    from_plan_name = serializers.SerializerMethodField()
    to_plan_name = serializers.SerializerMethodField()

    class Meta:
        model = PlanUpgrade
        fields = [
            'id', 'from_plan', 'from_plan_name', 'to_plan',
            'to_plan_name', 'change_type', 'proration_credit',
            'additional_charge', 'effective_date', 'requested_at', 'reason'
        ]
        read_only_fields = ['id', 'requested_at']

    def get_from_plan_name(self, obj):
        return obj.from_plan.name

    def get_to_plan_name(self, obj):
        return obj.to_plan.name
