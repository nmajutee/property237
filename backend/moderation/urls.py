from django.urls import path
from . import views

app_name = 'moderation'

urlpatterns = [
    # User-facing
    path('reports/submit/', views.ReportCreateAPIView.as_view(), name='report-create'),
    path('reports/mine/', views.my_reports, name='my-reports'),

    # Admin: reports management
    path('reports/', views.report_list, name='report-list'),
    path('reports/<int:pk>/', views.report_detail, name='report-detail'),
    path('reports/<int:pk>/resolve/', views.resolve_report, name='report-resolve'),
    path('reports/<int:pk>/dismiss/', views.dismiss_report, name='report-dismiss'),

    # Admin: audit log
    path('log/', views.moderation_log, name='moderation-log'),

    # Admin: listing checks
    path('checks/<int:property_id>/', views.listing_checks, name='listing-checks'),
    path('duplicates/', views.check_duplicates, name='check-duplicates'),
]
