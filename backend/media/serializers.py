from rest_framework import serializers
from .models import MediaFile
from utils.validators import validate_file_upload


class MediaFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = [
            'id', 'file', 'file_url', 'file_type', 'title', 'description',
            'order', 'is_featured', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def validate_file(self, value):
        file_type = self.initial_data.get('file_type', 'image')
        validate_file_upload(value, file_type=file_type)
        return value