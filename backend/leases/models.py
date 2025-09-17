from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal

User = get_user_model()


class LeaseTemplate(models.Model):
    """
    Reusable lease agreement templates
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    template_content = models.TextField(help_text="Lease template with placeholders")
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class LeaseAgreement(models.Model):
    """
    Enhanced lease agreement model with Cameroon-specific features
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending_signature', 'Pending Signature'),
        ('active', 'Active'),
        ('terminated', 'Terminated'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )

    TERMINATION_REASONS = (
        ('expired', 'Natural Expiration'),
        ('tenant_request', 'Tenant Request'),
        ('landlord_request', 'Landlord Request'),
        ('breach', 'Contract Breach'),
        ('non_payment', 'Non-Payment'),
        ('property_sale', 'Property Sale'),
        ('renovation', 'Property Renovation'),
    )

    # Basic Information
    lease_number = models.CharField(max_length=50, unique=True, blank=True)
    rental_property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='lease_agreements')
    tenant = models.ForeignKey('tenants.TenantProfile', on_delete=models.CASCADE, related_name='leases')
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='landlord_leases')
    agent = models.ForeignKey('agentprofile.AgentProfile', on_delete=models.SET_NULL, null=True, blank=True)

    # Lease Terms
    start_date = models.DateField()
    end_date = models.DateField()
    rent_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='XAF')

    # Cameroon-specific payment terms
    initial_months_payable = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        help_text="Number of months rent paid upfront"
    )
    security_deposit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Security deposit (caution)"
    )
    caution_months = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(12)],
        help_text="Caution expressed in months of rent"
    )

    # Additional Fees
    agency_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    contract_registration_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    # Contract Details
    template = models.ForeignKey(LeaseTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    terms = models.TextField(blank=True, help_text="Lease terms and conditions")
    lease_document = models.FileField(upload_to='leases/documents/', blank=True, null=True)

    # Status and Signatures
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # Digital Signatures
    tenant_signed = models.BooleanField(default=False)
    tenant_signature_date = models.DateTimeField(null=True, blank=True)
    landlord_signed = models.BooleanField(default=False)
    landlord_signature_date = models.DateTimeField(null=True, blank=True)
    agent_signed = models.BooleanField(default=False)
    agent_signature_date = models.DateTimeField(null=True, blank=True)
    signed_date = models.DateField(null=True, blank=True)

    # Termination
    termination_notice_date = models.DateField(null=True, blank=True)
    termination_reason = models.CharField(
        max_length=20,
        choices=TERMINATION_REASONS,
        blank=True
    )
    termination_details = models.TextField(blank=True)

    # Auto-renewal
    auto_renewal = models.BooleanField(default=False)
    renewal_notice_days = models.PositiveIntegerField(
        default=30,
        help_text="Days notice required before renewal"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    activated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['tenant', 'status']),
            models.Index(fields=['rental_property', 'status']),
        ]

    def __str__(self):
        if self.lease_number:
            return f"Lease {self.lease_number} - {self.rental_property}"
        return f"Lease for {self.rental_property} - {self.tenant} ({self.status})"

    def save(self, *args, **kwargs):
        # Generate lease number if not provided
        if not self.lease_number:
            import uuid
            self.lease_number = f"LS-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"

        # Calculate security deposit from months if specified
        if self.caution_months and not self.security_deposit:
            self.security_deposit = self.rent_amount * self.caution_months

        # Set activated_at when status changes to active
        if self.status == 'active' and not self.activated_at:
            self.activated_at = timezone.now()

        super().save(*args, **kwargs)

    @property
    def is_fully_signed(self):
        """Check if all required parties have signed"""
        required_signatures = [self.tenant_signed, self.landlord_signed]
        if self.agent:
            required_signatures.append(self.agent_signed)
        return all(required_signatures)

    @property
    def total_upfront_cost(self):
        """Calculate total upfront payment required"""
        upfront_rent = self.rent_amount * self.initial_months_payable
        return upfront_rent + self.security_deposit + self.agency_fee + self.contract_registration_fee

    @property
    def remaining_days(self):
        """Days remaining in lease"""
        if self.end_date:
            today = timezone.now().date()
            if self.end_date > today:
                return (self.end_date - today).days
        return 0

    @property
    def is_expired(self):
        """Check if lease has expired"""
        return timezone.now().date() > self.end_date if self.end_date else False


class RentSchedule(models.Model):
    """
    Enhanced monthly rent payment schedule for a lease
    """
    lease = models.ForeignKey(LeaseAgreement, on_delete=models.CASCADE, related_name='rent_schedule')
    due_date = models.DateField()
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    # Payment Status
    is_paid = models.BooleanField(default=False)
    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)

    # Late Fees
    late_fee_applied = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    late_fee_waived = models.BooleanField(default=False)

    # Notes
    notes = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date']
        unique_together = ['lease', 'due_date']

    def __str__(self):
        lease_id = self.lease.lease_number or self.lease.id
        return f"{lease_id} - {self.due_date} - {self.amount}"

    @property
    def is_overdue(self):
        """Check if payment is overdue"""
        return not self.is_paid and timezone.now().date() > self.due_date

    @property
    def days_overdue(self):
        """Number of days payment is overdue"""
        if self.is_overdue:
            return (timezone.now().date() - self.due_date).days
        return 0

    @property
    def balance_due(self):
        """Remaining balance including late fees"""
        return self.amount + self.late_fee_applied - self.paid_amount
