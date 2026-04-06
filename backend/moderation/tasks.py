from celery import shared_task
import logging

logger = logging.getLogger(__name__)

# Common scam/spam words in Cameroon real estate context
BANNED_WORDS = [
    'western union', 'wire transfer', 'money gram', 'advance fee',
    'send money first', 'no viewing', 'urgent sale below market',
    'lottery', 'inheritance', 'prince', 'diplomat',
]


@shared_task(ignore_result=True)
def run_listing_auto_checks(property_id):
    """Run automated checks on a new property listing."""
    from properties.models import Property
    from .models import ListingAutoCheck

    try:
        prop = Property.objects.select_related('area', 'property_type').get(id=property_id)
    except Property.DoesNotExist:
        return

    # 1. Banned words check
    text = f"{prop.title} {prop.description}".lower()
    found_words = [w for w in BANNED_WORDS if w in text]
    if found_words:
        ListingAutoCheck.objects.create(
            property=prop,
            check_type='banned_words',
            severity='high',
            details=f"Banned words detected: {', '.join(found_words)}",
        )

    # 2. Price anomaly check (unusually low/high for the area)
    from django.db.models import Avg
    avg_price = Property.objects.filter(
        area=prop.area,
        listing_type=prop.listing_type,
        is_active=True,
    ).exclude(id=prop.id).aggregate(avg=Avg('price'))['avg']

    if avg_price and avg_price > 0:
        ratio = float(prop.price) / float(avg_price)
        if ratio < 0.3:
            ListingAutoCheck.objects.create(
                property=prop,
                check_type='price_anomaly',
                severity='medium',
                details=f"Price ({prop.price:,.0f} XAF) is {ratio:.0%} of area average ({avg_price:,.0f} XAF). Unusually low.",
            )
        elif ratio > 5.0:
            ListingAutoCheck.objects.create(
                property=prop,
                check_type='price_anomaly',
                severity='low',
                details=f"Price ({prop.price:,.0f} XAF) is {ratio:.1f}x the area average ({avg_price:,.0f} XAF). Unusually high.",
            )

    # 3. Duplicate check
    similar = Property.objects.filter(
        area=prop.area,
        listing_type=prop.listing_type,
        is_active=True,
    ).exclude(id=prop.id)

    title_words = set(prop.title.lower().split())
    for s in similar[:50]:  # Limit to 50 for performance
        s_words = set(s.title.lower().split())
        overlap = len(title_words & s_words)
        total = max(len(title_words), len(s_words), 1)
        similarity = overlap / total

        if similarity >= 0.6:
            ListingAutoCheck.objects.create(
                property=prop,
                check_type='duplicate',
                severity='medium',
                details=f"Similar to '{s.title}' (ID: {s.id}, similarity: {similarity:.0%})",
            )
            break  # Only flag the first match

    # 4. Missing images check
    if not prop.images.exists():
        ListingAutoCheck.objects.create(
            property=prop,
            check_type='missing_images',
            severity='low',
            details="No images uploaded. Listings with images get 10x more views.",
        )

    logger.info('Auto-checks completed for property %d', property_id)
