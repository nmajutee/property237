"""
Authentication Services
Business logic for authentication operations
"""
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import secrets
import hashlib
from .models import OTPVerification, LoginAttempt, PasswordResetToken

User = get_user_model()


class AuthService:
    """Service class for authentication operations"""

    @staticmethod
    @transaction.atomic
    def signup_user(validated_data):
        """
        Create new user account
        Returns: (success: bool, user: User, message: str)
        """
        try:
            # Extract name parts
            full_name = validated_data.pop('full_name')
            name_parts = full_name.strip().split(maxsplit=1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            # Remove confirmation fields
            validated_data.pop('password_confirm')
            validated_data.pop('terms_accepted')

            # Extract password
            password = validated_data.pop('password')

            # Create user
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                password=password,
                **validated_data
            )

            return True, user, "Account created successfully"

        except Exception as e:
            return False, None, f"Signup failed: {str(e)}"

    @staticmethod
    def login_user(identifier, password, ip_address=None, user_agent=None):
        """
        Authenticate user with identifier (username/email/phone) and password
        Returns: (success: bool, user: User, message: str)
        """
        # Check if locked out
        is_locked, unlock_time = LoginAttempt.is_locked_out(identifier, ip_address)
        if is_locked:
            minutes = int((unlock_time - timezone.now()).total_seconds() / 60)
            return False, None, f"Account locked. Try again in {minutes} minutes"

        # Find user by identifier
        user = None
        try:
            # Try email
            if '@' in identifier:
                user = User.objects.get(email__iexact=identifier)
            # Try phone
            elif identifier.startswith('+'):
                user = User.objects.get(phone_number=identifier)
            # Try username
            else:
                user = User.objects.get(username__iexact=identifier)
        except User.DoesNotExist:
            # Record failed attempt
            LoginAttempt.objects.create(
                identifier=identifier,
                ip_address=ip_address,
                user_agent=user_agent or '',
                success=False,
                failure_reason='User not found'
            )
            return False, None, "Invalid credentials"

        # Check if user is active
        if not user.is_active:
            LoginAttempt.objects.create(
                identifier=identifier,
                ip_address=ip_address,
                user_agent=user_agent or '',
                success=False,
                failure_reason='Account deactivated',
                user=user
            )
            return False, None, "Account is deactivated"

        # Check if suspended
        if user.is_suspended:
            LoginAttempt.objects.create(
                identifier=identifier,
                ip_address=ip_address,
                user_agent=user_agent or '',
                success=False,
                failure_reason='Account suspended',
                user=user
            )
            return False, None, "Account is suspended"

        # Verify password
        if not user.check_password(password):
            LoginAttempt.objects.create(
                identifier=identifier,
                ip_address=ip_address,
                user_agent=user_agent or '',
                success=False,
                failure_reason='Invalid password',
                user=user
            )
            return False, None, "Invalid credentials"

        # Success
        LoginAttempt.objects.create(
            identifier=identifier,
            ip_address=ip_address,
            user_agent=user_agent or '',
            success=True,
            user=user
        )

        # Update last login
        user.last_login = timezone.now()
        user.save()

        return True, user, "Login successful"


