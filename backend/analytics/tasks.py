from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(ignore_result=True)
def aggregate_daily_analytics():
    """Aggregate daily analytics metrics from raw data."""
    from .models import AnalyticsMetric, PropertyAnalytics, MarketAnalytics
    from properties.models import Property
    from locations.models import Area
    from django.db.models import Count, Avg, Sum

    yesterday = timezone.now().date() - timedelta(days=1)

    # Count new listings per day
    new_listings = Property.objects.filter(
        created_at__date=yesterday
    ).count()
    if new_listings:
        AnalyticsMetric.objects.update_or_create(
            metric_type='registrations',
            date=yesterday,
            property=None, user=None, area=None,
            defaults={'value': new_listings},
        )

    # Update PropertyAnalytics for viewed properties
    for prop_analytics in PropertyAnalytics.objects.select_related('property').all():
        prop = prop_analytics.property
        if prop.created_at:
            prop_analytics.days_on_market = (timezone.now().date() - prop.created_at.date()).days
            prop_analytics.save(update_fields=['days_on_market'])

    # Market analytics per area
    areas = Area.objects.all()
    for area in areas:
        props_in_area = Property.objects.filter(area=area, is_available=True)
        if not props_in_area.exists():
            continue

        rent_props = props_in_area.filter(listing_type='rent')
        sale_props = props_in_area.filter(listing_type='sale')

        avg_rent = rent_props.aggregate(avg=Avg('price'))['avg'] or 0
        avg_sale = sale_props.aggregate(avg=Avg('price'))['avg'] or 0
        new_in_area = props_in_area.filter(created_at__date=yesterday).count()

        total_props = Property.objects.filter(area=area).count()
        rented = Property.objects.filter(area=area, is_available=False).count()
        occupancy = (rented / total_props * 100) if total_props > 0 else 0

        MarketAnalytics.objects.update_or_create(
            area=area,
            date=yesterday,
            defaults={
                'average_rent': avg_rent,
                'average_sale_price': avg_sale,
                'occupancy_rate': occupancy,
                'new_listings': new_in_area,
            },
        )

    logger.info('Daily analytics aggregation completed for %s', yesterday)


@shared_task(ignore_result=True)
def update_property_view_counts():
    """Reset monthly view counts on the 1st of each month."""
    from .models import PropertyAnalytics

    today = timezone.now().date()
    if today.day == 1:
        PropertyAnalytics.objects.all().update(
            this_month_views=0,
            this_month_inquiries=0,
        )
        logger.info('Monthly property view/inquiry counts reset')
