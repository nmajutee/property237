from rest_framework import serializers
from .models import AgentProfile, AgentCertification, AgentReview, AgentDocument, AgentMobileMoney, AgentAddress
from users.serializers import UserProfileSerializer
from locations.serializers import AreaSerializer


class AgentProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    service_areas = AreaSerializer(many=True, read_only=True)

    class Meta:
        model = AgentProfile
        fields = [
            'id', 'user',
            # Address fields
            'street', 'city', 'region', 'postal_code', 'country', 'residence_proof',
            # KYC fields
            'id_type', 'id_number', 'id_document', 'address_verification', 'taxpayer_card', 'selfie_document',
            # Mobile Money fields
            'mobile_money_provider', 'mobile_money_phone', 'mobile_money_account_name',
            'name_match_status', 'is_mobile_money_verified',
            # Consent fields
            'terms_accepted', 'data_consent_accepted', 'marketing_consent',
            # Professional fields
            'license_number', 'agency_name', 'years_experience',
            'specialization', 'bio', 'service_areas', 'is_verified', 'is_featured',
            'total_sales', 'total_rentals', 'client_rating', 'total_reviews'
        ]


class AgentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            # Address fields
            'street', 'city', 'region', 'postal_code', 'country', 'residence_proof',
            # KYC fields
            'id_type', 'id_number', 'id_document', 'address_verification', 'taxpayer_card', 'selfie_document',
            # Mobile Money fields
            'mobile_money_provider', 'mobile_money_phone', 'mobile_money_account_name',
            'name_match_status', 'is_mobile_money_verified',
            # Consent fields
            'terms_accepted', 'data_consent_accepted', 'marketing_consent',
            # Professional fields
            'license_number', 'license_expiry', 'agency_name', 'agency_address',
            'years_experience', 'specialization', 'office_phone', 'website',
            'bio', 'languages_spoken'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class AgentCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentCertification
        fields = '__all__'


class AgentReviewSerializer(serializers.ModelSerializer):
    reviewer = UserProfileSerializer(read_only=True)

    class Meta:
        model = AgentReview
        fields = '__all__'
        read_only_fields = ['reviewer', 'created_at', 'updated_at']


class AgentAddressSerializer(serializers.ModelSerializer):
    """Serializer for agent address information"""
    class Meta:
        model = AgentAddress
        exclude = ['agent', 'created_at', 'updated_at']


class AgentDocumentSerializer(serializers.ModelSerializer):
    """Serializer for agent documents"""
    class Meta:
        model = AgentDocument
        exclude = ['agent', 'verified_by', 'uploaded_at', 'updated_at']
        read_only_fields = ['is_verified', 'verified_at', 'verification_notes',
                          'file_size', 'mime_type', 'original_filename']


class AgentMobileMoneySerializer(serializers.ModelSerializer):
    """Serializer for mobile money information"""
    class Meta:
        model = AgentMobileMoney
        exclude = ['agent', 'verification_code', 'created_at', 'updated_at']
        read_only_fields = ['is_verified', 'verified_at', 'name_match_status']


class AgentOnboardingDataSerializer(serializers.Serializer):
    """
    Simplified serializer for agent onboarding (no company info required)
    Matches the simplified frontend structure
    """
    # Personal Info (handled by User model)
    personal_info = serializers.DictField(required=True)

    # Address Information
    address = AgentAddressSerializer(required=True)

    # KYC/Document Information
    kyc_documents = AgentDocumentSerializer(many=True, required=False)

    # Mobile Money Information
    mobile_money = AgentMobileMoneySerializer(required=False, allow_null=True)

    # Verification Info
    verification = serializers.DictField(required=True)

    def validate_personal_info(self, value):
        """Validate personal info structure"""
        required_fields = ['fullLegalName', 'displayName', 'email', 'phone', 'dateOfBirth', 'language']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value

    def validate_verification(self, value):
        """Validate verification structure"""
        required_fields = ['termsAccepted', 'dataConsentAccepted']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")

        if not value.get('termsAccepted', False):
            raise serializers.ValidationError("Terms and conditions must be accepted")
        if not value.get('dataConsentAccepted', False):
            raise serializers.ValidationError("Data processing consent must be given")

        return value

    def create(self, validated_data):
        """
        Create agent profile with all related data
        This handles the complete onboarding process
        """
        from django.contrib.auth import get_user_model
        from django.db import transaction

        User = get_user_model()

        with transaction.atomic():
            # Extract data
            personal_info = validated_data.pop('personal_info')
            address_data = validated_data.pop('address')
            mobile_money_data = validated_data.pop('mobile_money', None)
            kyc_documents = validated_data.pop('kyc_documents', [])
            verification = validated_data.pop('verification')

            # Create or get user
            user_data = {
                'first_name': personal_info.get('fullLegalName', '').split()[0],
                'last_name': ' '.join(personal_info.get('fullLegalName', '').split()[1:]),
                'email': personal_info['email'],
                'phone_number': personal_info['phone'],
                'user_type': 'agent',
                'nickname': personal_info.get('displayName', ''),
            }

            # Create user if doesn't exist
            user, created = User.objects.get_or_create(
                email=personal_info['email'],
                defaults=user_data
            )

            if not created:
                # Update existing user
                for key, value in user_data.items():
                    setattr(user, key, value)
                user.save()

            # Create or get agent profile
            agent_profile, created = AgentProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': "Professional real estate agent.",
                    'is_verified': False,
                }
            )

            # Create address
            AgentAddress.objects.update_or_create(
                agent=agent_profile,
                defaults=address_data
            )

            # Create mobile money info if provided
            if mobile_money_data:
                AgentMobileMoney.objects.update_or_create(
                    agent=agent_profile,
                    defaults=mobile_money_data
                )

            # Handle documents (will be processed separately via file upload endpoints)
            # This is just the structure - actual file handling done via separate endpoints

            return {
                'agent_profile': agent_profile,
                'user': user,
                'address': agent_profile.address,
                'mobile_money': agent_profile.mobile_money if hasattr(agent_profile, 'mobile_money') else None,
            }


class EnhancedAgentProfileSerializer(serializers.ModelSerializer):
    """
    Enhanced agent profile serializer with all related data
    """
    user = UserProfileSerializer(read_only=True)
    service_areas = AreaSerializer(many=True, read_only=True)
    address = AgentAddressSerializer(read_only=True)
    mobile_money = AgentMobileMoneySerializer(read_only=True)
    documents = AgentDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = AgentProfile
        fields = [
            'id', 'user', 'license_number', 'license_expiry', 'agency_name', 'agency_address',
            'years_experience', 'specialization', 'office_phone', 'website',
            'linkedin_profile', 'facebook_profile', 'instagram_profile',
            'bio', 'languages_spoken', 'service_areas', 'is_verified', 'is_featured',
            'is_active', 'total_sales', 'total_rentals', 'client_rating', 'total_reviews',
            'address', 'mobile_money', 'documents', 'created_at', 'updated_at'
        ]