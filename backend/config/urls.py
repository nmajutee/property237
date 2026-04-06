"""
URL configuration for config project.
Enterprise API routing with versioning
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET

# API Version 1 - Enterprise Architecture
api_v1_patterns = [
    # Authentication (New simplified system with OTP)
    path('auth/', include('authentication.urls')),

    # Credit Management System
    path('credits/', include('credits.urls')),

    # Core Services (Microservice-ready)
    path('users/', include('users.urls')),
    path('properties/', include('properties.urls')),
    path('tenants/', include('tenants.urls')),
    path('applications/', include('tenants.urls')),  # Alias for tenant applications
    path('leases/', include('leases.urls')),
    path('maintenance/', include('maintenance.urls')),
    path('payments/', include('payment.urls')),
    path('locations/', include('locations.urls')),
    path('agents/', include('agents.urls')),  # Updated to use new agents app
    path('media/', include('media.urls')),
    path('chat/', include('chat.urls')),
    path('analytics/', include('analytics.urls')),
    path('notifications/', include('notifications.urls')),
    path('ads/', include('ad.urls')),
    path('tariffs/', include('tariffplans.urls')),
    path('moderation/', include('moderation.urls')),
]


@require_GET
def health_check(request):
    """Comprehensive health check: DB, Redis, Celery."""
    checks = {}

    # Database check
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        checks['database'] = 'ok'
    except Exception as e:
        checks['database'] = f'error: {e}'

    # Redis check
    try:
        from django.core.cache import cache
        cache.set('_health', '1', 5)
        val = cache.get('_health')
        checks['cache'] = 'ok' if val == '1' else 'error: value mismatch'
    except Exception:
        checks['cache'] = 'unavailable'

    overall = 'ok' if checks.get('database') == 'ok' else 'degraded'
    status_code = 200 if overall == 'ok' else 503
    return JsonResponse({'status': overall, 'checks': checks}, status=status_code)


@require_GET
def celery_health_check(request):
    """Check Celery worker availability."""
    try:
        from config.celery import app
        inspector = app.control.inspect(timeout=2.0)
        active = inspector.active()
        if active is None:
            return JsonResponse({'status': 'error', 'detail': 'No workers responding'}, status=503)
        return JsonResponse({
            'status': 'ok',
            'workers': list(active.keys()),
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'detail': str(e)}, status=503)


urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # API v1 (current)
    path('api/', include(api_v1_patterns)),

    # Health check endpoint
    path('health/', health_check),
    path('health/celery/', celery_health_check),
]

from django.views.static import serve
import re

# Serve media files in all environments (including production)
# Media files are stored locally on Render's persistent disk
# WhiteNoise only serves static files, so we need explicit media serving
if settings.DEBUG:
    # Development: Use Django's static file serving
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # Production: Serve media files with Django's serve view
    # This is necessary because WhiteNoise doesn't handle media files
    urlpatterns += [
        path('media/<path:path>', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]