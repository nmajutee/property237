from celery import shared_task
from django.utils import timezone

from .models import PropertySearchSync
from .search_index import process_search_sync_event
from .sitemap_entries import refresh_property_sitemap_entries_cache as refresh_property_sitemap_entries_snapshot


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_jitter=True, retry_kwargs={'max_retries': 3})
def sync_property_search_event(self, event_id):
    try:
        event = PropertySearchSync.objects.get(pk=event_id)
    except PropertySearchSync.DoesNotExist:
        return {'status': 'missing', 'event_id': event_id}

    if event.status == PropertySearchSync.Status.COMPLETED:
        return {'status': 'already_completed', 'event_id': event_id}

    event.status = PropertySearchSync.Status.PROCESSING
    event.last_error = ''
    event.save(update_fields=['status', 'last_error', 'updated_at'])

    try:
        process_search_sync_event(event)
    except Exception as exc:
        event.status = PropertySearchSync.Status.FAILED
        event.retry_count += 1
        event.last_error = str(exc)
        event.processed_at = timezone.now()
        event.save(update_fields=['status', 'retry_count', 'last_error', 'processed_at', 'updated_at'])
        raise

    event.status = PropertySearchSync.Status.COMPLETED
    event.processed_at = timezone.now()
    event.save(update_fields=['status', 'processed_at', 'updated_at'])

    return {'status': 'completed', 'event_id': event_id}


@shared_task
def refresh_property_sitemap_entries_cache():
    payload = refresh_property_sitemap_entries_snapshot()
    return {'status': 'completed', 'count': len(payload)}