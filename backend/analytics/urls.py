"""
Analytics URLs configuration
"""
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('agent/dashboard/', views.agent_dashboard_stats, name='agent-dashboard'),
    path('tenant/dashboard/', views.tenant_dashboard_stats, name='tenant-dashboard'),
    path('property/<int:property_id>/', views.property_stats, name='property-stats'),
]