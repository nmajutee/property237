from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Report, ModerationAction, ListingAutoCheck


class ReportCreateSerializer(serializers.ModelSerializer):
    content_type_name = serializers.CharField(write_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'content_type_name', 'object_id', 'report_type',
            'description', 'evidence', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_content_type_name(self, value):
        mapping = {
            'property': ('properties', 'property'),
            'agent': ('agents', 'agentprofile'),
            'user': ('users', 'customuser'),
        }
        if value not in mapping:
            raise serializers.ValidationError(
                f"Invalid content type. Must be one of: {', '.join(mapping.keys())}"
            )
        app_label, model = mapping[value]
        try:
            return ContentType.objects.get(app_label=app_label, model=model)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Content type '{value}' not found.")

    def create(self, validated_data):
        ct = validated_data.pop('content_type_name')
        validated_data['content_type'] = ct
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)


class ReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.SerializerMethodField()
    reviewer_name = serializers.SerializerMethodField()
    target_type = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 'reporter', 'reporter_name', 'content_type', 'object_id',
            'target_type', 'report_type', 'description', 'evidence',
            'status', 'resolution', 'resolution_notes',
            'reviewed_by', 'reviewer_name', 'reviewed_at',
            'created_at', 'updated_at',
        ]

    def get_reporter_name(self, obj):
        return obj.reporter.full_name if hasattr(obj.reporter, 'full_name') else str(obj.reporter)

    def get_reviewer_name(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.full_name if hasattr(obj.reviewed_by, 'full_name') else str(obj.reviewed_by)
        return None

    def get_target_type(self, obj):
        return obj.content_type.model


class ModerationActionSerializer(serializers.ModelSerializer):
    moderator_name = serializers.SerializerMethodField()
    target_type = serializers.SerializerMethodField()

    class Meta:
        model = ModerationAction
        fields = [
            'id', 'moderator', 'moderator_name', 'action_type', 'reason',
            'content_type', 'object_id', 'target_type',
            'report', 'metadata', 'created_at',
        ]

    def get_moderator_name(self, obj):
        return obj.moderator.full_name if hasattr(obj.moderator, 'full_name') else str(obj.moderator)

    def get_target_type(self, obj):
        return obj.content_type.model


class ListingAutoCheckSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = ListingAutoCheck
        fields = [
            'id', 'property', 'property_title', 'check_type', 'severity',
            'details', 'is_resolved', 'resolved_by', 'created_at',
        ]
