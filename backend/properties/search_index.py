import logging

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import Property, PropertySearchSync
from .search_documents import build_property_search_document

logger = logging.getLogger(__name__)

SEARCH_SELECT_RELATED = (
    'property_type',
    'status',
    'area__city__region',
    'agent__user',
)
SEARCH_PREFETCH_RELATED = ('images',)


class NoopPropertySearchBackend:
    def upsert(self, document):
        logger.info(
            'Search noop upsert queued for property %s into index %s',
            document.get('slug'),
            settings.PROPERTY_SEARCH_INDEX_NAME,
        )

    def delete(self, property_slug):
        logger.info(
            'Search noop delete queued for property %s from index %s',
            property_slug,
            settings.PROPERTY_SEARCH_INDEX_NAME,
        )


def get_property_search_backend():
    backend_name = getattr(settings, 'PROPERTY_SEARCH_INDEX_BACKEND', 'noop')
    if backend_name == 'noop':
        return NoopPropertySearchBackend()

    raise NotImplementedError(f'Unsupported property search backend: {backend_name}')


def _load_property(property_id):
    return Property.objects.select_related(*SEARCH_SELECT_RELATED).prefetch_related(*SEARCH_PREFETCH_RELATED).get(pk=property_id)


def _dispatch_event(event_id):
    if not getattr(settings, 'PROPERTY_SEARCH_AUTO_DISPATCH', False):
        return

    from .tasks import sync_property_search_event

    sync_property_search_event.delay(event_id)


def queue_property_upsert(property_id, property_slug, reason='property_updated'):
    def _enqueue():
        try:
            property_obj = _load_property(property_id)
        except Property.DoesNotExist:
            logger.info('Skipping search upsert for missing property %s', property_id)
            return

        payload = build_property_search_document(property_obj)
        existing = PropertySearchSync.objects.filter(
            property_id=property_id,
            action=PropertySearchSync.Action.UPSERT,
            status=PropertySearchSync.Status.PENDING,
        ).order_by('-created_at').first()

        if existing:
            existing.property_slug = property_slug
            existing.reason = reason
            existing.payload = payload
            existing.available_at = timezone.now()
            existing.last_error = ''
            existing.save(update_fields=['property_slug', 'reason', 'payload', 'available_at', 'last_error', 'updated_at'])
            event = existing
        else:
            event = PropertySearchSync.objects.create(
                property=property_obj,
                property_slug=property_slug,
                action=PropertySearchSync.Action.UPSERT,
                reason=reason,
                payload=payload,
            )

        _dispatch_event(event.id)

    transaction.on_commit(_enqueue)


def queue_property_delete(property_id, property_slug, reason='property_deleted'):
    def _enqueue():
        PropertySearchSync.objects.filter(
            property_slug=property_slug,
            status=PropertySearchSync.Status.PENDING,
        ).delete()

        event = PropertySearchSync.objects.create(
            property=None,
            property_slug=property_slug,
            action=PropertySearchSync.Action.DELETE,
            reason=reason,
            payload={
                'id': property_id,
                'slug': property_slug,
            },
        )

        _dispatch_event(event.id)

    transaction.on_commit(_enqueue)


def process_search_sync_event(event):
    backend = get_property_search_backend()

    if event.action == PropertySearchSync.Action.UPSERT:
        backend.upsert(event.payload)
        return

    backend.delete(event.property_slug)