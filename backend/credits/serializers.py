"""
Credit System Serializers
Secure serialization for credit operations
"""
from rest_framework import serializers
from django.utils import timezone
from decimal import Decimal
from .models import (
    CreditBalance,
    CreditPackage,
    CreditTransaction,
    CreditPricing,
    PropertyView
)


class CreditBalanceSerializer(serializers.ModelSerializer):
    """Serialize user credit balance"""

    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    has_low_balance = serializers.SerializerMethodField()

    class Meta:
        model = CreditBalance
        fields = [
            'balance',
            'total_purchased',
            'total_spent',
            'total_earned',
            'last_purchase_at',
            'user_email',
            'user_type',
            'has_low_balance'
        ]
        read_only_fields = fields

    def get_has_low_balance(self, obj):
        """Check if balance is below threshold"""
        LOW_BALANCE_THRESHOLD = Decimal('5.00')
        return obj.balance < LOW_BALANCE_THRESHOLD


class CreditPackageSerializer(serializers.ModelSerializer):
    """Serialize credit packages for purchase"""

    total_credits = serializers.IntegerField(read_only=True)
    price_per_credit = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = CreditPackage
        fields = [
            'id',
            'name',
            'credits',
            'bonus_credits',
            'total_credits',
            'price',
            'currency',
            'price_per_credit',
            'is_popular'
        ]
        read_only_fields = fields


class CreditTransactionSerializer(serializers.ModelSerializer):
    """Serialize credit transactions"""

    user_email = serializers.EmailField(source='user.email', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True, allow_null=True)

    class Meta:
        model = CreditTransaction
        fields = [
            'id',
            'user_email',
            'transaction_type',
            'amount',
            'status',
            'balance_before',
            'balance_after',
            'description',
            'package_name',
            'payment_method',
            'created_at',
            'completed_at'
        ]
        read_only_fields = fields


class CreditPurchaseSerializer(serializers.Serializer):
    """Serialize credit purchase request"""

    package_id = serializers.UUIDField(required=True)
    payment_method = serializers.ChoiceField(
        choices=['momo', 'orange_money', 'card'],
        required=True
    )
    phone_number = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Phone number for mobile money payment"
    )

    def validate_package_id(self, value):
        """Validate package exists and is active"""
        try:
            package = CreditPackage.objects.get(id=value, is_active=True)
        except CreditPackage.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive credit package")
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        payment_method = attrs.get('payment_method')
        phone_number = attrs.get('phone_number')

        # Phone number required for mobile money
        if payment_method in ['momo', 'orange_money'] and not phone_number:
            raise serializers.ValidationError({
                'phone_number': 'Phone number is required for mobile money payments'
            })

        return attrs


class PropertyViewSerializer(serializers.ModelSerializer):
    """Serialize property view records"""

    property_title = serializers.CharField(source='property.title', read_only=True)
    credits_spent = serializers.DecimalField(
        source='transaction.amount',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = PropertyView
        fields = [
            'property',
            'property_title',
            'credits_spent',
            'viewed_at'
        ]
        read_only_fields = fields


class CreditUsageSerializer(serializers.Serializer):
    """Serialize credit usage request"""

    action = serializers.ChoiceField(
        choices=[
            CreditPricing.ACTION_VIEW_PROPERTY,
            CreditPricing.ACTION_LIST_PROPERTY,
            CreditPricing.ACTION_FEATURED_LISTING,
            CreditPricing.ACTION_CONTACT_REVEAL,
        ],
        required=True
    )
    reference_id = serializers.CharField(
        required=True,
        help_text="Property ID or other reference"
    )

    def validate(self, attrs):
        """Validate credit usage request"""
        user = self.context['request'].user
        action = attrs['action']
        reference_id = attrs['reference_id']

        # Check if user has credit balance
        try:
            balance = user.credit_balance
        except CreditBalance.DoesNotExist:
            raise serializers.ValidationError("Credit balance not found")

        # Get required credits for action
        credits_required = CreditPricing.get_price(action)

        # Check sufficient balance
        if not balance.has_credits(credits_required):
            raise serializers.ValidationError({
                'detail': f'Insufficient credits. Required: {credits_required}, Available: {balance.balance}'
            })

        # For property views, check if already viewed
        if action == CreditPricing.ACTION_VIEW_PROPERTY:
            if PropertyView.objects.filter(
                user=user,
                property_id=reference_id
            ).exists():
                raise serializers.ValidationError({
                    'detail': 'You have already viewed this property'
                })

        attrs['credits_required'] = credits_required
        return attrs


class CreditPricingSerializer(serializers.ModelSerializer):
    """Serialize credit pricing rules"""

    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = CreditPricing
        fields = [
            'action',
            'action_display',
            'credits_required',
            'description',
            'is_active'
        ]
        read_only_fields = fields
