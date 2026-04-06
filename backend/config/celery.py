import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('property237')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Periodic task schedule
app.conf.beat_schedule = {
    'process-scheduled-notifications': {
        'task': 'notifications.tasks.process_scheduled_notifications',
        'schedule': 60.0,  # every minute
    },
    'check-lease-expiry-reminders': {
        'task': 'leases.tasks.check_lease_expiry_reminders',
        'schedule': crontab(hour=8, minute=0),  # daily at 8 AM
    },
    'check-rent-due-reminders': {
        'task': 'leases.tasks.check_rent_due_reminders',
        'schedule': crontab(hour=9, minute=0),  # daily at 9 AM
    },
    'auto-expire-leases': {
        'task': 'leases.tasks.auto_expire_leases',
        'schedule': crontab(hour=0, minute=30),  # daily at 00:30
    },
    'aggregate-daily-analytics': {
        'task': 'analytics.tasks.aggregate_daily_analytics',
        'schedule': crontab(hour=1, minute=0),  # daily at 1 AM
    },
    'update-property-view-counts': {
        'task': 'analytics.tasks.update_property_view_counts',
        'schedule': crontab(hour=0, minute=5),  # daily at 00:05
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
