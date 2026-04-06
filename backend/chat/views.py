from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import models
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q
from .models import Conversation, Message, MessageReadStatus, QuickAction
from .serializers import (
    ConversationListSerializer, ConversationDetailSerializer,
    ConversationCreateSerializer, MessageSerializer, MessageCreateSerializer,
    QuickActionSerializer
)

User = get_user_model()


class ConversationListCreateAPIView(generics.ListAPIView):
    """List conversations for the authenticated user"""
    serializer_class = ConversationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Conversation.objects.filter(
            participants=self.request.user, is_archived=False
        ).select_related('property').prefetch_related(
            'participants',
            models.Prefetch(
                'messages',
                queryset=Message.objects.select_related('sender').order_by('-sent_at'),
            ),
        ).order_by('-last_message_at')

        conv_type = self.request.query_params.get('type')
        if conv_type:
            qs = qs.filter(conversation_type=conv_type)
        return qs


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    """Create a new conversation"""
    serializer = ConversationCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    participant_ids = data['participant_ids']
    # Ensure current user is included
    if request.user.id not in participant_ids:
        participant_ids.append(request.user.id)

    participants = User.objects.filter(id__in=participant_ids)
    if participants.count() < 2:
        return Response({'error': 'At least 2 participants required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check for existing 1-on-1 conversation with same participants and property
    if len(participant_ids) == 2:
        prop_id = data.get('property_id')
        existing = Conversation.objects.filter(
            conversation_type=data['conversation_type'],
            is_active=True,
        ).filter(participants=participant_ids[0]).filter(participants=participant_ids[1])
        if prop_id:
            existing = existing.filter(property_id=prop_id)
        existing = existing.first()
        if existing:
            return Response(
                ConversationDetailSerializer(existing, context={'request': request}).data,
                status=status.HTTP_200_OK
            )

    conversation = Conversation.objects.create(
        conversation_type=data['conversation_type'],
        property_id=data.get('property_id'),
    )
    conversation.participants.set(participants)

    # Send initial message if provided
    initial_msg = data.get('initial_message', '').strip()
    if initial_msg:
        Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=initial_msg,
        )
        conversation.last_message_at = timezone.now()
        conversation.save(update_fields=['last_message_at'])

    return Response(
        ConversationDetailSerializer(conversation, context={'request': request}).data,
        status=status.HTTP_201_CREATED
    )


class ConversationDetailAPIView(generics.RetrieveAPIView):
    """Get conversation detail with messages"""
    serializer_class = ConversationDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'conversation_id'

    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).prefetch_related('participants', 'messages__sender')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def archive_conversation(request, conversation_id):
    """Archive a conversation"""
    conv = get_object_or_404(Conversation, conversation_id=conversation_id, participants=request.user)
    conv.is_archived = True
    conv.save(update_fields=['is_archived'])
    return Response({'message': 'Conversation archived'})


class MessageListCreateAPIView(generics.ListCreateAPIView):
    """List and send messages in a conversation"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        conv = get_object_or_404(
            Conversation, conversation_id=conversation_id, participants=self.request.user
        )
        return Message.objects.filter(
            conversation=conv, is_deleted=False
        ).select_related('sender').order_by('sent_at')

    def perform_create(self, serializer):
        conversation_id = self.kwargs['conversation_id']
        conv = get_object_or_404(
            Conversation, conversation_id=conversation_id, participants=self.request.user
        )
        msg = serializer.save(sender=self.request.user, conversation=conv)
        conv.last_message_at = timezone.now()
        conv.save(update_fields=['last_message_at'])
        # Notify other participants asynchronously
        try:
            from notifications.tasks import notify_new_message
            notify_new_message.delay(msg.id)
        except Exception:
            pass

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_messages_read(request, conversation_id):
    """Mark all messages in a conversation as read for current user"""
    conv = get_object_or_404(Conversation, conversation_id=conversation_id, participants=request.user)
    updated = Message.objects.filter(
        conversation=conv, is_read=False
    ).exclude(sender=request.user).update(is_read=True)

    # Also update MessageReadStatus entries
    unread_msgs = Message.objects.filter(
        conversation=conv
    ).exclude(sender=request.user)
    for msg in unread_msgs:
        MessageReadStatus.objects.update_or_create(
            message=msg, user=request.user,
            defaults={'read_at': timezone.now()}
        )

    return Response({'marked_read': updated})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_message(request, message_id):
    """Edit a message"""
    msg = get_object_or_404(Message, id=message_id, sender=request.user)
    content = request.data.get('content')
    if not content:
        return Response({'error': 'Content required'}, status=status.HTTP_400_BAD_REQUEST)
    msg.content = content
    msg.is_edited = True
    msg.edited_at = timezone.now()
    msg.save(update_fields=['content', 'is_edited', 'edited_at'])
    return Response(MessageSerializer(msg, context={'request': request}).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    """Soft-delete a message"""
    msg = get_object_or_404(Message, id=message_id, sender=request.user)
    msg.is_deleted = True
    msg.deleted_at = timezone.now()
    msg.save(update_fields=['is_deleted', 'deleted_at'])
    return Response({'message': 'Message deleted'})


class QuickActionListAPIView(generics.ListAPIView):
    """List available quick actions"""
    serializer_class = QuickActionSerializer
    permission_classes = [IsAuthenticated]
    queryset = QuickAction.objects.filter(is_active=True)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """Get total unread message count for current user"""
    count = Message.objects.filter(
        conversation__participants=request.user,
        is_read=False,
        is_deleted=False,
    ).exclude(sender=request.user).count()
    return Response({'unread_count': count})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def poll_messages(request, conversation_id):
    """Poll for new messages since a given timestamp (fallback for WebSocket)."""
    conv = get_object_or_404(
        Conversation, conversation_id=conversation_id, participants=request.user
    )
    since = request.query_params.get('since')
    if not since:
        return Response(
            {'error': 'since query parameter required (ISO 8601 timestamp)'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        from django.utils.dateparse import parse_datetime
        since_dt = parse_datetime(since)
        if since_dt is None:
            raise ValueError()
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid timestamp format. Use ISO 8601.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    messages = Message.objects.filter(
        conversation=conv,
        is_deleted=False,
        sent_at__gt=since_dt,
    ).select_related('sender').order_by('sent_at')

    return Response({
        'messages': MessageSerializer(messages, many=True, context={'request': request}).data,
        'poll_interval': 5000,  # recommended client poll interval in ms
        'server_time': timezone.now().isoformat(),
    })
