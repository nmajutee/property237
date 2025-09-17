from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

User = get_user_model()


class PaymentMethod(models.Model):
    """
    Enhanced payment methods with Cameroon mobile money support
    """
    GATEWAY_TYPES = (
        ('mtn_momo', 'MTN Mobile Money'),
        ('orange_money', 'Orange Money'),
        ('stripe', 'Stripe (Cards)'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('flutterwave', 'Flutterwave'),
        ('korapay', 'KoraPay'),
    )

    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=20, unique=True)
    gateway_type = models.CharField(max_length=20, choices=GATEWAY_TYPES, default='cash')
    description = models.TextField(blank=True)

    # Availability
    is_online = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    supports_escrow = models.BooleanField(default=False)

    # Fees
    processing_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )
    fixed_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )

    # Limits
    min_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=100.00,  # 100 XAF minimum
        validators=[MinValueValidator(0)]
    )
    max_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=2000000.00,  # 2M XAF maximum
        validators=[MinValueValidator(0)]
    )

    # Display
    icon = models.ImageField(upload_to='payment_icons/', blank=True, null=True)
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Currency(models.Model):
    """
    Supported currencies with XAF as primary
    """
    code = models.CharField(max_length=3, unique=True)  # XAF, USD, EUR
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        default=1.000000,
        help_text="Exchange rate to XAF"
    )
    is_base_currency = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Currencies"
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Escrow(models.Model):
    """
    Escrow accounts for secure transactions
    """
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('funded', 'Funded'),
        ('disputed', 'Disputed'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('expired', 'Expired'),
    )

    ESCROW_TYPES = (
        ('rental_deposit', 'Rental Deposit'),
        ('property_purchase', 'Property Purchase'),
        ('service_payment', 'Service Payment'),
        ('commission', 'Agent Commission'),
    )

    # Basic Information
    escrow_id = models.CharField(max_length=50, unique=True)
    escrow_type = models.CharField(max_length=20, choices=ESCROW_TYPES)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)  # XAF

    # Parties
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paid_escrows')
    beneficiary = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_escrows')
    agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_escrows'
    )

    # Related Objects
    related_property = models.ForeignKey(
        'properties.Property',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='escrows'
    )
    lease = models.ForeignKey(
        'leases.LeaseAgreement',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='escrows'
    )

    # Release Conditions
    release_conditions = models.TextField(help_text="Conditions that must be met for release")
    auto_release_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Date when funds will be automatically released"
    )

    # Status and Timeline
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    funded_at = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)

    # Notes
    description = models.TextField(blank=True)
    release_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Escrow {self.escrow_id} - {self.amount} {self.currency.code}"

    def save(self, *args, **kwargs):
        if not self.escrow_id:
            import uuid
            self.escrow_id = f"ESC-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)


