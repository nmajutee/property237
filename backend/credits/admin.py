from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum
from .models import (
    CreditBalance,
    CreditPackage,
    CreditTransaction,
    CreditPricing,
    PropertyView
)


@admin.register(CreditBalance)
class CreditBalanceAdmin(admin.ModelAdmin):
    list_display = [
        'user_email',
        'balance',
        'total_purchased',
        'total_spent',
        'total_earned',
        'last_purchase_at',
        'created_at'
    ]
    list_filter = ['created_at', 'last_purchase_at']
    search_fields = ['user__email', 'user__username', 'user__phone_number']
    readonly_fields = [
        'user',
        'balance',
        'total_purchased',
        'total_spent',
        'total_earned',
        'created_at',
        'updated_at',
        'last_purchase_at'
    ]

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CreditPackage)
class CreditPackageAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'credits',
        'bonus_credits',
        'total_credits',
        'price',
        'currency',
        'price_per_credit',
        'is_popular',
        'is_active',
        'display_order'
    ]
    list_filter = ['is_active', 'is_popular', 'currency']
    search_fields = ['name']
    list_editable = ['is_popular', 'is_active', 'display_order']
    ordering = ['display_order', 'price']

    fieldsets = (
        ('Package Details', {
            'fields': ('name', 'credits', 'bonus_credits', 'price', 'currency')
        }),
        ('Display Settings', {
            'fields': ('is_popular', 'is_active', 'display_order')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']


@admin.register(CreditTransaction)
class CreditTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user_email',
        'transaction_type',
        'amount',
        'status',
        'payment_method',
        'created_at'
    ]
    list_filter = [
        'transaction_type',
        'status',
        'payment_method',
        'created_at'
    ]
    search_fields = [
        'user__email',
        'user__username',
        'reference_id',
        'payment_reference'
    ]
    readonly_fields = [
        'id',
        'user',
        'transaction_type',
        'amount',
        'balance_before',
        'balance_after',
        'package',
        'payment_reference',
        'created_at',
        'completed_at'
    ]

    fieldsets = (
        ('Transaction Info', {
            'fields': (
                'id',
                'user',
                'transaction_type',
                'amount',
                'status',
                'description'
            )
        }),
        ('Balance Tracking', {
            'fields': ('balance_before', 'balance_after')
        }),
        ('Payment Details', {
            'fields': (
                'package',
                'payment_method',
                'payment_reference',
                'payment_amount',
                'payment_currency'
            ),
            'classes': ('collapse',)
        }),
        ('Reference Data', {
            'fields': ('reference_id', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Security', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at')
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(CreditPricing)
class CreditPricingAdmin(admin.ModelAdmin):
    list_display = [
        'action',
        'credits_required',
        'is_active',
        'updated_at'
    ]
    list_filter = ['is_active', 'action']
    list_editable = ['credits_required', 'is_active']

    fieldsets = (
        ('Pricing Rule', {
            'fields': ('action', 'credits_required', 'description', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']


@admin.register(PropertyView)
class PropertyViewAdmin(admin.ModelAdmin):
    list_display = [
        'user_email',
        'property_id',
        'viewed_at',
        'transaction_link'
    ]
    list_filter = ['viewed_at']
    search_fields = [
        'user__email',
        'user__username',
        'property__id'
    ]
    readonly_fields = [
        'user',
        'property',
        'transaction',
        'viewed_at',
        'ip_address'
    ]

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'

    def property_id(self, obj):
        return f"Property #{obj.property.id}"
    property_id.short_description = 'Property'

    def transaction_link(self, obj):
        if obj.transaction:
            return format_html(
                '<a href="/admin/credits/credittransaction/{}/change/">{}</a>',
                obj.transaction.id,
                obj.transaction.id
            )
        return '-'
    transaction_link.short_description = 'Transaction'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
