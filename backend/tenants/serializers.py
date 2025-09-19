from rest_framework import serializers
from .models import TenantProfile, TenantDocument
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


class TenantProfileSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all(), write_only=True)
    documents = TenantDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = TenantProfile
        fields = [
            'id', 'user', 'user_id',
            # Property preferences from frontend
            'preferred_location', 'budget_min', 'budget_max', 'property_category',
            'property_type', 'land_type', 'preferred_amenities',
            # Agreement and verification from frontend
            'lease_agreement_acceptance', 'government_id_upload', 'verification_status',
            # Document uploads
            'id_document_front', 'id_document_back', 'taxpayer_card',
            # Existing fields
            'employer_name', 'monthly_income_range', 'emergency_contact_name',
            'emergency_contact_phone', 'documents', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'documents', 'user']


class TenantRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantProfile
        fields = [
            # Property preferences from frontend
            'preferred_location', 'budget_min', 'budget_max', 'property_category',
            'property_type', 'land_type', 'preferred_amenities',
            # Agreement and verification from frontend
            'lease_agreement_acceptance', 'government_id_upload', 'verification_status',
            # Document uploads
            'id_document_front', 'id_document_back', 'taxpayer_card',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


# Legacy serializer for backward compatibility
class TenantSerializer(TenantProfileSerializer):
    class Meta(TenantProfileSerializer.Meta):
        pass
