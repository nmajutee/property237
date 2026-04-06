"""
Analytics URLs configuration
"""
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('agent/dashboard/', views.agent_dashboard_stats, name='agent-dashboard'),
    path('agent/analytics/', views.agent_analytics_summary, name='agent-analytics'),
    path('tenant/dashboard/', views.tenant_dashboard_stats, name='tenant-dashboard'),
    path('admin/dashboard/', views.admin_dashboard_stats, name='admin-dashboard'),
    path('property/<int:property_id>/', views.property_stats, name='property-stats'),
    path('property/<int:property_id>/inquiry/', views.record_inquiry, name='record-inquiry'),
    path('property/<int:property_id>/views/', views.property_view_timeline, name='view-timeline'),
    path('property/<int:property_id>/inquiries/', views.property_inquiry_timeline, name='inquiry-timeline'),
]