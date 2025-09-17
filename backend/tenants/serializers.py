from rest_framework import serializers
from .models import Tenant, TenantDocument
from django.contrib.auth import get_user_model


User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'user_type']


class TenantDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantDocument
        fields = ['id', 'name', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class TenantSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all(), write_only=True)
    documents = TenantDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Tenant
        fields = [
            'id', 'user', 'user_id', 'employer_name', 'monthly_income', 'emergency_contact_name',
            'emergency_contact_phone', 'notes', 'documents', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'documents', 'user']
