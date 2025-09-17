from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

User = get_user_model()


class AnalyticsMetric(models.Model):
    """
    System analytics and metrics tracking
    """
    METRIC_TYPES = (
        ('property_views', 'Property Views'),
        ('property_inquiries', 'Property Inquiries'),
        ('user_registrations', 'User Registrations'),
        ('lease_signings', 'Lease Signings'),
        ('rent_collections', 'Rent Collections'),
        ('maintenance_requests', 'Maintenance Requests'),
        ('occupancy_rate', 'Occupancy Rate'),
        ('revenue', 'Revenue'),
    )

    metric_type = models.CharField(max_length=30, choices=METRIC_TYPES)
    date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Optional dimensions for filtering
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )
    area = models.ForeignKey(
        'locations.Area',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['metric_type', 'date', 'property', 'user', 'area']
        ordering = ['-date', 'metric_type']

    def __str__(self):
        return f"{self.get_metric_type_display()} - {self.date} - {self.value}"


class PropertyAnalytics(models.Model):
    """
    Detailed analytics for individual properties
    """
    property = models.OneToOneField(
        'properties.Property',
        on_delete=models.CASCADE,
        related_name='detailed_analytics'
    )

    # View Statistics
    total_views = models.PositiveIntegerField(default=0)
    unique_views = models.PositiveIntegerField(default=0)
    this_month_views = models.PositiveIntegerField(default=0)

    # Inquiry Statistics
    total_inquiries = models.PositiveIntegerField(default=0)
    this_month_inquiries = models.PositiveIntegerField(default=0)

    # Performance Metrics
    days_on_market = models.PositiveIntegerField(default=0)
    average_time_to_respond = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Average response time in hours"
    )

    # Financial Metrics
    total_revenue = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Property Analytics"

    def __str__(self):
        return f"Analytics for {self.property.title}"


class UserAnalytics(models.Model):
    """
    Analytics for user behavior and performance
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='detailed_analytics'
    )

    # Activity Metrics
    properties_listed = models.PositiveIntegerField(default=0)
    properties_rented = models.PositiveIntegerField(default=0)
    properties_sold = models.PositiveIntegerField(default=0)

    # Communication Metrics
    inquiries_sent = models.PositiveIntegerField(default=0)
    inquiries_received = models.PositiveIntegerField(default=0)
    response_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Response rate as percentage"
    )

    # Financial Metrics
    total_earnings = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User Analytics"

    def __str__(self):
        return f"Analytics for {self.user.full_name}"


class MarketAnalytics(models.Model):
    """
    Market-wide analytics and trends
    """
    area = models.ForeignKey('locations.Area', on_delete=models.CASCADE, related_name='market_analytics')
    date = models.DateField()

    # Market Metrics
    average_rent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    average_sale_price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True
    )
    occupancy_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Occupancy rate as percentage"
    )

    # Activity Metrics
    new_listings = models.PositiveIntegerField(default=0)
    closed_deals = models.PositiveIntegerField(default=0)
    average_days_on_market = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['area', 'date']
        ordering = ['-date', 'area']

    def __str__(self):
        return f"Market Analytics - {self.area.name} - {self.date}"

# Create your models here.
