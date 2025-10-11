"""
Django Admin Configuration for Property Categories System
Cameroon-Specific Implementation
"""

from django.contrib import admin
from django.utils.html import format_html
from .category_models import Category, PropertyTag, PropertyState


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for managing property categories (Cameroon-specific).
    Supports hierarchical parent-child relationships.
    """
    list_display = [
        'name',
        'code',
        'parent_category',
        'is_active',
        'order',
        'property_count',
        'created_at',
    ]
    list_filter = [
        'is_active',
        'parent',
        'created_at',
    ]
    search_fields = [
        'name',
        'code',
        'slug',
        'description',
    ]
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['parent__name', 'order', 'name']
    list_editable = ['is_active', 'order']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'slug', 'description')
        }),
        ('Hierarchy', {
            'fields': ('parent', 'order'),
            'description': 'Set parent category for subcategories. Leave blank for top-level categories.'
        }),
        ('Status', {
            'fields': ('is_active',),
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

    def parent_category(self, obj):
        """Display parent category name"""
        if obj.parent:
            return obj.parent.name
        return '—'
    parent_category.short_description = 'Parent Category'

    def property_count(self, obj):
        """Display count of properties in this category"""
        # This will be implemented when Property model is updated
        return '—'
    property_count.short_description = 'Properties'

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('parent')


@admin.register(PropertyTag)
class PropertyTagAdmin(admin.ModelAdmin):
    """
    Admin interface for managing property tags (Cameroon-specific).
    Tags can be associated with specific categories.
    """
    list_display = [
        'name',
        'color_badge',
        'icon',
        'order',
        'is_active',
        'category_list',
        'property_count',
    ]
    list_filter = [
        'is_active',
        'applies_to',
    ]
    search_fields = [
        'name',
        'description',
    ]
    filter_horizontal = ['applies_to']
    ordering = ['order', 'name']
    list_editable = ['is_active', 'order']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Visual Display', {
            'fields': ('color', 'icon', 'order'),
            'description': 'Color in hex format (e.g., #10B981). Icon is optional.'
        }),
        ('Category Association', {
            'fields': ('applies_to',),
            'description': 'Select which categories this tag applies to. Leave empty for all categories.'
        }),
        ('Status', {
            'fields': ('is_active',),
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ['created_at']

    def color_badge(self, obj):
        """Display color as a visual badge"""
        return format_html(
            '<span style="background-color: {}; padding: 3px 10px; border-radius: 3px; color: white;">{}</span>',
            obj.color,
            obj.name
        )
    color_badge.short_description = 'Tag Preview'

    def category_list(self, obj):
        """Display list of associated categories"""
        categories = obj.applies_to.all()
        if not categories:
            return 'All Categories'
        return ', '.join([cat.name for cat in categories[:3]])
    category_list.short_description = 'Applies To'

    def property_count(self, obj):
        """Display count of properties with this tag"""
        # This will be implemented when Property model is updated
        return '—'
    property_count.short_description = 'Properties'

    def get_queryset(self, request):
        """Optimize queryset with prefetch_related"""
        qs = super().get_queryset(request)
        return qs.prefetch_related('applies_to')


@admin.register(PropertyState)
class PropertyStateAdmin(admin.ModelAdmin):
    """
    Admin interface for managing property states/statuses (Cameroon-specific).
    Controls property lifecycle and visibility.
    """
    list_display = [
        'name',
        'code',
        'state_badge',
        'order',
        'is_active',
        'publicly_visible',
        'allows_inquiries',
        'property_count',
    ]
    list_filter = [
        'is_active',
        'is_publicly_visible',
        'allows_inquiries',
    ]
    search_fields = [
        'name',
        'code',
        'description',
    ]
    ordering = ['order', 'name']
    list_editable = ['is_active', 'order']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Visual Display', {
            'fields': ('color', 'order'),
            'description': 'Color in hex format (e.g., #10B981)'
        }),
        ('Permissions & Visibility', {
            'fields': ('is_publicly_visible', 'allows_inquiries'),
            'description': 'Control whether properties in this state are visible and can receive inquiries'
        }),
        ('Status', {
            'fields': ('is_active',),
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ['created_at']

    def state_badge(self, obj):
        """Display state as a visual badge"""
        return format_html(
            '<span style="background-color: {}; padding: 3px 10px; border-radius: 3px; color: white;">{}</span>',
            obj.color,
            obj.name
        )
    state_badge.short_description = 'State Preview'

    def publicly_visible(self, obj):
        """Display visibility status with icon"""
        if obj.is_publicly_visible:
            return format_html('✓ <span style="color: green;">Visible</span>')
        return format_html('✗ <span style="color: gray;">Hidden</span>')
    publicly_visible.short_description = 'Public'

    def property_count(self, obj):
        """Display count of properties in this state"""
        # This will be implemented when Property model is updated
        return '—'
    property_count.short_description = 'Properties'


# Admin site customization
admin.site.site_header = 'Property237 Administration'
admin.site.site_title = 'Property237 Admin'
admin.site.index_title = 'Cameroon Real Estate Management'
