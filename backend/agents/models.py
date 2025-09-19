from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils import timezone

User = get_user_model()


class AgentProfile(models.Model):
    """
    Extended profile for real estate agents
    """
    EXPERIENCE_CHOICES = (
        ('0-1', '0-1 years'),
        ('1-3', '1-3 years'),
        ('3-5', '3-5 years'),
        ('5-10', '5-10 years'),
        ('10+', '10+ years'),
    )

    SPECIALIZATION_CHOICES = (
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('luxury', 'Luxury Properties'),
        ('rental', 'Rental Properties'),
        ('investment', 'Investment Properties'),
        ('land', 'Land & Development'),
    )

    ID_TYPE_CHOICES = (
        ('passport', 'Passport'),
        ('drivers_license', 'Driver\'s License'),
        ('national_id', 'National ID'),
    )

    MOBILE_MONEY_PROVIDER_CHOICES = (
        ('mtn', 'MTN Mobile Money'),
        ('orange', 'Orange Money'),
        ('other', 'Other'),
    )

    NAME_MATCH_STATUS_CHOICES = (
        ('match', 'Match'),
        ('close', 'Close Match'),
        ('mismatch', 'Mismatch'),
        ('pending', 'Pending Verification'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='agents_profile',  # Changed to avoid conflict
        limit_choices_to={'user_type': 'agent'}
    )

    # Address Information (from frontend wizard)
    street = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=2, default='CM')
    residence_proof = models.FileField(upload_to='agent_documents/residence/', blank=True, null=True)

    # KYC Information (from frontend wizard)
    id_type = models.CharField(max_length=20, choices=ID_TYPE_CHOICES, default='national_id')
    id_number = models.CharField(max_length=100, blank=True)
    id_document = models.FileField(upload_to='agent_documents/id/', blank=True, null=True)
    address_verification = models.FileField(upload_to='agent_documents/address/', blank=True, null=True)
    taxpayer_card = models.FileField(upload_to='agent_documents/taxpayer/', blank=True, null=True)
    selfie_document = models.FileField(upload_to='agent_documents/selfie/', blank=True, null=True)

    # Mobile Money Information (from frontend wizard)
    mobile_money_provider = models.CharField(max_length=10, choices=MOBILE_MONEY_PROVIDER_CHOICES, default='mtn')
    mobile_money_phone = models.CharField(max_length=20, blank=True)
    mobile_money_account_name = models.CharField(max_length=100, blank=True)
    name_match_status = models.CharField(max_length=10, choices=NAME_MATCH_STATUS_CHOICES, default='pending')
    is_mobile_money_verified = models.BooleanField(default=False)

    # Consent and Agreement (from frontend wizard)
    terms_accepted = models.BooleanField(default=False)
    data_consent_accepted = models.BooleanField(default=False)
    marketing_consent = models.BooleanField(default=False)

    # Professional Information (Made optional for agents without license)
    license_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    agency_name = models.CharField(max_length=100, blank=True)
    agency_address = models.TextField(blank=True)
    years_experience = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES, blank=True)
    specialization = models.CharField(max_length=20, choices=SPECIALIZATION_CHOICES, blank=True)

    # Contact & Social
    office_phone = models.CharField(max_length=17, blank=True)
    website = models.URLField(blank=True)
    linkedin_profile = models.URLField(blank=True)
    facebook_profile = models.URLField(blank=True)
    instagram_profile = models.URLField(blank=True)

    # Professional Description
    bio = models.TextField(help_text="Professional biography and experience")
    languages_spoken = models.CharField(max_length=200, blank=True, help_text="Comma-separated languages")

    # Service Areas
    service_areas = models.ManyToManyField('locations.Area', related_name='agents_list', blank=True)

    # Professional Status
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Performance Metrics
    total_sales = models.PositiveIntegerField(default=0)
    total_rentals = models.PositiveIntegerField(default=0)
    client_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_reviews = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.agency_name}"

    class Meta:
        app_label = 'agents'
        ordering = ['-is_featured', '-client_rating']


class AgentCertification(models.Model):
    """
    Professional certifications for agents
    """
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=100)
    issuing_organization = models.CharField(max_length=100)
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    certificate_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'agents'
        ordering = ['-issue_date']

    def __str__(self):
        return f"{self.agent.user.full_name} - {self.name}"


class AgentReview(models.Model):
    """
    Client reviews for agents
    """
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agents_reviews')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=100)
    comment = models.TextField()
    is_verified = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'agents'
        ordering = ['-created_at']
        unique_together = ['agent', 'reviewer']

    def __str__(self):
        return f"{self.agent.user.full_name} - {self.rating}/5 by {self.reviewer.full_name}"


