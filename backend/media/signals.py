from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from properties.search_index import queue_property_upsert

from .models import PropertyImage


@receiver(post_save, sender=PropertyImage)
def queue_property_image_sync(sender, instance, **kwargs):
    queue_property_upsert(
        property_id=instance.property_id,
        property_slug=instance.property.slug,
        reason='property_image_updated',
    )


@receiver(post_delete, sender=PropertyImage)
def queue_property_image_delete_sync(sender, instance, **kwargs):
    queue_property_upsert(
        property_id=instance.property_id,
        property_slug=instance.property.slug,
        reason='property_image_deleted',
    )