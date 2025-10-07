"""
Authentication Serializers
Secure serialization for authentication operations
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import re

User = get_user_model()


class SignupSerializer(serializers.Serializer):
    """Simplified signup serializer"""

    full_name = serializers.CharField(max_length=200, required=True)
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(max_length=13, required=True)
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(choices=['tenant', 'agent'], required=True)
    terms_accepted = serializers.BooleanField(required=True)

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered")
        return value.lower()

    def validate_username(self, value):
        """Validate username"""
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken")

        # Username format validation
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")

        return value

    def validate_phone_number(self, value):
        """Validate phone number format"""
        # Cameroon format: +237XXXXXXXXX
        pattern = r'^\+237[6-9]\d{8}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid phone number. Use format: +237XXXXXXXXX")

        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already registered")

        return value

    def validate_terms_accepted(self, value):
        """Ensure terms are accepted"""
        if not value:
            raise serializers.ValidationError("You must accept the terms and conditions")
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})

        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs


class LoginSerializer(serializers.Serializer):
    """Simple login serializer"""

    identifier = serializers.CharField(
        required=True,
        help_text="Username, email, or phone number"
    )
    password = serializers.CharField(write_only=True, required=True)
    remember_me = serializers.BooleanField(default=False, required=False)


class OTPRequestSerializer(serializers.Serializer):
    """Request OTP serializer"""

    recipient = serializers.CharField(required=True, help_text="Phone number or email")
    otp_type = serializers.ChoiceField(choices=['phone', 'email'], required=True)
    purpose = serializers.ChoiceField(
        choices=['signup', 'login', 'password_reset', 'phone_change'],
        required=True
    )

    def validate_recipient(self, value):
        """Validate recipient format"""
        otp_type = self.initial_data.get('otp_type')

        if otp_type == 'phone':
            # Validate phone format
            pattern = r'^\+237[6-9]\d{8}$'
            if not re.match(pattern, value):
                raise serializers.ValidationError("Invalid phone number format")
        elif otp_type == 'email':
            # Validate email format
            from django.core.validators import validate_email as django_validate_email
            try:
                django_validate_email(value)
            except ValidationError:
                raise serializers.ValidationError("Invalid email format")

        return value


class OTPVerifySerializer(serializers.Serializer):
    """Verify OTP serializer"""

    recipient = serializers.CharField(required=True)
    otp_code = serializers.CharField(required=True, min_length=6, max_length=6)
    purpose = serializers.CharField(required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Request password reset serializer"""

    identifier = serializers.CharField(
        required=True,
        help_text="Email or phone number"
    )


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Confirm password reset serializer"""

    token = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, min_length=8, required=True)
    new_password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        """Validate passwords match"""
        password = attrs.get('new_password')
        password_confirm = attrs.get('new_password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError({"new_password_confirm": "Passwords do not match"})

        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return attrs


class UserSerializer(serializers.ModelSerializer):
    """User profile serializer"""

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'phone_number',
            'user_type',
            'is_phone_verified',
            'is_email_verified',
            'is_kyc_verified',
            'profile_picture',
            'date_joined'
        ]
        read_only_fields = [
            'id',
            'is_phone_verified',
            'is_email_verified',
            'is_kyc_verified',
            'date_joined'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
