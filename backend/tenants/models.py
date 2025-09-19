from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils import timezone

User = get_user_model()


class TenantProfile(models.Model):
    """
    Extended profile for tenants with Cameroon-specific features
    """
    EMPLOYMENT_STATUS_CHOICES = (
        ('employed', 'Employed'),
        ('self_employed', 'Self-Employed'),
        ('unemployed', 'Unemployed'),
        ('student', 'Student'),
        ('retired', 'Retired'),
        ('business_owner', 'Business Owner'),
    )

    INCOME_RANGE_CHOICES = (
        ('0-100k', '0 - 100,000 XAF'),
        ('100k-250k', '100,000 - 250,000 XAF'),
        ('250k-500k', '250,000 - 500,000 XAF'),
        ('500k-1m', '500,000 - 1,000,000 XAF'),
        ('1m-2m', '1,000,000 - 2,000,000 XAF'),
        ('2m+', '2,000,000+ XAF'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tenant_profile',
        limit_choices_to={'user_type': 'tenant'}
    )

    # Property Preferences (from frontend wizard)
    preferred_location = models.CharField(max_length=200, blank=True)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    property_category = models.CharField(max_length=50, blank=True)
    property_type = models.CharField(max_length=50, blank=True)
    land_type = models.CharField(max_length=50, blank=True)
    preferred_amenities = models.TextField(blank=True, help_text="Comma-separated list of preferred amenities")

    # Agreement and Verification (from frontend wizard)
    lease_agreement_acceptance = models.BooleanField(default=False)
    government_id_upload = models.FileField(upload_to='tenant_documents/government_id/', blank=True, null=True)
    verification_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('verified', 'Verified'),
            ('rejected', 'Rejected'),
        ],
        default='pending'
    )

    # Personal Information
    date_of_birth = models.DateField(null=True, blank=True)
    national_id_number = models.CharField(max_length=50, blank=True)
    passport_number = models.CharField(max_length=50, blank=True)
    marital_status = models.CharField(
        max_length=20,
        choices=[
            ('single', 'Single'),
            ('married', 'Married'),
            ('divorced', 'Divorced'),
            ('widowed', 'Widowed'),
        ],
        blank=True
    )
    number_of_dependents = models.PositiveIntegerField(default=0)

    # Employment Information
    employment_status = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_STATUS_CHOICES,
        blank=True
    )
    employer_name = models.CharField(max_length=200, blank=True)
    employer_address = models.TextField(blank=True)
    employer_phone = models.CharField(max_length=17, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    monthly_income_range = models.CharField(
        max_length=20,
        choices=INCOME_RANGE_CHOICES,
        blank=True
    )
    employment_duration = models.CharField(max_length=50, blank=True)

    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    emergency_contact_phone = models.CharField(max_length=17, blank=True)
    emergency_contact_address = models.TextField(blank=True)

    # Guarantor Information
    guarantor_name = models.CharField(max_length=100, blank=True)
    guarantor_phone = models.CharField(max_length=17, blank=True)
    guarantor_email = models.EmailField(blank=True)
    guarantor_address = models.TextField(blank=True)
    guarantor_id_document = models.FileField(upload_to='tenant_documents/guarantor/', blank=True, null=True)

    # Document Uploads
    id_document_front = models.FileField(upload_to='tenant_documents/id/', blank=True, null=True)
    id_document_back = models.FileField(upload_to='tenant_documents/id/', blank=True, null=True)
    employment_certificate = models.FileField(upload_to='tenant_documents/employment/', blank=True, null=True)
    income_statement = models.FileField(upload_to='tenant_documents/income/', blank=True, null=True)
    bank_statement = models.FileField(upload_to='tenant_documents/bank/', blank=True, null=True)
    taxpayer_card = models.FileField(upload_to='tenant_documents/taxpayer/', blank=True, null=True)

    # Rental Preferences
    preferred_property_type = models.CharField(max_length=50, blank=True)
    max_rent_budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    preferred_areas = models.ManyToManyField('locations.Area', blank=True)
    min_bedrooms = models.PositiveIntegerField(default=1)
    requires_furnished = models.BooleanField(default=False)
    has_pets = models.BooleanField(default=False)
    pet_description = models.TextField(blank=True)

    # Rental History
    current_address = models.TextField(blank=True)
    previous_landlord_name = models.CharField(max_length=100, blank=True)
    previous_landlord_phone = models.CharField(max_length=17, blank=True)
    reason_for_moving = models.TextField(blank=True)
    rental_history_verified = models.BooleanField(default=False)

    # Verification Status
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    credit_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(850)]
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Tenant: {self.user.full_name}"

    @property
    def age(self):
        if self.date_of_birth:
            today = timezone.now().date()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None

    @property
    def is_profile_complete(self):
        """Check if tenant profile has minimum required information"""
        required_fields = [
            self.employment_status,
            self.monthly_income_range,
            self.emergency_contact_name,
            self.emergency_contact_phone,
        ]
        return all(field for field in required_fields)


class TenantReference(models.Model):
    """
    Professional and personal references for tenants
    """
    REFERENCE_TYPES = (
        ('employer', 'Employer'),
        ('previous_landlord', 'Previous Landlord'),
        ('personal', 'Personal Reference'),
        ('professional', 'Professional Reference'),
    )

    tenant = models.ForeignKey(TenantProfile, on_delete=models.CASCADE, related_name='references')
    reference_type = models.CharField(max_length=20, choices=REFERENCE_TYPES)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True)
    relationship_duration = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    # Verification
    is_contacted = models.BooleanField(default=False)
    contact_date = models.DateTimeField(null=True, blank=True)
    reference_feedback = models.TextField(blank=True)
    recommendation_level = models.CharField(
        max_length=20,
        choices=[
            ('excellent', 'Excellent'),
            ('good', 'Good'),
            ('average', 'Average'),
            ('poor', 'Poor'),
        ],
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.tenant.user.full_name} - {self.name} ({self.reference_type})"


class TenantApplication(models.Model):
    """
    Rental applications submitted by tenants
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )

    tenant = models.ForeignKey(TenantProfile, on_delete=models.CASCADE, related_name='applications')
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='tenant_applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # Application Details
    desired_move_in_date = models.DateField()
    lease_duration_months = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(60)]
    )
    offered_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    # Additional Information
    additional_occupants = models.TextField(blank=True, help_text="List additional people who will live in the property")
    special_requests = models.TextField(blank=True)
    cover_letter = models.TextField(blank=True, help_text="Why you're interested in this property")

    # Review Process
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_applications'
    )
    review_notes = models.TextField(blank=True)
    review_date = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['tenant', 'property']

    def __str__(self):
        return f"{self.tenant.user.full_name} - {self.property.title}"

    def save(self, *args, **kwargs):
        if self.status == 'submitted' and not self.submitted_at:
            self.submitted_at = timezone.now()
        super().save(*args, **kwargs)


# Legacy model for backward compatibility
class Tenant(TenantProfile):
    """
    Legacy Tenant model - points to TenantProfile for backward compatibility
    """
    class Meta:
        proxy = True


class TenantDocument(models.Model):
    tenant = models.ForeignKey(TenantProfile, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='tenant_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tenant.user.full_name})"
