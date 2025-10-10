from django.contrib import admin
from .models import Property, PropertyType, PropertyStatus, PropertyFeature
from media.models import PropertyImage


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'subtype', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']


@admin.register(PropertyStatus)
class PropertyStatusAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'allows_inquiries']
    list_filter = ['is_active', 'allows_inquiries']
    search_fields = ['name', 'description']


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ['image', 'caption', 'is_primary', 'display_order']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'property_type', 'status', 'price',
        'location_display', 'agent', 'created_at', 'is_verified'
    ]
    list_filter = [
        'property_type', 'status', 'is_verified',
        'created_at', 'listing_type'
    ]
    search_fields = ['title', 'description', 'agent__user__email']
    readonly_fields = ['created_at', 'updated_at', 'verified_at']
    inlines = [PropertyImageInline]

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title', 'description', 'property_type',
                'status', 'listing_type'
            )
        }),
        ('Location', {
            'fields': (
                'area', 'distance_from_main_road', 'road_is_tarred',
                'vehicle_access'
            )
        }),
        ('Property Details', {
            'fields': (
                'no_of_bedrooms', 'no_of_living_rooms', 'no_of_bathrooms',
                'no_of_kitchens', 'kitchen_type', 'no_of_balconies',
                'no_of_floors', 'floor_number', 'room_size', 'has_dressing_cupboard'
            )
        }),
        ('Utilities', {
            'fields': (
                'electricity_type', 'electricity_payment', 'water_type',
                'has_ac_preinstalled', 'has_hot_water', 'has_generator'
            )
        }),
        ('Amenities', {
            'fields': (
                'has_parking', 'has_security', 'has_pool',
                'has_gym', 'has_elevator'
            )
        }),
        ('Pricing', {
            'fields': (
                'price', 'currency', 'initial_months_payable',
                'caution_months', 'visit_fee', 'requires_contract_registration'
            )
        }),
        ('For Sale (Land)', {
            'fields': (
                'land_size_sqm', 'has_land_title', 'land_title_type',
                'cadastral_id', 'land_type', 'area_characteristics'
            ),
            'classes': ('collapse',)
        }),
        ('For Guest House', {
            'fields': (
                'price_per_day', 'price_negotiable', 'has_refundable_caution'
            ),
            'classes': ('collapse',)
        }),
        ('Agent Information', {
            'fields': ('agent', 'agent_commission_percentage', 'agent_commission_months')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verified_at', 'verified_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def location_display(self, obj):
        """Display formatted location"""
        if obj.area:
            return f"{obj.area.name}, {obj.area.city.name}, {obj.area.city.region.name}"
        return 'N/A'
    location_display.short_description = 'Location'


@admin.register(PropertyFeature)
class PropertyFeatureAdmin(admin.ModelAdmin):
    list_display = ['property_listing', 'feature_name', 'feature_value', 'is_highlighted']
    list_filter = ['is_highlighted']
    search_fields = ['feature_name', 'property_listing__title']
    list_select_related = ['property_listing']
