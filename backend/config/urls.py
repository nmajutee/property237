"""
URL configuration for config project.
Enterprise API routing with versioning
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# API Version 1 - Enterprise Architecture
api_v1_patterns = [
    # Authentication (JWT-based)
    path('auth/', include('users.auth_urls')),

    # Core Services (Microservice-ready)
    path('users/', include('users.urls')),
    path('properties/', include('properties.urls')),
    path('listings/', include('properties.urls')),  # Alias for listings service
    path('tenants/', include('tenants.urls')),
    path('leases/', include('leases.urls')),
    path('maintenance/', include('maintenance.urls')),
    path('payments/', include('payment.urls')),
    path('locations/', include('locations.urls')),
    path('agents/', include('agentprofile.urls')),
    path('media/', include('media.urls')),
    path('chat/', include('chat.urls')),
    path('analytics/', include('analytics.urls')),
    path('notifications/', include('notifications.urls')),
    path('ads/', include('ad.urls')),
    path('tariffs/', include('tariffplans.urls')),
]

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # API v1 (current)
    path('api/v1/', include(api_v1_patterns)),

    # Health check endpoint
    path('health/', lambda request: HttpResponse('OK')),

    # Legacy API support (temporary)
    path('api/', include(api_v1_patterns)),
]

# Import HttpResponse for health check
from django.http import HttpResponse

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)