import logging
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_notification(self, notification_id):
    """Send an email notification asynchronously."""
    from .models import Notification
    try:
        notification = Notification.objects.select_related('recipient').get(id=notification_id)

        if notification.status in ('sent', 'delivered', 'read'):
            return f'Notification {notification_id} already sent'

        send_mail(
            subject=notification.subject,
            message=notification.message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[notification.recipient.email],
            fail_silently=False,
        )

        notification.mark_as_sent()
        logger.info(f'Email notification {notification_id} sent to {notification.recipient.email}')
        return f'Email sent to {notification.recipient.email}'

    except Notification.DoesNotExist:
        logger.error(f'Notification {notification_id} not found')
        return f'Notification {notification_id} not found'
    except Exception as exc:
        logger.error(f'Failed to send email notification {notification_id}: {exc}')
        notification.status = 'failed'
        notification.extra_data['error'] = str(exc)
        notification.save(update_fields=['status', 'extra_data'])
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_sms_notification(self, notification_id):
    """Send an SMS notification via Africa's Talking."""
    from .models import Notification
    try:
        notification = Notification.objects.select_related('recipient').get(id=notification_id)

        if notification.status in ('sent', 'delivered', 'read'):
            return f'Notification {notification_id} already sent'

        phone = notification.recipient_phone or notification.recipient.phone_number
        if not phone:
            notification.status = 'failed'
            notification.extra_data['error'] = 'No phone number'
            notification.save(update_fields=['status', 'extra_data'])
            return f'No phone number for notification {notification_id}'

        if not settings.SMS_ENABLED:
            logger.info(f'SMS disabled - would send to {phone}: {notification.message[:100]}')
            notification.mark_as_sent()
            return f'SMS disabled - marked as sent'

        import africastalking
        africastalking.initialize(
            settings.AFRICASTALKING_USERNAME,
            settings.AFRICASTALKING_API_KEY
        )
        sms = africastalking.SMS
        response = sms.send(
            notification.message[:160],
            [phone],
            sender_id=settings.AFRICASTALKING_SENDER_ID
        )

        notification.mark_as_sent()
        notification.extra_data['sms_response'] = str(response)
        notification.save(update_fields=['extra_data'])
        logger.info(f'SMS notification {notification_id} sent to {phone}')
        return f'SMS sent to {phone}'

    except Notification.DoesNotExist:
        logger.error(f'Notification {notification_id} not found')
        return f'Notification {notification_id} not found'
    except Exception as exc:
        logger.error(f'Failed to send SMS notification {notification_id}: {exc}')
        notification.status = 'failed'
        notification.extra_data['error'] = str(exc)
        notification.save(update_fields=['status', 'extra_data'])
        raise self.retry(exc=exc)


@shared_task(ignore_result=True)
def dispatch_notification(notification_id):
    """
    Route a notification to the appropriate delivery channel(s).
    Checks user preferences before dispatching.
    """
    from .models import Notification, NotificationPreference

    try:
        notification = Notification.objects.select_related('recipient').get(id=notification_id)
    except Notification.DoesNotExist:
        logger.error(f'Notification {notification_id} not found for dispatch')
        return

    # Check user preferences
    try:
        prefs = NotificationPreference.objects.get(user=notification.recipient)
    except NotificationPreference.DoesNotExist:
        prefs = None

    ntype = notification.notification_type

    if ntype == 'email':
        if prefs is None or prefs.email_notifications:
            send_email_notification.delay(notification_id)
    elif ntype == 'sms':
        if prefs is None or prefs.sms_notifications:
            send_sms_notification.delay(notification_id)
    elif ntype == 'in_app':
        # In-app notifications are already stored; mark as delivered
        notification.status = 'delivered'
        notification.save(update_fields=['status'])
    elif ntype == 'push':
        # Push notifications - mark as sent (FCM integration future)
        notification.mark_as_sent()
    elif ntype == 'whatsapp':
        # WhatsApp - fallback to SMS for now
        if prefs is None or prefs.sms_notifications:
            send_sms_notification.delay(notification_id)
    else:
        logger.warning(f'Unknown notification type: {ntype} for notification {notification_id}')


@shared_task(ignore_result=True)
def process_scheduled_notifications():
    """Process all notifications that are scheduled and due."""
    from .models import Notification

    now = timezone.now()
    pending = Notification.objects.filter(
        status='pending',
        scheduled_at__isnull=False,
        scheduled_at__lte=now
    )

    count = 0
    for notification in pending:
        dispatch_notification.delay(notification.id)
        count += 1

    if count:
        logger.info(f'Dispatched {count} scheduled notifications')
    return f'Dispatched {count} scheduled notifications'


@shared_task(ignore_result=True)
def process_bulk_notification(bulk_notification_id):
    """Process a bulk notification by creating individual notifications."""
    from .models import BulkNotification, Notification
    from users.models import CustomUser

    try:
        bulk = BulkNotification.objects.select_related('template').get(id=bulk_notification_id)
    except BulkNotification.DoesNotExist:
        return

    if bulk.status != 'scheduled':
        return

    bulk.status = 'sending'
    bulk.save(update_fields=['status'])

    # Determine recipients
    recipients = bulk.target_users.all()
    if not recipients.exists() and bulk.target_criteria:
        criteria = bulk.target_criteria
        qs = CustomUser.objects.filter(is_active=True)
        if criteria.get('user_type'):
            qs = qs.filter(user_type=criteria['user_type'])
        recipients = qs

    sent = 0
    failed = 0
    for user in recipients:
        try:
            notification = Notification.objects.create(
                recipient=user,
                sender=bulk.sender,
                notification_type=bulk.template.template_type if bulk.template else 'in_app',
                subject=bulk.template.subject_template if bulk.template else bulk.name,
                message=bulk.template.message_template if bulk.template else '',
                status='pending',
            )
            dispatch_notification.delay(notification.id)
            sent += 1
        except Exception as e:
            logger.error(f'Failed to create notification for user {user.id}: {e}')
            failed += 1

    bulk.status = 'completed'
    bulk.send_count = sent
    bulk.fail_count = failed
    bulk.save(update_fields=['status', 'send_count', 'fail_count'])
    return f'Bulk notification {bulk_notification_id}: sent={sent}, failed={failed}'


@shared_task(ignore_result=True)
def notify_new_message(message_id):
    """Create in-app notification when a new chat message is received."""
    from chat.models import Message, Conversation
    from .models import Notification
    from django.contrib.contenttypes.models import ContentType

    try:
        message = Message.objects.select_related(
            'sender', 'conversation'
        ).get(id=message_id)
    except Message.DoesNotExist:
        return

    conversation = message.conversation
    ct = ContentType.objects.get_for_model(Conversation)

    # Notify all participants except the sender
    for participant in conversation.participants.exclude(id=message.sender_id):
        Notification.objects.create(
            recipient=participant,
            sender=message.sender,
            notification_type='in_app',
            subject=f'New message from {message.sender.full_name}',
            message=message.content[:200] if message.content else 'Sent an attachment',
            status='delivered',
            content_type=ct,
            object_id=conversation.id,
        )