class OTPService:
    """Service class for OTP operations"""

    @staticmethod
    @transaction.atomic
    def request_otp(recipient, otp_type, purpose, user=None, ip_address=None, user_agent=None):
        """
        Generate and send OTP
        Returns: (success: bool, otp: OTPVerification, message: str)
        """
        try:
            # Invalidate any existing unverified OTPs for this recipient and purpose
            OTPVerification.objects.filter(
                recipient=recipient,
                otp_type=otp_type,
                purpose=purpose,
                is_verified=False
            ).update(is_verified=True)  # Mark as used instead of deleting

            # Generate OTP code
            otp_code = OTPVerification.generate_otp()

            # Create OTP record
            otp = OTPVerification.objects.create(
                user=user,
                otp_type=otp_type,
                purpose=purpose,
                otp_code=otp_code,
                recipient=recipient,
                ip_address=ip_address,
                user_agent=user_agent or ''
            )

            # Send OTP (TODO: Integrate with SMS/Email service)
            if otp_type == OTPVerification.OTP_TYPE_PHONE:
                success = OTPService._send_sms(recipient, otp_code)
            else:
                success = OTPService._send_email(recipient, otp_code)

            if success:
                return True, otp, f"OTP sent to {recipient}"
            else:
                return False, None, "Failed to send OTP"

        except Exception as e:
            return False, None, f"OTP request failed: {str(e)}"

    @staticmethod
    def verify_otp(recipient, otp_code, purpose):
        """
        Verify OTP code
        Returns: (success: bool, otp: OTPVerification, message: str)
        """
        try:
            # Find most recent unverified OTP
            otp = OTPVerification.objects.filter(
                recipient=recipient,
                purpose=purpose,
                is_verified=False
            ).order_by('-created_at').first()

            if not otp:
                return False, None, "No pending OTP verification found"

            # Verify OTP
            success, message = otp.verify(otp_code)
            return success, otp if success else None, message

        except Exception as e:
            return False, None, f"Verification failed: {str(e)}"

    @staticmethod
    def _send_sms(phone_number, otp_code):
        """
        Send SMS with OTP code via Africa's Talking
        """
        try:
            # Check if SMS is enabled
            if not getattr(settings, 'SMS_ENABLED', False):
                print(f"[SMS DISABLED] Would send OTP {otp_code} to {phone_number}")
                print(f"[SMS] Copy this code to verify: {otp_code}")
                return True  # Mock success for development

            # Import Africa's Talking
            import africastalking

            # Initialize SDK
            africastalking.initialize(
                username=settings.AFRICASTALKING_USERNAME,
                api_key=settings.AFRICASTALKING_API_KEY
            )

            # Get SMS service
            sms = africastalking.SMS

            # Send message
            message = f"Your Property237 verification code is: {otp_code}. Valid for 10 minutes."
            response = sms.send(message, [phone_number], sender_id=settings.AFRICASTALKING_SENDER_ID)

            print(f"[SMS] Sent OTP to {phone_number}: {response}")
            return True

        except ImportError:
            # Africa's Talking not installed
            print(f"[SMS] Africa's Talking not installed. OTP code: {otp_code}")
            print(f"[SMS] Install with: pip install africastalking")
            return True  # Return True for development

        except Exception as e:
            print(f"[SMS ERROR] Failed to send OTP to {phone_number}: {str(e)}")
            print(f"[SMS FALLBACK] Use this code: {otp_code}")
            return True  # Return True to not block user signup

    @staticmethod
    def _send_email(email_address, otp_code):
        """
        Send email with OTP code
        TODO: Integrate with email service
        """
        # Mock implementation for development
        print(f"[EMAIL] Sending OTP {otp_code} to {email_address}")

        # In production, use Django email:
        # from django.core.mail import send_mail
        # send_mail(
        #     'Property237 Verification Code',
        #     f'Your verification code is: {otp_code}',
        #     settings.DEFAULT_FROM_EMAIL,
        #     [email_address],
        #     fail_silently=False,
        # )

        return True  # Mock success


class PasswordResetService:
    """Service class for password reset operations"""

    @staticmethod
    @transaction.atomic
    def request_password_reset(identifier, ip_address=None):
        """
        Initiate password reset process
        Returns: (success: bool, message: str)
        """
        try:
            # Find user
            user = None
            try:
                if '@' in identifier:
                    user = User.objects.get(email__iexact=identifier)
                elif identifier.startswith('+'):
                    user = User.objects.get(phone_number=identifier)
                else:
                    return False, "Invalid identifier format"
            except User.DoesNotExist:
                # Don't reveal if user exists
                return True, "If an account exists, reset instructions have been sent"

            # Invalidate existing tokens
            PasswordResetToken.objects.filter(
                user=user,
                is_used=False
            ).update(is_used=True)

            # Generate secure token
            token = secrets.token_urlsafe(32)

            # Create reset token
            reset_token = PasswordResetToken.objects.create(
                user=user,
                token=token,
                ip_address=ip_address
            )

            # Send reset link (TODO: Implement)
            # For now, just print (development)
            reset_url = f"https://property237.com/reset-password?token={token}"
            print(f"[PASSWORD RESET] {user.email}: {reset_url}")

            return True, "Reset instructions sent"

        except Exception as e:
            return False, f"Password reset failed: {str(e)}"

    @staticmethod
    @transaction.atomic
    def confirm_password_reset(token, new_password):
        """
        Complete password reset with token
        Returns: (success: bool, message: str)
        """
        try:
            # Find token
            reset_token = PasswordResetToken.objects.get(token=token, is_used=False)

            # Validate token
            if not reset_token.is_valid():
                return False, "Invalid or expired reset token"

            # Update password
            user = reset_token.user
            user.set_password(new_password)
            user.save()

            # Mark token as used
            reset_token.is_used = True
            reset_token.used_at = timezone.now()
            reset_token.save()

            return True, "Password reset successfully"

        except PasswordResetToken.DoesNotExist:
            return False, "Invalid reset token"
        except Exception as e:
            return False, f"Password reset failed: {str(e)}"
