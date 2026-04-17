from urllib.parse import urljoin

from django.conf import settings


def _absolute_media_url(url):
    if not url:
        return None

    if str(url).startswith('http'):
        return str(url)

    base_url = getattr(settings, 'MEDIA_PUBLIC_BASE_URL', '') or getattr(settings, 'PUBLIC_API_ORIGIN', '')
    if not base_url:
        return str(url)

    return urljoin(f"{base_url.rstrip('/')}/", str(url).lstrip('/'))


def _collect_amenities(property_obj):
    amenities = []

    flags = [
        ('parking', property_obj.has_parking),
        ('security', property_obj.has_security),
        ('pool', property_obj.has_pool),
        ('gym', property_obj.has_gym),
        ('elevator', property_obj.has_elevator),
        ('air_conditioning', property_obj.has_ac_preinstalled),
        ('hot_water', property_obj.has_hot_water),
        ('generator', property_obj.has_generator),
    ]

    for amenity, enabled in flags:
        if enabled:
            amenities.append(amenity)

    return amenities


def build_property_search_document(property_obj):
    primary_image = property_obj.images.filter(is_primary=True).first() or property_obj.images.first()
    latitude = property_obj.effective_latitude
    longitude = property_obj.effective_longitude

    agent_first_name = getattr(property_obj.agent.user, 'first_name', '')
    agent_last_name = getattr(property_obj.agent.user, 'last_name', '')
    agent_name = ' '.join(part for part in [agent_first_name, agent_last_name] if part).strip()

    search_text_parts = [
        property_obj.title,
        property_obj.description,
        property_obj.property_type.name if property_obj.property_type else '',
        property_obj.area.name if property_obj.area else '',
        property_obj.area.city.name if property_obj.area and property_obj.area.city else '',
        property_obj.area.city.region.name
        if property_obj.area and property_obj.area.city and property_obj.area.city.region
        else '',
        agent_name,
        getattr(property_obj.agent, 'agency_name', ''),
    ]

    return {
        'id': property_obj.id,
        'slug': property_obj.slug,
        'title': property_obj.title,
        'description': property_obj.description,
        'search_text': ' '.join(part.strip() for part in search_text_parts if part),
        'listing_type': property_obj.listing_type,
        'status': property_obj.status.name,
        'is_active': property_obj.is_active,
        'is_verified': property_obj.is_verified,
        'featured': property_obj.featured,
        'price': float(property_obj.price),
        'currency': property_obj.currency,
        'bedrooms': property_obj.no_of_bedrooms,
        'bathrooms': property_obj.no_of_bathrooms,
        'living_rooms': property_obj.no_of_living_rooms,
        'property_type': {
            'id': property_obj.property_type_id,
            'name': property_obj.property_type.name,
            'category': property_obj.property_type.category,
        },
        'location': {
            'area': property_obj.area.name,
            'city': property_obj.area.city.name,
            'region': property_obj.area.city.region.name,
            'latitude': float(latitude) if latitude is not None else None,
            'longitude': float(longitude) if longitude is not None else None,
        },
        'agent': {
            'id': property_obj.agent_id,
            'name': agent_name or property_obj.agent.user.email,
            'agency_name': getattr(property_obj.agent, 'agency_name', ''),
            'is_verified': getattr(property_obj.agent, 'is_verified', False),
        },
        'amenities': _collect_amenities(property_obj),
        'primary_image_url': _absolute_media_url(primary_image.image.url) if primary_image and primary_image.image else None,
        'image_count': property_obj.images.count(),
        'views_count': property_obj.views_count,
        'created_at': property_obj.created_at.isoformat(),
        'updated_at': property_obj.updated_at.isoformat(),
    }