class AgentAchievement(models.Model):
    """
    Awards and achievements for agents
    """
    ACHIEVEMENT_TYPES = (
        ('award', 'Award'),
        ('recognition', 'Recognition'),
        ('milestone', 'Milestone'),
        ('certification', 'Certification'),
    )

    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    achievement_type = models.CharField(max_length=15, choices=ACHIEVEMENT_TYPES)
    date_achieved = models.DateField()
    issuing_organization = models.CharField(max_length=100, blank=True)
    certificate_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'agents'
        ordering = ['-date_achieved']

    def __str__(self):
        return f"{self.agent.user.full_name} - {self.title}"


class AgentSchedule(models.Model):
    """
    Agent availability schedule
    """
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='schedule')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'agents'
        unique_together = ['agent', 'day_of_week']
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.agent.user.full_name} - {self.get_day_of_week_display()}"


class AgentContact(models.Model):
    """
    Contact inquiries sent to agents
    """
    STATUS_CHOICES = (
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    )

    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='inquiries')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agents_contacts')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    phone_number = models.CharField(max_length=17, blank=True)
    preferred_contact_method = models.CharField(
        max_length=10,
        choices=[('email', 'Email'), ('phone', 'Phone'), ('whatsapp', 'WhatsApp')],
        default='email'
    )
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='new')
    agent_response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        app_label = 'agents'
        ordering = ['-created_at']

    def __str__(self):
        return f"Contact for {self.agent.user.full_name} from {self.client.full_name}"


class AgentDocument(models.Model):
    """
    Document storage for agent verification
    Only supports essential identity, address and tax verification documents
    """
    DOCUMENT_TYPES = (
        ('id_document', 'ID Document (Passport/Driver\'s License/National ID)'),
        ('address_verification', 'Address Verification (Utility Bill/Bank Statement)'),
        ('taxpayer_card', 'Taxpayer Card'),
        ('selfie', 'Selfie Verification'),
    )

    agent = models.ForeignKey(
        'AgentProfile',
        on_delete=models.CASCADE,
        related_name='documents'
    )

    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='agent_documents/%Y/%m/')
    original_filename = models.CharField(max_length=200)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    mime_type = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True, help_text="Additional notes about the document")

    # Verification status
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='agents_verified_documents'
    )
    verification_notes = models.TextField(blank=True)

    # Metadata
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'agents'
        ordering = ['-uploaded_at']
        unique_together = ['agent', 'document_type']  # Only one document per type

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.agent.user.full_name}"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.original_filename = self.file.name
        super().save(*args, **kwargs)


class AgentMobileMoney(models.Model):
    """
    Mobile money verification for agents
    """
    PROVIDERS = (
        ('mtn', 'MTN Mobile Money'),
        ('orange', 'Orange Money'),
        ('other', 'Other'),
    )

    NAME_MATCH_STATUS = (
        ('pending', 'Pending'),
        ('match', 'Match'),
        ('close', 'Close Match'),
        ('mismatch', 'Mismatch'),
    )

    agent = models.OneToOneField(
        'AgentProfile',
        on_delete=models.CASCADE,
        related_name='mobile_money'
    )

    provider = models.CharField(max_length=10, choices=PROVIDERS)
    phone_number = models.CharField(
        max_length=13,
        validators=[RegexValidator(
            regex=r'^\+237[67]\d{8}$',
            message="Enter a valid Cameroon phone number: +237XXXXXXXXX"
        )]
    )
    account_name = models.CharField(max_length=100, help_text="Name on mobile money account")
    name_match_status = models.CharField(max_length=10, choices=NAME_MATCH_STATUS, default='pending')

    # Verification
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=10, blank=True)
    verified_at = models.DateTimeField(blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'agents'
        verbose_name = "Agent Mobile Money"
        verbose_name_plural = "Agent Mobile Money Accounts"

    def __str__(self):
        return f"{self.get_provider_display()} - {self.agent.user.full_name}"

    def verify_account(self):
        """Mark mobile money account as verified"""
        self.is_verified = True
        self.verified_at = timezone.now()
        self.save()


class AgentAddress(models.Model):
    """
    Enhanced address information for agents
    Supports both personal and business addresses
    """
    agent = models.OneToOneField(
        'AgentProfile',
        on_delete=models.CASCADE,
        related_name='address'
    )

    # Personal Address
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100, help_text="Region/State")
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=2, default='CM', help_text="Country (ISO code)")

    # Business Address (if different from personal)
    is_business_address_same = models.BooleanField(
        default=False,
        help_text="Is business address same as personal address?"
    )
    business_street = models.CharField(max_length=200, blank=True)
    business_city = models.CharField(max_length=100, blank=True)
    business_region = models.CharField(max_length=100, blank=True)
    business_postal_code = models.CharField(max_length=20, blank=True)
    business_country = models.CharField(max_length=2, default='CM', blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'agents'
        verbose_name = "Agent Address"
        verbose_name_plural = "Agent Addresses"

    def __str__(self):
        return f"Address for {self.agent.user.full_name}"
