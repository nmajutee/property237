from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(ignore_result=True)
def check_lease_expiry_reminders():
    """Send reminders for leases expiring in 30, 7, and 1 days."""
    from .models import LeaseAgreement
    from notifications.models import Notification

    today = timezone.now().date()
    reminder_days = [30, 7, 1]

    for days in reminder_days:
        target_date = today + timedelta(days=days)
        expiring_leases = LeaseAgreement.objects.filter(
            status='active',
            end_date=target_date,
        ).select_related('tenant', 'landlord', 'property')

        for lease in expiring_leases:
            # Notify tenant
            if lease.tenant:
                Notification.objects.create(
                    recipient=lease.tenant,
                    notification_type='email',
                    priority='high' if days <= 7 else 'normal',
                    subject=f'Lease expiring in {days} day{"s" if days != 1 else ""}',
                    message=(
                        f'Your lease for {lease.property.title} expires on '
                        f'{lease.end_date.strftime("%B %d, %Y")}. '
                        f'{"Please contact your landlord for renewal." if days <= 7 else "Consider your renewal options."}'
                    ),
                )

            # Notify landlord
            if lease.landlord:
                Notification.objects.create(
                    recipient=lease.landlord,
                    notification_type='email',
                    priority='high' if days <= 7 else 'normal',
                    subject=f'Tenant lease expiring in {days} day{"s" if days != 1 else ""}',
                    message=(
                        f'Lease for {lease.property.title} with tenant '
                        f'{lease.tenant.full_name if lease.tenant else "Unknown"} '
                        f'expires on {lease.end_date.strftime("%B %d, %Y")}.'
                    ),
                )

        logger.info(
            'Lease expiry reminders sent for %d leases expiring in %d days',
            expiring_leases.count(), days
        )


@shared_task(ignore_result=True)
def check_rent_due_reminders():
    """Send reminders for rent due in 3 days and overdue rent."""
    from .models import RentSchedule
    from notifications.models import Notification

    today = timezone.now().date()

    # Upcoming rent (3 days before due)
    upcoming = RentSchedule.objects.filter(
        due_date=today + timedelta(days=3),
        is_paid=False,
    ).select_related('lease', 'lease__tenant', 'lease__property')

    for schedule in upcoming:
        tenant = schedule.lease.tenant
        if tenant:
            Notification.objects.create(
                recipient=tenant,
                notification_type='in_app',
                subject='Rent due soon',
                message=(
                    f'Your rent of {schedule.amount:,.0f} XAF for '
                    f'{schedule.lease.property.title} is due on '
                    f'{schedule.due_date.strftime("%B %d, %Y")}.'
                ),
            )

    # Overdue rent
    overdue = RentSchedule.objects.filter(
        due_date__lt=today,
        is_paid=False,
    ).select_related('lease', 'lease__tenant', 'lease__landlord', 'lease__property')

    for schedule in overdue:
        days_late = (today - schedule.due_date).days
        # Only send reminders at specific intervals to avoid spam
        if days_late not in [1, 3, 7, 14, 30]:
            continue

        tenant = schedule.lease.tenant
        if tenant:
            Notification.objects.create(
                recipient=tenant,
                notification_type='sms' if days_late >= 7 else 'in_app',
                priority='urgent' if days_late >= 14 else 'high',
                subject=f'Rent overdue - {days_late} days',
                message=(
                    f'Your rent of {schedule.amount:,.0f} XAF for '
                    f'{schedule.lease.property.title} was due on '
                    f'{schedule.due_date.strftime("%B %d, %Y")} '
                    f'({days_late} days ago). Please pay immediately.'
                ),
            )

        landlord = schedule.lease.landlord
        if landlord and days_late in [1, 7, 14, 30]:
            Notification.objects.create(
                recipient=landlord,
                notification_type='in_app',
                priority='high',
                subject=f'Tenant rent overdue - {days_late} days',
                message=(
                    f'Rent of {schedule.amount:,.0f} XAF for '
                    f'{schedule.lease.property.title} is {days_late} days overdue.'
                ),
            )

    logger.info(
        'Rent reminders: %d upcoming, %d overdue entries processed',
        upcoming.count(), overdue.count()
    )


@shared_task(ignore_result=True)
def auto_expire_leases():
    """Mark active leases past their end date as expired."""
    from .models import LeaseAgreement

    today = timezone.now().date()
    expired = LeaseAgreement.objects.filter(
        status='active',
        end_date__lt=today,
        auto_renewal=False,
    ).update(status='expired')

    logger.info('Auto-expired %d leases', expired)
