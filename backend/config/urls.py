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
]

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # API v1 (current)
    path('api/', include(api_v1_patterns)),

    # Health check endpoint
    path('health/', lambda request: HttpResponse('OK')),
]

# Import HttpResponse for health check
from django.http import HttpResponse

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)