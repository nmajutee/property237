from rest_framework import serializers
from .models import Notification, NotificationPreference, NotificationTemplate, BulkNotification


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = ['id', 'name', 'template_type', 'language', 'subject_template', 'message_template', 'is_active']


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    content_type_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'subject', 'message', 'status',
            'priority', 'sender', 'sender_name', 'extra_data',
            'content_type_name', 'object_id',
            'scheduled_at', 'sent_at', 'read_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at']

    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.full_name
        return 'System'

    def get_content_type_name(self, obj):
        if obj.content_type:
            return obj.content_type.model
        return None


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['recipient', 'notification_type', 'subject', 'message', 'priority', 'extra_data']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        validated_data['status'] = 'sent'
        return super().create(validated_data)


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        exclude = ['id', 'user', 'created_at', 'updated_at']


class BulkNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkNotification
        fields = [
            'id', 'name', 'template', 'status', 'scheduled_at',
            'total_recipients', 'sent_count', 'failed_count',
            'created_at', 'started_at', 'completed_at'
        ]
        read_only_fields = ['id', 'sent_count', 'failed_count', 'created_at', 'started_at', 'completed_at']
