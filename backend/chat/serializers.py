from rest_framework import serializers
from .models import Conversation, Message, MessageReadStatus, QuickAction, ChatModeration, TypingIndicator
from users.serializers import UserProfileSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'message_type', 'content',
            'attachment', 'attachment_filename', 'is_read', 'is_edited',
            'is_deleted', 'quick_actions', 'sent_at', 'edited_at'
        ]
        read_only_fields = ['id', 'sender', 'sent_at', 'edited_at', 'is_read', 'is_edited', 'is_deleted']


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['conversation', 'message_type', 'content', 'attachment']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        if validated_data.get('attachment'):
            validated_data['attachment_filename'] = validated_data['attachment'].name
        return super().create(validated_data)


class ConversationListSerializer(serializers.ModelSerializer):
    participants = UserProfileSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'conversation_id', 'conversation_type', 'participants',
            'property', 'is_active', 'is_archived', 'created_at',
            'updated_at', 'last_message_at', 'last_message', 'unread_count'
        ]

    def get_last_message(self, obj):
        msg = obj.messages.filter(is_deleted=False).order_by('-sent_at').first()
        if msg:
            return {
                'id': msg.id,
                'content': msg.content,
                'sender_id': msg.sender_id,
                'message_type': msg.message_type,
                'sent_at': msg.sent_at.isoformat(),
            }
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request')
        if user and hasattr(user, 'user'):
            return obj.messages.filter(is_read=False).exclude(sender=user.user).count()
        return 0


class ConversationDetailSerializer(serializers.ModelSerializer):
    participants = UserProfileSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'conversation_id', 'conversation_type', 'participants',
            'property', 'escrow', 'is_active', 'is_archived',
            'created_at', 'updated_at', 'last_message_at', 'messages'
        ]


class ConversationCreateSerializer(serializers.Serializer):
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(), min_length=1
    )
    conversation_type = serializers.ChoiceField(
        choices=Conversation.CONVERSATION_TYPES, default='property_inquiry'
    )
    property_id = serializers.IntegerField(required=False, allow_null=True)
    initial_message = serializers.CharField(required=False, allow_blank=True)


class MessageReadStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageReadStatus
        fields = ['id', 'message', 'user', 'read_at']
        read_only_fields = ['id', 'read_at']


class QuickActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickAction
        fields = ['id', 'action_type', 'label', 'description', 'is_active']


class ChatModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatModeration
        fields = '__all__'
        read_only_fields = ['id', 'moderator', 'created_at']


class TypingIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypingIndicator
        fields = ['id', 'conversation', 'user', 'started_at']
        read_only_fields = ['id', 'started_at']
