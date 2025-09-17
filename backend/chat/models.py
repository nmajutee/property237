from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Conversation(models.Model):
    """
    Chat conversations between users (tenant-agent, agent-landlord, etc.)
    """
    CONVERSATION_TYPES = (
        ('property_inquiry', 'Property Inquiry'),
        ('viewing_arrangement', 'Viewing Arrangement'),
        ('lease_discussion', 'Lease Discussion'),
        ('maintenance_support', 'Maintenance Support'),
        ('escrow_coordination', 'Escrow Coordination'),
        ('general_support', 'General Support'),
    )

    conversation_id = models.CharField(max_length=20, unique=True, blank=True)
    conversation_type = models.CharField(max_length=20, choices=CONVERSATION_TYPES, default='property_inquiry')

    # Participants
    participants = models.ManyToManyField(User, related_name='conversations')

    # Context
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='conversations'
    )
    escrow = models.ForeignKey(
        'payment.Escrow',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='conversations'
    )

    # Status
    is_active = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_message_at']

    def __str__(self):
        participant_names = ", ".join([user.username for user in self.participants.all()[:3]])
        return f"Conversation {self.conversation_id} - {participant_names}"

    def save(self, *args, **kwargs):
        if not self.conversation_id:
            from django.utils.crypto import get_random_string
            self.conversation_id = f"CONV{get_random_string(10, '0123456789ABCDEF')}"
        super().save(*args, **kwargs)


class Message(models.Model):
    """
    Individual messages in conversations
    """
    MESSAGE_TYPES = (
        ('text', 'Text Message'),
        ('image', 'Image'),
        ('document', 'Document'),
        ('location', 'Location'),
        ('payment_proof', 'Payment Proof'),
        ('system', 'System Message'),
    )

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')

    message_type = models.CharField(max_length=15, choices=MESSAGE_TYPES, default='text')
    content = models.TextField()

    # Attachments
    attachment = models.FileField(upload_to='chat_attachments/', blank=True, null=True)
    attachment_filename = models.CharField(max_length=255, blank=True)

    # Message status
    is_read = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    # Quick actions (embedded UI)
    quick_actions = models.JSONField(default=dict, blank=True, help_text="Available quick actions like 'Book Viewing', 'Create Escrow'")

    # Timestamps
    sent_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['sent_at']

    def __str__(self):
        return f"{self.sender.username} in {self.conversation.conversation_id} - {self.message_type}"

    def mark_as_read(self, user=None):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.save(update_fields=['is_read'])

            # Update conversation timestamp
            self.conversation.last_message_at = timezone.now()
            self.conversation.save(update_fields=['last_message_at'])


class MessageReadStatus(models.Model):
    """
    Track read status per participant (for group chats)
    """
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_statuses')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['message', 'user']

    def __str__(self):
        return f"{self.user.username} read message {self.message.id}"


class QuickAction(models.Model):
    """
    Pre-defined quick actions for chat (Book Viewing, Create Escrow, etc.)
    """
    ACTION_TYPES = (
        ('book_viewing', 'Book Property Viewing'),
        ('create_escrow', 'Create Escrow'),
        ('schedule_call', 'Schedule Phone Call'),
        ('request_documents', 'Request Documents'),
        ('report_issue', 'Report Issue'),
        ('negotiate_price', 'Negotiate Price'),
    )

    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    label = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    # Context requirements
    requires_property = models.BooleanField(default=False)
    requires_tenant_role = models.BooleanField(default=False)
    requires_agent_role = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.label


class ChatModeration(models.Model):
    """
    Chat moderation and flagged content
    """
    MODERATION_ACTIONS = (
        ('flagged', 'Flagged for Review'),
        ('warned', 'User Warned'),
        ('message_removed', 'Message Removed'),
        ('user_suspended', 'User Suspended'),
        ('resolved', 'Resolved'),
    )

    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='moderations')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_messages')
    reason = models.TextField()

    action_taken = models.CharField(max_length=20, choices=MODERATION_ACTIONS, default='flagged')
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderated_messages'
    )
    resolution_notes = models.TextField(blank=True)

    reported_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Moderation: {self.message.id} - {self.action_taken}"


class TypingIndicator(models.Model):
    """
    Real-time typing indicators
    """
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_typing = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['conversation', 'user']

    def __str__(self):
        return f"{self.user.username} typing in {self.conversation.conversation_id}"
