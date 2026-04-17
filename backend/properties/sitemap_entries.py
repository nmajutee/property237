import logging

from django.core.cache import cache

from .models import Property
from .serializers import PropertySitemapEntrySerializer

logger = logging.getLogger(__name__)

PROPERTY_SITEMAP_CACHE_KEY = 'properties:sitemap:entries:v1'


def build_property_sitemap_entries_payload():
    queryset = Property.objects.filter(is_active=True).exclude(status__name='draft').only(
        'slug', 'created_at', 'updated_at'
    ).order_by('-updated_at')

    return list(PropertySitemapEntrySerializer(queryset, many=True).data)


def get_cached_property_sitemap_entries():
    cached_entries = cache.get(PROPERTY_SITEMAP_CACHE_KEY)
    if isinstance(cached_entries, list):
        return cached_entries
    return None


def refresh_property_sitemap_entries_cache():
    payload = build_property_sitemap_entries_payload()
    cache.set(PROPERTY_SITEMAP_CACHE_KEY, payload, timeout=None)
    return payload


def get_property_sitemap_entries_payload():
    try:
        payload = refresh_property_sitemap_entries_cache()
        return payload, 'live'
    except Exception:
        cached_entries = get_cached_property_sitemap_entries()
        if cached_entries is None:
            raise

        logger.warning(
            'Serving cached property sitemap entries after live refresh failure.',
            exc_info=True,
        )
        return cached_entries, 'stale-cache'