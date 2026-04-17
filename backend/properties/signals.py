from django.conf import settings
from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Property
from .search_index import queue_property_delete, queue_property_upsert

IGNORED_UPDATE_FIELDS = {'views_count', 'updated_at'}


def queue_property_sitemap_refresh():
    if not getattr(settings, 'PROPERTY_SITEMAP_AUTO_DISPATCH', False):
        return

    def _dispatch():
        from .tasks import refresh_property_sitemap_entries_cache

        refresh_property_sitemap_entries_cache.delay()

    transaction.on_commit(_dispatch)


@receiver(post_save, sender=Property)
def queue_property_for_search_sync(sender, instance, created, update_fields=None, **kwargs):
    if update_fields is not None:
        normalized_fields = {str(field) for field in update_fields}
        if normalized_fields and normalized_fields.issubset(IGNORED_UPDATE_FIELDS):
            return

    queue_property_upsert(
        property_id=instance.pk,
        property_slug=instance.slug,
        reason='property_created' if created else 'property_updated',
    )
    queue_property_sitemap_refresh()


@receiver(post_delete, sender=Property)
def queue_property_for_search_removal(sender, instance, **kwargs):
    queue_property_delete(
        property_id=instance.pk,
        property_slug=instance.slug,
        reason='property_deleted',
    )
    queue_property_sitemap_refresh()