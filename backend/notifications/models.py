from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone

User = get_user_model()


class NotificationTemplate(models.Model):
    """
    Reusable notification templates for different types of notifications
    """
    TEMPLATE_TYPES = (
        ('lease_reminder', 'Lease Payment Reminder'),
        ('maintenance_update', 'Maintenance Update'),
        ('property_inquiry', 'Property Inquiry'),
        ('lease_expiry', 'Lease Expiry Notice'),
        ('verification_complete', 'Verification Complete'),
        ('payment_received', 'Payment Received'),
        ('system_update', 'System Update'),
        ('marketing', 'Marketing Message'),
    )

    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=30, choices=TEMPLATE_TYPES)
    subject_template = models.CharField(max_length=200)
    message_template = models.TextField()

    # Multi-language support
    subject_template_fr = models.CharField(max_length=200, blank=True, null=True)
    message_template_fr = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'template_type']

    def __str__(self):
        return f"{self.name} - {self.get_template_type_display()}"


class Notification(models.Model):
    """
    Individual notifications sent to users
    """
    NOTIFICATION_TYPES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('in_app', 'In-App Notification'),
        ('whatsapp', 'WhatsApp'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('read', 'Read'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )

    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications'
    )

    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')

    # Generic relation to any model
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    # Scheduling
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    # Additional data for processing
    extra_data = models.JSONField(default=dict, blank=True)

    # Phone number for SMS/WhatsApp
    recipient_phone = models.CharField(max_length=15, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['notification_type', 'status']),
            models.Index(fields=['scheduled_at']),
        ]

    def __str__(self):
        return f"{self.subject} to {self.recipient.full_name}"

    def mark_as_read(self):
        """Mark notification as read"""
        if self.status != 'read':
            self.status = 'read'
            self.read_at = timezone.now()
            self.save(update_fields=['status', 'read_at'])

    def mark_as_sent(self):
        """Mark notification as sent"""
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save(update_fields=['status', 'sent_at'])


class NotificationPreference(models.Model):
    """
    User preferences for different types of notifications
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )

    # Email preferences
    email_lease_reminders = models.BooleanField(default=True)
    email_maintenance_updates = models.BooleanField(default=True)
    email_property_inquiries = models.BooleanField(default=True)
    email_marketing = models.BooleanField(default=False)

    # SMS preferences
    sms_lease_reminders = models.BooleanField(default=True)
    sms_maintenance_urgent = models.BooleanField(default=True)
    sms_payment_confirmations = models.BooleanField(default=True)
    sms_marketing = models.BooleanField(default=False)

    # Push notification preferences
    push_property_inquiries = models.BooleanField(default=True)
    push_maintenance_updates = models.BooleanField(default=True)
    push_lease_reminders = models.BooleanField(default=True)
    push_marketing = models.BooleanField(default=False)

    # WhatsApp preferences (popular in Cameroon)
    whatsapp_lease_reminders = models.BooleanField(default=False)
    whatsapp_maintenance_updates = models.BooleanField(default=False)
    whatsapp_marketing = models.BooleanField(default=False)

    # General preferences
    preferred_language = models.CharField(
        max_length=5,
        choices=(('en', 'English'), ('fr', 'French')),
        default='fr'  # French is common in Cameroon
    )
    quiet_hours_start = models.TimeField(default='22:00')
    quiet_hours_end = models.TimeField(default='07:00')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification Preferences - {self.user.full_name}"


class BulkNotification(models.Model):
    """
    For sending bulk notifications to multiple users
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bulk_notifications'
    )

    name = models.CharField(max_length=100)
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.CASCADE,
        related_name='bulk_notifications'
    )

    # Target audience
    target_users = models.ManyToManyField(
        User,
        related_name='received_bulk_notifications',
        blank=True
    )
    target_criteria = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON criteria for selecting users"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_at = models.DateTimeField(null=True, blank=True)

    # Statistics
    total_recipients = models.PositiveIntegerField(default=0)
    sent_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Bulk: {self.name} ({self.status})"

# Create your models here.