class Transaction(models.Model):
    """
    Enhanced transactions with mobile money and escrow support
    """
    TRANSACTION_TYPES = (
        ('rent_payment', 'Rent Payment'),
        ('deposit_payment', 'Security Deposit'),
        ('commission_payment', 'Agent Commission'),
        ('maintenance_payment', 'Maintenance Payment'),
        ('escrow_funding', 'Escrow Funding'),
        ('escrow_release', 'Escrow Release'),
        ('ad_payment', 'Advertisement Payment'),
        ('subscription', 'Subscription Payment'),
        ('refund', 'Refund'),
        ('penalty', 'Penalty Fee'),
        ('bonus', 'Bonus Credit'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    )

    # Basic Information
    transaction_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Amount Information
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)  # XAF
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=6, default=1.000000)

    # Fees
    processing_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    platform_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    # Payment Details
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)
    gateway_transaction_id = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(blank=True, null=True)

    # Mobile Money Specific
    phone_number = models.CharField(
        max_length=17,
        blank=True,
        help_text="Phone number for mobile money transactions"
    )
    momo_transaction_id = models.CharField(max_length=100, blank=True)

    # Related Objects
    escrow = models.ForeignKey(
        'payment.Escrow',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    lease = models.ForeignKey(
        'leases.LeaseAgreement',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    related_property = models.ForeignKey(
        'properties.Property',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    maintenance_request = models.ForeignKey(
        'maintenance.MaintenanceRequest',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )

    # Legacy fields for compatibility
    advertisement = models.ForeignKey(
        'ad.Advertisement',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    tariff_plan = models.ForeignKey(
        'tariffplans.TariffPlan',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )

    # Additional Information
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    receipt_url = models.URLField(blank=True)
    invoice_number = models.CharField(max_length=50, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(blank=True, null=True)

    # Refund Information
    refunded_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    refund_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['transaction_type', 'created_at']),
            models.Index(fields=['phone_number']),
        ]

    def __str__(self):
        return f"{self.transaction_id} - {self.user.email} - {self.amount} {self.currency.code}"

    def save(self, *args, **kwargs):
        # Generate transaction ID if not provided
        if not self.transaction_id:
            import uuid
            self.transaction_id = f"TXN-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"

        # Calculate total amount
        self.total_amount = self.amount + self.processing_fee + self.platform_fee
        super().save(*args, **kwargs)


# Keep existing models for backward compatibility
class PaymentAccount(models.Model):
    """
    User payment accounts for receiving money
    """
    ACCOUNT_TYPES = (
        ('bank_account', 'Bank Account'),
        ('momo_account', 'Mobile Money'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('wallet', 'Digital Wallet'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_accounts')
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    account_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100, blank=True)
    bank_code = models.CharField(max_length=20, blank=True)
    phone_number = models.CharField(max_length=17, blank=True, help_text="For mobile money accounts")
    is_verified = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', 'account_name']

    def __str__(self):
        return f"{self.user.email} - {self.account_name}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            PaymentAccount.objects.filter(
                user=self.user,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class Invoice(models.Model):
    """
    Invoices for services
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    )

    invoice_number = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name='invoice',
        blank=True,
        null=True
    )

    # Invoice Details
    subject = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)

    # Dates
    issue_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateTimeField(blank=True, null=True)

    # Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')

    # Files
    pdf_file = models.FileField(upload_to='invoices/', blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.user.email}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import uuid
            self.invoice_number = f"INV-{timezone.now().year}-{str(uuid.uuid4())[:6].upper()}"
        self.total_amount = self.amount + self.tax_amount - self.discount_amount
        super().save(*args, **kwargs)


class Refund(models.Model):
    """
    Refund requests and processing
    """
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )

    REFUND_TYPES = (
        ('full', 'Full Refund'),
        ('partial', 'Partial Refund'),
    )

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='refunds')
    refund_type = models.CharField(max_length=10, choices=REFUND_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='requested')

    # Processing
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_refunds'
    )
    processing_notes = models.TextField(blank=True)
    gateway_refund_id = models.CharField(max_length=100, blank=True)

    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-requested_at']

    def __str__(self):
        return f"Refund {self.transaction.transaction_id} - {self.amount}"


class WalletBalance(models.Model):
    """
    User wallet balances for different currencies
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallet_balances')
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    locked_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'currency']
        ordering = ['currency__code']

    def __str__(self):
        return f"{self.user.email} - {self.balance} {self.currency.code}"

    @property
    def available_balance(self):
        return self.balance - self.locked_balance


class Escrow(models.Model):
    """
    Binance-style escrow for property transactions (Cameroon mobile money focused)
    """
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('awaiting_payment', 'Awaiting Payment'),
        ('paid_pending_confirm', 'Paid - Pending Confirmation'),
        ('held', 'Funds Held'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )

    ESCROW_TYPES = (
        ('deposit', 'Security Deposit'),
        ('sale', 'Property Sale'),
        ('rent_advance', 'Rent Advance Payment'),
        ('commission', 'Agent Commission'),
    )

    escrow_id = models.CharField(max_length=20, unique=True)
    escrow_type = models.CharField(max_length=15, choices=ESCROW_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')

    # Parties
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='buyer_escrows'
    )
    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='seller_escrows'
    )

    # Property & Amount
    related_property = models.ForeignKey(
        'properties.Property',
        on_delete=models.CASCADE,
        related_name='escrows',
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)

    # Terms
    terms = models.TextField(help_text="Escrow terms and conditions")
    release_conditions = models.TextField(help_text="Conditions for fund release")

    # Timers (Binance-style)
    expires_at = models.DateTimeField(help_text="Payment deadline")
    release_deadline = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Auto-release deadline if no action taken"
    )

    # Payment tracking
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)
    transaction_reference = models.CharField(max_length=100, blank=True)
    payment_proof_uploaded = models.BooleanField(default=False)
    payment_confirmed_by_seller = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)

    # Admin override
    admin_notes = models.TextField(blank=True)
    forced_action_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='escrow_actions'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Escrow {self.escrow_id} - {self.amount} {self.currency.code}"

    def save(self, *args, **kwargs):
        if not self.escrow_id:
            from django.utils.crypto import get_random_string
            self.escrow_id = f"ESC{get_random_string(12, '0123456789ABCDEF')}"
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        from django.utils import timezone
        return self.expires_at < timezone.now() if self.expires_at else False

    @property
    def time_to_expiry(self):
        from django.utils import timezone
        if self.expires_at:
            delta = self.expires_at - timezone.now()
            return delta if delta.total_seconds() > 0 else None
        return None


