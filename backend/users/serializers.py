"""
Enterprise User Serializers
Secure serialization for authentication and user management
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings
from locations.serializers import CitySerializer
from .models import CustomUser, UserPreferences
import re

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Secure user registration with validation"""

    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    terms_accepted = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'full_legal_name',
            'display_name', 'date_of_birth', 'language', 'country_code',
            'user_type', 'phone_number', 'password', 'password_confirm', 'terms_accepted'
        ]

    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_phone_number(self, value):
        """Validate phone number format (Cameroon format)"""
        if value:
            # Cameroon phone number pattern: +237XXXXXXXXX or 6XXXXXXXX
            pattern = r'^(\+237)?[6-9]\d{8}$'
            if not re.match(pattern, value.replace(' ', '').replace('-', '')):
                raise serializers.ValidationError(
                    "Invalid phone number format. Use Cameroon format: +237XXXXXXXXX"
                )
        return value

    def validate_user_type(self, value):
        """Validate user type"""
        valid_types = ['tenant', 'agent', 'admin']
        if value not in valid_types:
            raise serializers.ValidationError(
                f"Invalid user type. Choose from: {', '.join(valid_types)}"
            )
        return value

    def validate_terms_accepted(self, value):
        """Ensure terms are accepted"""
        if not value:
            raise serializers.ValidationError("You must accept the terms and conditions.")
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match.")

        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        """Create user with secure password handling"""
        validated_data.pop('password_confirm')
        validated_data.pop('terms_accepted')

        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)

        # Set additional fields based on user type
        if user.user_type == 'realtor':
            user.is_staff = True  # Allow admin access for realtors

        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serialization"""

    full_name = serializers.CharField(source='get_full_name', read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone_number', 'is_verified', 'profile_picture',
            'profile_picture_url', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'email', 'user_type', 'date_joined', 'last_login']

    def get_profile_picture_url(self, obj):
        """Get full URL for profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def validate_phone_number(self, value):
        """Validate phone number format"""
        if value:
            pattern = r'^(\+237)?[6-9]\d{8}$'
            if not re.match(pattern, value.replace(' ', '').replace('-', '')):
                raise serializers.ValidationError(
                    "Invalid phone number format. Use Cameroon format: +237XXXXXXXXX"
                )
        return value


class PublicUserSerializer(serializers.ModelSerializer):
    """Public user info (for listings, etc.)"""

    full_name = serializers.CharField(source='get_full_name', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'user_type', 'profile_picture_url']

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


# Legacy serializers for compatibility
class UserLoginSerializer(serializers.Serializer):
    """Legacy login serializer - use JWT auth instead"""
    email = serializers.EmailField()
    password = serializers.CharField()


# Validation utilities
def validate_cameroon_phone(phone_number):
    """Validate Cameroon phone number"""
    if not phone_number:
        return True

    # Remove spaces and dashes
    cleaned = phone_number.replace(' ', '').replace('-', '')

    # Cameroon mobile pattern: +237 followed by 6-9 and 8 digits
    pattern = r'^(\+237)?[6-9]\d{8}$'

    return bool(re.match(pattern, cleaned))

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)  # Many auth backends use username field for email too

            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')

            attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'phone_number', 'whatsapp_number', 'user_type', 'city',
            'profile_picture', 'is_phone_verified', 'is_email_verified',
            'is_kyc_verified', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'date_joined', 'is_phone_verified', 'is_email_verified', 'is_kyc_verified']


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = '__all__'