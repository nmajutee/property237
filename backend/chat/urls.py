from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    # Conversations
    path('conversations/', views.ConversationListCreateAPIView.as_view(), name='conversation-list'),
    path('conversations/create/', views.create_conversation, name='conversation-create'),
    path('conversations/<str:conversation_id>/', views.ConversationDetailAPIView.as_view(), name='conversation-detail'),
    path('conversations/<str:conversation_id>/archive/', views.archive_conversation, name='conversation-archive'),

    # Messages
    path('conversations/<str:conversation_id>/messages/', views.MessageListCreateAPIView.as_view(), name='message-list-create'),
    path('conversations/<str:conversation_id>/read/', views.mark_messages_read, name='mark-read'),

    # Message actions
    path('messages/<int:message_id>/edit/', views.edit_message, name='message-edit'),
    path('messages/<int:message_id>/delete/', views.delete_message, name='message-delete'),

    # Utilities
    path('quick-actions/', views.QuickActionListAPIView.as_view(), name='quick-actions'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('conversations/<str:conversation_id>/poll/', views.poll_messages, name='poll-messages'),
]