class EscrowEvent(models.Model):
    """
    Audit trail for escrow events
    """
    EVENT_TYPES = (
        ('created', 'Escrow Created'),
        ('payment_initiated', 'Payment Initiated'),
        ('proof_uploaded', 'Payment Proof Uploaded'),
        ('payment_confirmed', 'Payment Confirmed'),
        ('funds_held', 'Funds Held'),
        ('released', 'Funds Released'),
        ('refunded', 'Funds Refunded'),
        ('disputed', 'Dispute Opened'),
        ('expired', 'Escrow Expired'),
        ('admin_action', 'Admin Action'),
    )

    escrow = models.ForeignKey('payment.Escrow', on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.escrow.escrow_id} - {self.get_event_type_display()}"


class EscrowDispute(models.Model):
    """
    Dispute management for escrow transactions
    """
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('resolved_buyer', 'Resolved - Buyer Favor'),
        ('resolved_seller', 'Resolved - Seller Favor'),
        ('resolved_split', 'Resolved - Split'),
        ('closed', 'Closed'),
    )

    escrow = models.OneToOneField('payment.Escrow', on_delete=models.CASCADE, related_name='dispute')
    opened_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    evidence_description = models.TextField()

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    resolution_notes = models.TextField(blank=True)
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_disputes'
    )

    opened_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Dispute {self.escrow.escrow_id} - {self.get_status_display()}"


class PaymentProof(models.Model):
    """
    Payment proofs uploaded by users (receipts, screenshots)
    """
    escrow = models.ForeignKey('payment.Escrow', on_delete=models.CASCADE, related_name='payment_proofs')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    proof_file = models.FileField(upload_to='payment_proofs/')
    description = models.TextField(blank=True)
    transaction_reference = models.CharField(max_length=100, blank=True)

    # Verification
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_proofs'
    )
    verification_notes = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Proof for {self.escrow.escrow_id} by {self.uploaded_by.username}"


class MobileMoneyAccount(models.Model):
    """
    User mobile money account verification for agents/landlords
    """
    PROVIDERS = (
        ('mtn_momo', 'MTN Mobile Money'),
        ('orange_money', 'Orange Money'),
        ('express_union', 'Express Union Mobile'),
    )

    VERIFICATION_STATUS = (
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('name_mismatch', 'Name Mismatch'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mobile_money_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDERS)
    phone_number = models.CharField(max_length=17)
    account_name = models.CharField(max_length=100, help_text="Name on mobile money account")

    verification_status = models.CharField(max_length=15, choices=VERIFICATION_STATUS, default='pending')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_momo_accounts'
    )

    # Name matching
    name_match_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Fuzzy match score with ID name"
    )
    rejection_reason = models.TextField(blank=True)

    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'provider', 'phone_number']

    def __str__(self):
        return f"{self.user.username} - {self.get_provider_display()} - {self.phone_number}"
