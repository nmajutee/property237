from rest_framework import serializers
from .models import (
    PaymentMethod, Currency, Transaction, PaymentAccount,
    Invoice, Refund, WalletBalance
)


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'name', 'code', 'gateway_type', 'description',
            'is_online', 'is_active', 'processing_fee_percentage',
            'fixed_fee', 'min_amount', 'max_amount', 'icon', 'color'
        ]


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'exchange_rate', 'is_base_currency', 'is_active']


class TransactionSerializer(serializers.ModelSerializer):
    payment_method_name = serializers.SerializerMethodField()
    currency_code = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'transaction_type', 'status',
            'amount', 'currency', 'currency_code', 'processing_fee',
            'platform_fee', 'total_amount', 'payment_method',
            'payment_method_name', 'phone_number',
            'gateway_transaction_id', 'momo_transaction_id',
            'lease', 'related_property', 'description', 'notes',
            'receipt_url', 'invoice_number', 'created_at', 'processed_at',
            'refunded_amount', 'refund_reason'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'total_amount', 'created_at',
            'processed_at', 'gateway_transaction_id', 'momo_transaction_id',
            'refunded_amount'
        ]

    def get_payment_method_name(self, obj):
        return obj.payment_method.name if obj.payment_method else None

    def get_currency_code(self, obj):
        return obj.currency.code if obj.currency else 'XAF'


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'transaction_type', 'amount', 'currency', 'payment_method',
            'phone_number', 'lease', 'related_property',
            'maintenance_request', 'advertisement', 'tariff_plan',
            'description'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Calculate fees
        pm = validated_data.get('payment_method')
        if pm:
            validated_data['processing_fee'] = (
                validated_data['amount'] * pm.processing_fee_percentage / 100 + pm.fixed_fee
            )
        validated_data['platform_fee'] = 0
        return super().create(validated_data)


class PaymentAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentAccount
        fields = [
            'id', 'account_type', 'account_name', 'account_number',
            'bank_name', 'bank_code', 'phone_number',
            'is_verified', 'is_primary', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'subject', 'description',
            'amount', 'tax_amount', 'discount_amount', 'total_amount',
            'currency', 'issue_date', 'due_date', 'paid_date',
            'status', 'pdf_file', 'created_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'total_amount', 'created_at']


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = [
            'id', 'transaction', 'refund_type', 'amount', 'reason',
            'status', 'processing_notes', 'requested_at', 'completed_at'
        ]
        read_only_fields = ['id', 'status', 'processing_notes', 'requested_at', 'completed_at']


class WalletBalanceSerializer(serializers.ModelSerializer):
    currency_code = serializers.SerializerMethodField()
    available_balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = WalletBalance
        fields = ['id', 'currency', 'currency_code', 'balance', 'locked_balance', 'available_balance']
        read_only_fields = ['id', 'balance', 'locked_balance']

    def get_currency_code(self, obj):
        return obj.currency.code if obj.currency else 'XAF'
