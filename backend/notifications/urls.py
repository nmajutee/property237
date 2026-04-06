from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListAPIView.as_view(), name='notification-list'),
    path('send/', views.NotificationCreateAPIView.as_view(), name='notification-send'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('preferences/', views.NotificationPreferenceAPIView.as_view(), name='preferences'),
    path('templates/', views.NotificationTemplateListAPIView.as_view(), name='templates'),
    path('<int:pk>/read/', views.mark_notification_read, name='mark-read'),
    path('<int:pk>/delete/', views.delete_notification, name='delete'),
]