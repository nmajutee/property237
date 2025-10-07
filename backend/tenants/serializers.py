from rest_framework import serializers
from .models import TenantProfile, TenantDocument, TenantApplication
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


# Application Serializers
class TenantApplicationSerializer(serializers.ModelSerializer):
    """Serializer for tenant applications"""
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_location = serializers.SerializerMethodField()
    property_price = serializers.DecimalField(source='property.price', max_digits=10, decimal_places=2, read_only=True)
    property_image = serializers.SerializerMethodField()
    property_id = serializers.IntegerField(write_only=True, required=True)
    tenant_name = serializers.CharField(source='tenant.user.get_full_name', read_only=True)
    tenant_email = serializers.EmailField(source='tenant.user.email', read_only=True)

    class Meta:
        model = TenantApplication
        fields = [
            'id', 'tenant', 'tenant_name', 'tenant_email', 'property_id',
            'property_title', 'property_location', 'property_price', 'property_image',
            'status', 'desired_move_in_date', 'lease_duration_months', 'offered_rent',
            'additional_occupants', 'special_requests', 'cover_letter',
            'review_notes', 'review_date', 'created_at', 'updated_at', 'submitted_at'
        ]
        read_only_fields = ['id', 'tenant', 'tenant_name', 'tenant_email', 'status',
                           'review_notes', 'review_date', 'created_at', 'updated_at',
                           'submitted_at', 'property_title', 'property_location',
                           'property_price', 'property_image']

    def get_property_location(self, obj):
        if obj.property.area:
            return f"{obj.property.area.name}, {obj.property.area.city.name}"
        return "Location not specified"

    def get_property_image(self, obj):
        # Get first image from property media files
        first_media = obj.property.media_files.first()
        if first_media:
            return first_media.file.url
        return None

    def create(self, validated_data):
        # Get tenant from request user
        user = self.context['request'].user
        tenant = user.tenant_profile
        validated_data['tenant'] = tenant

        # Get property from property_id
        property_id = validated_data.pop('property_id')
        from properties.models import Property
        property_obj = Property.objects.get(id=property_id)
        validated_data['property'] = property_obj

        # Set status to submitted
        validated_data['status'] = 'submitted'

        return super().create(validated_data)
