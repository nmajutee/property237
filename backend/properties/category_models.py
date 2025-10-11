"""
Property Categories, Tags, and Status Models - Cameroon-Specific
Implements hierarchical category system with proper relationships
Tailored for Cameroon's real estate market
"""
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Hierarchical property categories (Parent/Subcategory structure)
    Cameroon-Specific Categories:
    Parent: RESIDENTIAL, COMMERCIAL, LAND, INVESTMENT
    Children: Apartment, Studio, Room, Office, Shop, etc. (single words)
    """
    # Parent category codes (Cameroon-specific)
    RESIDENTIAL = 'RESIDENTIAL'
    COMMERCIAL = 'COMMERCIAL'
    LAND = 'LAND'
    INVESTMENT = 'INVESTMENT'

    PARENT_CATEGORIES = [
        (RESIDENTIAL, 'Residential'),
        (COMMERCIAL, 'Commercial'),
        (LAND, 'Land'),
        (INVESTMENT, 'Investment'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True,
                           help_text="Unique code (e.g., RESIDENTIAL, apartment)")
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or name")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Categories'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent', 'is_active']),
        ]

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def is_parent(self):
        """Check if this is a parent category"""
        return self.parent is None

    def get_all_subcategories(self):
        """Get all subcategories for this parent"""
        if self.is_parent():
            return self.subcategories.filter(is_active=True)
        return Category.objects.none()

    @classmethod
    def get_parent_categories(cls):
        """Get all parent categories"""
        return cls.objects.filter(parent__isnull=True, is_active=True)


class PropertyTag(models.Model):
    """
    Tags for property filtering (For Sale, For Rent, Furnished, etc.)
    Tags can be associated with specific categories
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, max_length=120)
    description = models.TextField(blank=True)
    applies_to = models.ManyToManyField(
        Category,
        blank=True,
        related_name='tags',
        help_text="Categories this tag applies to (empty = applies to all)"
    )
    color = models.CharField(max_length=7, default='#3B82F6',
                            help_text="Hex color code for UI display")
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Property Tag'
        verbose_name_plural = 'Property Tags'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def applies_to_category(self, category):
        """Check if this tag applies to a given category"""
        if not self.applies_to.exists():
            return True  # Applies to all if none specified
        return self.applies_to.filter(pk=category.pk).exists()


class PropertyState(models.Model):
    """
    Property status/state management - Cameroon-Specific
    Defines valid states and which categories they apply to
    """
    # Status codes (Cameroon real estate lifecycle)
    AVAILABLE = 'available'
    SOLD = 'sold'
    RENTED = 'rented'
    UNDEROFFER = 'underoffer'
    PENDING = 'pending'
    INACTIVE = 'inactive'
    NEW = 'new'
    CONSTRUCTION = 'construction'
    OFFPLAN = 'offplan'
    RESERVED = 'reserved'
    EXPIRED = 'expired'
    DRAFT = 'draft'

    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (SOLD, 'Sold'),
        (RENTED, 'Rented'),
        (UNDEROFFER, 'Under Offer'),
        (PENDING, 'Pending'),
        (INACTIVE, 'Inactive'),
        (NEW, 'New'),
        (CONSTRUCTION, 'Under Construction'),
        (OFFPLAN, 'Off Plan'),
        (RESERVED, 'Reserved'),
        (EXPIRED, 'Expired'),
        (DRAFT, 'Draft'),
    ]

    code = models.CharField(max_length=50, unique=True, choices=STATUS_CHOICES)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    applies_to = models.ManyToManyField(
        Category,
        blank=True,
        related_name='states',
        help_text="Categories this state applies to (empty = applies to all)"
    )
    color = models.CharField(max_length=7, default='#10B981',
                            help_text="Status badge color")
    allows_inquiries = models.BooleanField(default=True,
                                          help_text="Can users inquire about properties in this state?")
    is_publicly_visible = models.BooleanField(default=True,
                                              help_text="Show properties in this state on public listings")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Property State'
        verbose_name_plural = 'Property States'

    def __str__(self):
        return self.name

    def applies_to_category(self, category):
        """Check if this state applies to a given category"""
        if not self.applies_to.exists():
            return True  # Applies to all if none specified
        return self.applies_to.filter(pk=category.pk).exists()


# Migration helper: Maps old PropertyType/PropertyStatus to new Category/PropertyState
# Cameroon-Specific Mappings
CATEGORY_MIGRATION_MAP = {
    # Old PropertyType names -> New Cameroon Category structure (single word subcategories)
    'chambre_modern': ('RESIDENTIAL', 'Room'),
    'studio': ('RESIDENTIAL', 'Studio'),
    'apartment': ('RESIDENTIAL', 'Apartment'),
    'bungalow': ('RESIDENTIAL', 'Bungalow'),
    'villa_duplex': ('RESIDENTIAL', 'Villa'),
    'guest_house': ('RESIDENTIAL', 'Guesthouse'),
    'land_plot': ('LAND', 'Residentialplot'),
    'office': ('COMMERCIAL', 'Office'),
    'shop': ('COMMERCIAL', 'Shop'),
    'warehouse': ('COMMERCIAL', 'Warehouse'),
    'commercial_land': ('LAND', 'Commercialplot'),
    'industrial': ('INVESTMENT', 'Factory'),
}

STATUS_MIGRATION_MAP = {
    # Old PropertyStatus -> New PropertyState (Cameroon)
    'draft': 'draft',
    'published': 'available',
    'available': 'available',
    'under_offer': 'underoffer',
    'pending': 'pending',
    'sold': 'sold',
    'rented': 'rented',
    'withdrawn': 'inactive',
}
