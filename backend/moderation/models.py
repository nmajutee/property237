from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Report(models.Model):
    """User-submitted reports against properties, agents, or other users."""

    REPORT_TYPES = (
        ('spam', 'Spam / Scam'),
        ('misleading', 'Misleading Information'),
        ('duplicate', 'Duplicate Listing'),
        ('inappropriate', 'Inappropriate Content'),
        ('fake_agent', 'Fake Agent / Impersonation'),
        ('harassment', 'Harassment'),
        ('fraud', 'Fraudulent Activity'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('investigating', 'Under Investigation'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    )

    RESOLUTION_CHOICES = (
        ('no_action', 'No Action Needed'),
        ('warning_issued', 'Warning Issued'),
        ('content_removed', 'Content Removed'),
        ('user_suspended', 'User Suspended'),
        ('listing_removed', 'Listing Removed'),
        ('agent_unverified', 'Agent Verification Revoked'),
    )

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='reports_filed',
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    reported_object = GenericForeignKey('content_type', 'object_id')

    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField()
    evidence = models.FileField(upload_to='reports/evidence/', blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    resolution = models.CharField(max_length=20, choices=RESOLUTION_CHOICES, blank=True)
    resolution_notes = models.TextField(blank=True)

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reports_reviewed',
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['content_type', 'object_id']),
        ]

    def __str__(self):
        return f"Report #{self.id} - {self.get_report_type_display()} ({self.status})"


class ModerationAction(models.Model):
    """Audit log for all moderation actions taken by admins."""

    ACTION_TYPES = (
        ('property_approved', 'Property Approved'),
        ('property_rejected', 'Property Rejected'),
        ('property_removed', 'Property Removed'),
        ('agent_verified', 'Agent Verified'),
        ('agent_rejected', 'Agent Rejected'),
        ('agent_unverified', 'Agent Verification Revoked'),
        ('user_suspended', 'User Suspended'),
        ('user_activated', 'User Activated'),
        ('user_warned', 'User Warned'),
        ('report_resolved', 'Report Resolved'),
        ('report_dismissed', 'Report Dismissed'),
        ('listing_flagged', 'Listing Flagged'),
        ('content_removed', 'Content Removed'),
    )

    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='moderation_actions',
    )
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)
    reason = models.TextField(blank=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target_object = GenericForeignKey('content_type', 'object_id')

    report = models.ForeignKey(
        Report, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='actions',
    )

    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action_type', 'created_at']),
            models.Index(fields=['moderator', 'created_at']),
        ]

    def __str__(self):
        return f"{self.get_action_type_display()} by {self.moderator} at {self.created_at}"


class ListingAutoCheck(models.Model):
    """Auto-check results for new listings before approval."""

    CHECK_TYPES = (
        ('duplicate', 'Potential Duplicate'),
        ('banned_words', 'Banned Words Detected'),
        ('price_anomaly', 'Price Anomaly'),
        ('missing_images', 'Missing Images'),
    )

    SEVERITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    property = models.ForeignKey(
        'properties.Property', on_delete=models.CASCADE,
        related_name='auto_checks',
    )
    check_type = models.CharField(max_length=20, choices=CHECK_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='medium')
    details = models.TextField()
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_check_type_display()} for {self.property.title}"
