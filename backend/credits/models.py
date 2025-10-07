"""
Credit System Models
Professional credit-based monetization for property viewing and listing
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()


class CreditBalance(models.Model):
    """
    User credit balance - one per user
    Tracks available credits and usage history
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='credit_balance'
    )
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Current available credits"
    )
    total_purchased = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total credits ever purchased"
    )
    total_spent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total credits ever spent"
    )
    total_earned = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total credits earned (bonuses, referrals, etc.)"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_purchase_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Credit Balance"
        verbose_name_plural = "Credit Balances"
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['balance']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.balance} credits"

    def has_credits(self, amount):
        """Check if user has sufficient credits"""
        return self.balance >= Decimal(str(amount))

    def add_credits(self, amount, transaction_type, description=""):
        """Add credits to balance"""
        amount = Decimal(str(amount))
        self.balance += amount

        if transaction_type == CreditTransaction.PURCHASE:
            self.total_purchased += amount
            self.last_purchase_at = timezone.now()
        elif transaction_type in [CreditTransaction.BONUS, CreditTransaction.REFERRAL]:
            self.total_earned += amount

        self.save()
        return self.balance

    def deduct_credits(self, amount, transaction_type, description=""):
        """Deduct credits from balance"""
        amount = Decimal(str(amount))
        if not self.has_credits(amount):
            raise ValueError("Insufficient credits")

        self.balance -= amount
        self.total_spent += amount
        self.save()
        return self.balance


class CreditPackage(models.Model):
    """
    Credit packages available for purchase
    Defines pricing tiers and bonuses
    """
    CURRENCY_CHOICES = [
        ('XAF', 'Central African Franc'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, help_text="Package name (e.g., Starter, Premium)")
    credits = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Base credits in package"
    )
    bonus_credits = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Bonus credits added to package"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='XAF')

    # Display settings
    is_popular = models.BooleanField(default=False, help_text="Mark as popular package")
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Credit Package"
        verbose_name_plural = "Credit Packages"
        ordering = ['display_order', 'price']
        indexes = [
            models.Index(fields=['is_active', 'display_order']),
        ]

    def __str__(self):
        return f"{self.name} - {self.total_credits} credits for {self.price} {self.currency}"

    @property
    def total_credits(self):
        """Total credits including bonus"""
        return self.credits + self.bonus_credits

    @property
    def price_per_credit(self):
        """Calculate price per credit"""
        return self.price / Decimal(str(self.total_credits))


class CreditTransaction(models.Model):
    """
    Credit transaction history
    Immutable audit trail of all credit operations
    """
    PURCHASE = 'purchase'
    USAGE = 'usage'
    REFUND = 'refund'
    BONUS = 'bonus'
    REFERRAL = 'referral'
    ADMIN_ADJUSTMENT = 'admin_adjustment'

    TRANSACTION_TYPES = [
        (PURCHASE, 'Credit Purchase'),
        (USAGE, 'Credit Usage'),
        (REFUND, 'Refund'),
        (BONUS, 'Bonus Credits'),
        (REFERRAL, 'Referral Reward'),
        (ADMIN_ADJUSTMENT, 'Admin Adjustment'),
    ]

    STATUS_PENDING = 'pending'
    STATUS_COMPLETED = 'completed'
    STATUS_FAILED = 'failed'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='credit_transactions'
    )

    # Transaction details
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Credit amount (positive for credit, negative for debit)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )

    # Balance tracking
    balance_before = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)

    # Reference data
    description = models.TextField(blank=True)
    reference_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="External reference (payment ID, property ID, etc.)"
    )
    package = models.ForeignKey(
        CreditPackage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )

    # Payment details (for purchases)
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)
    payment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    payment_currency = models.CharField(max_length=3, blank=True)

    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Credit Transaction"
        verbose_name_plural = "Credit Transactions"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['transaction_type', 'status']),
            models.Index(fields=['reference_id']),
            models.Index(fields=['payment_reference']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.transaction_type} - {self.amount} credits"


class CreditPricing(models.Model):
    """
    Credit pricing rules for different actions
    Centralized pricing configuration
    """
    ACTION_VIEW_PROPERTY = 'view_property'
    ACTION_LIST_PROPERTY = 'list_property'
    ACTION_FEATURED_LISTING = 'featured_listing'
    ACTION_CONTACT_REVEAL = 'contact_reveal'

    ACTION_CHOICES = [
        (ACTION_VIEW_PROPERTY, 'View Full Property Details'),
        (ACTION_LIST_PROPERTY, 'List Property'),
        (ACTION_FEATURED_LISTING, 'Featured Listing (per day)'),
        (ACTION_CONTACT_REVEAL, 'Reveal Contact Information'),
    ]

    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES,
        unique=True,
        help_text="Action requiring credits"
    )
    credits_required = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Credits required for this action"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Credit Pricing"
        verbose_name_plural = "Credit Pricing Rules"
        ordering = ['action']

    def __str__(self):
        return f"{self.get_action_display()} - {self.credits_required} credits"

    @classmethod
    def get_price(cls, action):
        """Get credit price for an action"""
        try:
            pricing = cls.objects.get(action=action, is_active=True)
            return pricing.credits_required
        except cls.DoesNotExist:
            # Default prices if not configured
            defaults = {
                cls.ACTION_VIEW_PROPERTY: Decimal('1.00'),
                cls.ACTION_LIST_PROPERTY: Decimal('5.00'),
                cls.ACTION_FEATURED_LISTING: Decimal('2.00'),
                cls.ACTION_CONTACT_REVEAL: Decimal('0.50'),
            }
            return defaults.get(action, Decimal('1.00'))


class PropertyView(models.Model):
    """
    Track property views by users (for credit deduction)
    Prevents double-charging for same property
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='property_views'
    )
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.CASCADE,
        related_name='credit_views'
    )
    transaction = models.ForeignKey(
        CreditTransaction,
        on_delete=models.SET_NULL,
        null=True,
        related_name='property_views'
    )

    # View metadata
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        verbose_name = "Property View"
        verbose_name_plural = "Property Views"
        unique_together = ['user', 'property']
        indexes = [
            models.Index(fields=['user', 'property']),
            models.Index(fields=['-viewed_at']),
        ]

    def __str__(self):
        return f"{self.user.email} viewed Property #{self.property.id}"
