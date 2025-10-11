from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from django.utils.text import slugify

# Import category models
from .category_models import Category, PropertyTag, PropertyState

User = get_user_model()


class PropertyType(models.Model):
    """
    Standardized property classifications for residential and commercial
    """
    PROPERTY_CATEGORIES = (
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
    )

    PROPERTY_SUBTYPES = (
        # Residential subtypes
        ('chambre_modern', 'Chambre Modern/Room'),
        ('studio', 'Studio'),
        ('apartment', 'Apartment'),
        ('bungalow', 'Bungalow'),
        ('villa_duplex', 'Villa/Duplex'),
        ('guest_house', 'Guest House'),
        ('land_plot', 'Land Plot'),

        # Commercial subtypes
        ('office', 'Office'),
        ('shop', 'Shop/Store'),
        ('warehouse', 'Warehouse'),
        ('commercial_land', 'Commercial Land'),
        ('industrial', 'Industrial Space'),
    )

    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=20, choices=PROPERTY_CATEGORIES)
    subtype = models.CharField(max_length=20, choices=PROPERTY_SUBTYPES, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return self.name


class PropertyStatus(models.Model):
    """
    Enhanced property availability status with listing status
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('available', 'Available'),
        ('under_offer', 'Under Offer'),
        ('pending', 'Pending'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
        ('withdrawn', 'Withdrawn'),
    )

    name = models.CharField(max_length=20, choices=STATUS_CHOICES, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    allows_inquiries = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Property Statuses"

    def __str__(self):
        return self.get_name_display()


class Property(models.Model):
    """
    Main Property model with Cameroon-specific features
    """
    LISTING_TYPES = (
        ('rent', 'For Rent'),
        ('sale', 'For Sale'),
        ('guest_house', 'Guest House'),
    )

    ELECTRICITY_TYPES = (
        ('private_meter', 'Private Meter'),
        ('shared_meter', 'Shared Meter'),
    )

    ELECTRICITY_PAYMENT = (
        ('prepaid', 'Prepaid'),
        ('postpaid', 'Postpaid'),
    )

    WATER_TYPES = (
        ('camwater', 'Camwater'),
        ('forage', 'Forage/Borehole'),
    )

    KITCHEN_TYPES = (
        ('full_size', 'Full Size Kitchen'),
        ('partial', 'Partial/Corner Kitchen'),
    )

    LAND_TYPES = (
        ('family_land', 'Family Land'),
        ('private_land', 'Private Land'),
        ('community_land', 'Community Land'),
        ('reclaimed_land', 'Reclaimed Land'),
    )

    AREA_CHARACTERISTICS = (
        ('swampy', 'Swampy'),
        ('dry', 'Dry'),
        ('forest_area', 'Forest Area'),
    )

    VEHICLE_ACCESS = (
        ('bike', 'Reachable by Bike'),
        ('low_car', 'Reachable by Low Car/Sedan'),
        ('suv', 'Reachable by SUV'),
    )

    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    status = models.ForeignKey(PropertyStatus, on_delete=models.PROTECT)
    listing_type = models.CharField(max_length=15, choices=LISTING_TYPES)

    # Location
    area = models.ForeignKey('locations.Area', on_delete=models.PROTECT)
    distance_from_main_road = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(50000)],
        help_text="Distance in meters (max 50km)"
    )
    road_is_tarred = models.BooleanField(default=False)
    vehicle_access = models.CharField(
        max_length=20,
        choices=VEHICLE_ACCESS,
        blank=True,
        help_text="Best vehicle access type"
    )

    # Property Details
    no_of_bedrooms = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(50)]
    )
    no_of_living_rooms = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(20)],
        help_text="Number of parlours/living rooms"
    )
    no_of_bathrooms = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    no_of_kitchens = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    kitchen_type = models.CharField(max_length=15, choices=KITCHEN_TYPES, blank=True)
    no_of_balconies = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(20)]
    )
    no_of_floors = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    floor_number = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Which floor is the apartment on (for apartments)"
    )

    # Room specifications
    room_size = models.CharField(max_length=50, blank=True, help_text="e.g., '3m x 4m'")
    has_dressing_cupboard = models.BooleanField(default=False)

    # Utilities
    electricity_type = models.CharField(max_length=15, choices=ELECTRICITY_TYPES, blank=True)
    electricity_payment = models.CharField(max_length=10, choices=ELECTRICITY_PAYMENT, blank=True)
    water_type = models.CharField(max_length=15, choices=WATER_TYPES, blank=True)
    has_ac_preinstalled = models.BooleanField(default=False)
    has_hot_water = models.BooleanField(default=False)
    has_generator = models.BooleanField(default=False)

    # Amenities
    has_parking = models.BooleanField(default=False, help_text="In-fence parking")
    has_security = models.BooleanField(default=False)
    has_pool = models.BooleanField(default=False)
    has_gym = models.BooleanField(default=False)
    has_elevator = models.BooleanField(default=False)

    # Pricing
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='XAF')

    # For Rent specific
    initial_months_payable = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        help_text="Number of months payable at entry (1-24)"
    )
    caution_months = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(12)],
        help_text="Number of months as caution/deposit (0-12)"
    )
    visit_fee = models.DecimalField(
        max_digits=8, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0)],
        help_text="Fee for property viewing"
    )
    requires_contract_registration = models.BooleanField(default=False)

    # For Sale specific
    land_size_sqm = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0)],
        help_text="Land size in square meters"
    )
    has_land_title = models.BooleanField(default=False)
    land_title_type = models.CharField(
        max_length=20,
        choices=[
            ('global', 'Global Land Title'),
            ('extract', 'Personal/Extract Land Title'),
        ],
        blank=True
    )
    cadastral_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Official cadastral registry ID"
    )
    other_documentation = models.TextField(blank=True)

    # Verification Status
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_properties'
    )

    # For Land specific
    land_type = models.CharField(max_length=20, choices=LAND_TYPES, blank=True)
    area_characteristics = models.CharField(max_length=15, choices=AREA_CHARACTERISTICS, blank=True)

    # For Warehouse specific
    warehouse_height = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Height in meters"
    )
    has_forklift = models.BooleanField(default=False)
    allows_truck_entry = models.BooleanField(default=False)
    has_inventory_manager = models.BooleanField(default=False)
    requires_goods_documentation = models.BooleanField(default=False)

    # For Guest House specific
    price_per_day = models.DecimalField(
        max_digits=8, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    price_negotiable = models.BooleanField(default=False)
    has_refundable_caution = models.BooleanField(default=False)

    # Agent Information
    agent = models.ForeignKey(
        'agents.AgentProfile',
        on_delete=models.CASCADE,
        related_name='properties'
    )
    agent_commission_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Agent commission as percentage (0-100%)"
    )
    agent_commission_months = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(12)],
        help_text="Agent commission in months of rent (0-12)"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    # Registry Status (Cameroon-specific)
    registry_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Verification'),
            ('verified', 'Registry Verified'),
            ('disputed', 'Disputed'),
            ('invalid', 'Invalid/Not Found'),
        ],
        blank=True
    )
    title_document = models.FileField(
        upload_to='property_titles/',
        blank=True,
        null=True,
        help_text="Upload land title certificate"
    )

    # SEO and Marketing
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing_type', 'status']),
            models.Index(fields=['area', 'listing_type']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
            models.Index(fields=['featured']),
        ]

    def __str__(self):
        return f"{self.title} - {self.get_listing_type_display()}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.area.name if self.area else 'unknown'}")
            slug = base_slug
            counter = 1
            max_attempts = 100  # Prevent infinite loop

            # Ensure unique slug with safety limit
            while Property.objects.filter(slug=slug).exists() and counter < max_attempts:
                slug = f"{base_slug}-{counter}"
                counter += 1

            # If we hit max attempts, use a timestamp suffix
            if counter >= max_attempts:
                from datetime import datetime
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                slug = f"{base_slug}-{timestamp}"

            self.slug = slug

        super().save(*args, **kwargs)

    def clean(self):
        """
        Custom validation logic
        """
        from django.core.exceptions import ValidationError
        errors = {}

        # Validate floor_number for apartments
        if self.floor_number and self.floor_number > self.no_of_floors:
            errors['floor_number'] = "Floor number cannot exceed total number of floors"

        # Validate listing type specific fields
        if self.listing_type == 'rent':
            if self.initial_months_payable and self.initial_months_payable < 1:
                errors['initial_months_payable'] = "Must specify at least 1 month payable for rent"

        elif self.listing_type == 'sale':
            if not self.land_size_sqm:
                errors['land_size_sqm'] = "Land size is required for sale properties"

        elif self.listing_type == 'guest_house':
            if not self.price_per_day:
                errors['price_per_day'] = "Daily price is required for guest houses"

        # Validate commission fields
        if self.agent_commission_percentage and self.agent_commission_months:
            errors['agent_commission_percentage'] = "Specify either percentage or months commission, not both"

        if errors:
            raise ValidationError(errors)


class PropertyFeature(models.Model):
    """
    Additional property features and amenities
    """
    property_listing = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='additional_features')
    feature_name = models.CharField(max_length=100)
    feature_value = models.CharField(max_length=200, blank=True)
    is_highlighted = models.BooleanField(default=False)

    class Meta:
        unique_together = ['property_listing', 'feature_name']

    def __str__(self):
        return f"{self.property_listing.title} - {self.feature_name}"


class PropertyViewing(models.Model):
    """
    Property viewing appointments
    """
    VIEWING_STATUS = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )

    property_listing = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='viewings')
    viewer = models.ForeignKey(User, on_delete=models.CASCADE)
    scheduled_date = models.DateTimeField()
    status = models.CharField(max_length=15, choices=VIEWING_STATUS, default='scheduled')
    notes = models.TextField(blank=True)
    visit_fee_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_date']
        unique_together = ['property_listing', 'viewer', 'scheduled_date']

    def __str__(self):
        return f"{self.property_listing.title} - {self.viewer.username} - {self.scheduled_date}"

    def clean(self):
        """
        Validate viewing appointment
        """
        from django.core.exceptions import ValidationError
        from django.utils import timezone

        if self.scheduled_date and self.scheduled_date <= timezone.now():
            raise ValidationError({'scheduled_date': 'Viewing date must be in the future'})


class PropertyVerification(models.Model):
    """
    Property verification and document management
    """
    DOCUMENT_TYPES = (
        ('land_title', 'Land Title Certificate'),
        ('survey_plan', 'Survey Plan'),
        ('building_permit', 'Building Permit'),
        ('occupancy_certificate', 'Certificate of Occupancy'),
        ('tax_receipt', 'Property Tax Receipt'),
        ('ownership_proof', 'Proof of Ownership'),
    )

    VERIFICATION_STATUS = (
        ('pending', 'Pending Review'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('expired', 'Document Expired'),
    )

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='verifications')
    document_type = models.CharField(max_length=25, choices=DOCUMENT_TYPES)
    document_file = models.FileField(upload_to='property_documents/')
    document_number = models.CharField(max_length=100, blank=True)

    verification_status = models.CharField(max_length=10, choices=VERIFICATION_STATUS, default='pending')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='property_document_verifications'
    )
    rejection_reason = models.TextField(blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['property', 'document_type']

    def __str__(self):
        return f"{self.property.title} - {self.get_document_type_display()}"


class Parcel(models.Model):
    """
    Cadastral parcels for geospatial queries (PostGIS)
    """
    cadastral_id = models.CharField(max_length=50, unique=True)
    # geometry = models.PolygonField(srid=4326)  # PostGIS field - uncomment when PostGIS is installed
    area_sqm = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Ownership tracking
    current_owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_parcels'
    )
    ownership_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Parcel {self.cadastral_id}"


class PropertyFavorite(models.Model):
    """
    User favorite properties for quick access
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_properties')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'property']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.property.title}"