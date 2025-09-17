from django.db import models
from django.conf import settings


class MaintenanceCategory(models.Model):
	name = models.CharField(max_length=100, unique=True)
	description = models.TextField(blank=True)

	def __str__(self):
		return self.name


class ServiceProvider(models.Model):
	name = models.CharField(max_length=255)
	contact_email = models.EmailField(blank=True)
	contact_phone = models.CharField(max_length=50, blank=True)

	def __str__(self):
		return self.name


class MaintenanceRequest(models.Model):
	PRIORITY = (
		('low', 'Low'),
		('medium', 'Medium'),
		('high', 'High'),
		('urgent', 'Urgent'),
	)
	STATUS = (
		('submitted', 'Submitted'),
		('acknowledged', 'Acknowledged'),
		('in_progress', 'In Progress'),
		('completed', 'Completed'),
		('closed', 'Closed'),
	)
	related_property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='maintenance_requests')
	tenant = models.ForeignKey('tenants.Tenant', on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
	category = models.ForeignKey(MaintenanceCategory, on_delete=models.SET_NULL, null=True, blank=True)
	title = models.CharField(max_length=255)
	description = models.TextField()
	priority = models.CharField(max_length=20, choices=PRIORITY, default='medium')
	status = models.CharField(max_length=20, choices=STATUS, default='submitted')
	requested_date = models.DateField(auto_now_add=True)
	completed_date = models.DateField(null=True, blank=True)
	estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
	actual_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
	assigned_to = models.ForeignKey(ServiceProvider, on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return f"{self.title} ({self.get_status_display()})"


from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()


class MaintenanceCategory(models.Model):
    """
    Categories for maintenance requests
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="CSS icon class")
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")
    is_emergency = models.BooleanField(default=False)
    estimated_completion_hours = models.PositiveIntegerField(
        default=24,
        help_text="Estimated hours to complete"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Maintenance Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class ServiceProvider(models.Model):
    """
    External service providers for maintenance work
    """
    PROVIDER_TYPES = (
        ('plumber', 'Plumber'),
        ('electrician', 'Electrician'),
        ('carpenter', 'Carpenter'),
        ('painter', 'Painter'),
        ('cleaner', 'Cleaner'),
        ('security', 'Security'),
        ('gardener', 'Gardener'),
        ('hvac', 'HVAC Technician'),
        ('general', 'General Maintenance'),
        ('contractor', 'Contractor'),
    )

    name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100, blank=True)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)

    # Service Areas
    service_areas = models.ManyToManyField('locations.Area', blank=True)

    # Ratings and Performance
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_jobs = models.PositiveIntegerField(default=0)
    completed_jobs = models.PositiveIntegerField(default=0)

    # Pricing
    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    call_out_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    # Status
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_emergency_available = models.BooleanField(default=False)

    # Documents
    insurance_certificate = models.FileField(upload_to='service_providers/insurance/', blank=True, null=True)
    license_document = models.FileField(upload_to='service_providers/licenses/', blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} - {self.get_provider_type_display()}"

    @property
    def completion_rate(self):
        """Calculate job completion rate as percentage"""
        if self.total_jobs > 0:
            return (self.completed_jobs / self.total_jobs) * 100
        return 0


class MaintenanceRequest(models.Model):
    """
    Maintenance requests with Cameroon-specific features
    """
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('emergency', 'Emergency'),
    )

    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('acknowledged', 'Acknowledged'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    )

    # Basic Information
    request_number = models.CharField(max_length=50, unique=True, blank=True)
    related_property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='maintenance_requests')
    tenant = models.ForeignKey('tenants.TenantProfile', on_delete=models.CASCADE, related_name='maintenance_requests', null=True, blank=True)
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maintenance_requests')
    category = models.ForeignKey(MaintenanceCategory, on_delete=models.CASCADE)

    # Request Details
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='submitted')

    # Location within property
    location_details = models.CharField(
        max_length=200,
        blank=True,
        help_text="Specific location within property (e.g., 'Kitchen sink', 'Bedroom 1 window')"
    )

    # Scheduling
    requested_date = models.DateTimeField(default=timezone.now)
    preferred_time = models.CharField(
        max_length=20,
        choices=[
            ('morning', 'Morning (8AM-12PM)'),
            ('afternoon', 'Afternoon (12PM-5PM)'),
            ('evening', 'Evening (5PM-8PM)'),
            ('anytime', 'Anytime'),
        ],
        default='anytime'
    )
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)

    # Assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_maintenance',
        help_text="Internal staff member assigned"
    )
    service_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='maintenance_requests'
    )

    # Cost Management
    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    actual_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='XAF')

    # Approval (for expensive repairs)
    requires_approval = models.BooleanField(default=False)
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_maintenance'
    )
    approval_date = models.DateTimeField(null=True, blank=True)
    approval_notes = models.TextField(blank=True)

    # Communication
    tenant_notes = models.TextField(blank=True, help_text="Additional notes from tenant")
    admin_notes = models.TextField(blank=True, help_text="Internal notes")
    completion_notes = models.TextField(blank=True, help_text="Work completion summary")

    # Tenant Satisfaction
    tenant_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Tenant satisfaction rating (1-5)"
    )
    tenant_feedback = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-priority', '-created_at']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['related_property', 'status']),
            models.Index(fields=['tenant', 'status']),
        ]

    def __str__(self):
        return f"{self.request_number or self.id} - {self.title}"

    def save(self, *args, **kwargs):
        # Generate request number if not provided
        if not self.request_number:
            import uuid
            self.request_number = f"MR-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"

        # Set acknowledged timestamp
        if self.status == 'acknowledged' and not self.acknowledged_at:
            self.acknowledged_at = timezone.now()

        # Set completion timestamp
        if self.status == 'completed' and not self.completed_date:
            self.completed_date = timezone.now()

        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        """Check if request is overdue based on category estimated completion time"""
        if self.status in ['completed', 'closed', 'cancelled']:
            return False

        if self.acknowledged_at:
            target_completion = self.acknowledged_at + timezone.timedelta(
                hours=self.category.estimated_completion_hours
            )
            return timezone.now() > target_completion
        return False

    @property
    def days_open(self):
        """Number of days the request has been open"""
        if self.status in ['completed', 'closed']:
            end_date = self.completed_date or self.updated_at
        else:
            end_date = timezone.now()

        return (end_date.date() - self.created_at.date()).days


class MaintenanceImage(models.Model):
    """
    Images for maintenance requests (before/after photos)
    """
    IMAGE_TYPES = (
        ('before', 'Before'),
        ('during', 'During Work'),
        ('after', 'After'),
        ('damage', 'Damage Documentation'),
    )

    maintenance_request = models.ForeignKey(
        MaintenanceRequest,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='maintenance/images/')
    image_type = models.CharField(max_length=10, choices=IMAGE_TYPES, default='before')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['image_type', 'uploaded_at']

    def __str__(self):
        return f"{self.maintenance_request.request_number} - {self.get_image_type_display()}"


class MaintenanceSchedule(models.Model):
    """
    Preventive maintenance scheduling
    """
    FREQUENCY_CHOICES = (
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('semi_annual', 'Semi-Annual'),
        ('annual', 'Annual'),
    )

    related_property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='maintenance_schedules')
    category = models.ForeignKey(MaintenanceCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    frequency = models.CharField(max_length=15, choices=FREQUENCY_CHOICES)

    # Scheduling
    next_due_date = models.DateField()
    last_completed = models.DateField(null=True, blank=True)

    # Assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='scheduled_maintenance'
    )
    service_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Cost
    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )

    # Status
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['next_due_date']

    def __str__(self):
        return f"{self.related_property.title} - {self.title}"

    @property
    def is_overdue(self):
        """Check if preventive maintenance is overdue"""
        return timezone.now().date() > self.next_due_date

    def calculate_next_due_date(self):
        """Calculate the next due date based on frequency"""
        from dateutil.relativedelta import relativedelta

        base_date = self.last_completed or timezone.now().date()

        if self.frequency == 'weekly':
            return base_date + timezone.timedelta(weeks=1)
        elif self.frequency == 'monthly':
            return base_date + relativedelta(months=1)
        elif self.frequency == 'quarterly':
            return base_date + relativedelta(months=3)
        elif self.frequency == 'semi_annual':
            return base_date + relativedelta(months=6)
        elif self.frequency == 'annual':
            return base_date + relativedelta(years=1)

        return base_date
