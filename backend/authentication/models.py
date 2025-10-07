"""
Authentication Models
OTP verification and secure authentication
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
import string

User = get_user_model()


class OTPVerification(models.Model):
    """
    OTP (One-Time Password) verification for phone/email
    """
    OTP_TYPE_PHONE = 'phone'
    OTP_TYPE_EMAIL = 'email'

    OTP_TYPES = [
        (OTP_TYPE_PHONE, 'Phone Verification'),
        (OTP_TYPE_EMAIL, 'Email Verification'),
    ]

    PURPOSE_SIGNUP = 'signup'
    PURPOSE_LOGIN = 'login'
    PURPOSE_PASSWORD_RESET = 'password_reset'
    PURPOSE_PHONE_CHANGE = 'phone_change'

    PURPOSE_CHOICES = [
        (PURPOSE_SIGNUP, 'Signup Verification'),
        (PURPOSE_LOGIN, 'Login Verification'),
        (PURPOSE_PASSWORD_RESET, 'Password Reset'),
        (PURPOSE_PHONE_CHANGE, 'Phone Number Change'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='otp_verifications',
        null=True,
        blank=True,
        help_text="User (null for signup OTP)"
    )

    # OTP Details
    otp_type = models.CharField(max_length=10, choices=OTP_TYPES)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    otp_code = models.CharField(max_length=6, help_text="6-digit OTP code")
    recipient = models.CharField(
        max_length=255,
        help_text="Phone number or email address"
    )

    # Status
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0, help_text="Number of verification attempts")
    max_attempts = models.IntegerField(default=3)

    # Expiry
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    # Security
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        verbose_name = "OTP Verification"
        verbose_name_plural = "OTP Verifications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'otp_type', 'is_verified']),
            models.Index(fields=['otp_code', 'expires_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.recipient} - {self.otp_type} - {self.purpose}"

    def save(self, *args, **kwargs):
        # Set expiry time (10 minutes from creation)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    @staticmethod
    def generate_otp():
        """Generate 6-digit OTP code"""
        return ''.join(random.choices(string.digits, k=6))

    def is_expired(self):
        """Check if OTP has expired"""
        return timezone.now() > self.expires_at

    def can_verify(self):
        """Check if OTP can be verified"""
        return not self.is_verified and not self.is_expired() and self.attempts < self.max_attempts

    def verify(self, otp_code):
        """
        Verify OTP code
        Returns: (success: bool, message: str)
        """
        self.attempts += 1
        self.save()

        if self.is_verified:
            return False, "OTP already verified"

        if self.is_expired():
            return False, "OTP has expired"

        if self.attempts > self.max_attempts:
            return False, "Maximum verification attempts exceeded"

        if self.otp_code != otp_code:
            remaining = self.max_attempts - self.attempts
            return False, f"Invalid OTP code. {remaining} attempts remaining"

        # Success
        self.is_verified = True
        self.verified_at = timezone.now()
        self.save()

        # Update user verification status
        if self.user:
            if self.otp_type == self.OTP_TYPE_PHONE:
                self.user.is_phone_verified = True
                self.user.save()
            elif self.otp_type == self.OTP_TYPE_EMAIL:
                self.user.is_email_verified = True
                self.user.save()

        return True, "OTP verified successfully"


class LoginAttempt(models.Model):
    """
    Track login attempts for security monitoring
    """
    identifier = models.CharField(
        max_length=255,
        help_text="Username, email, or phone number"
    )
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)

    success = models.BooleanField(default=False)
    failure_reason = models.CharField(max_length=255, blank=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='login_attempts'
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Login Attempt"
        verbose_name_plural = "Login Attempts"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['identifier', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        status = "Success" if self.success else "Failed"
        return f"{self.identifier} - {status} - {self.created_at}"

    @classmethod
    def is_locked_out(cls, identifier, ip_address=None):
        """
        Check if identifier or IP is locked out due to failed attempts
        Returns: (is_locked: bool, unlock_time: datetime)
        """
        LOCKOUT_THRESHOLD = 5  # Lock after 5 failed attempts
        LOCKOUT_DURATION = timedelta(minutes=15)
        TIME_WINDOW = timedelta(minutes=30)

        cutoff_time = timezone.now() - TIME_WINDOW

        # Check by identifier
        recent_failures = cls.objects.filter(
            identifier=identifier,
            success=False,
            created_at__gte=cutoff_time
        ).count()

        if recent_failures >= LOCKOUT_THRESHOLD:
            last_attempt = cls.objects.filter(
                identifier=identifier,
                created_at__gte=cutoff_time
            ).order_by('-created_at').first()

            unlock_time = last_attempt.created_at + LOCKOUT_DURATION
            if timezone.now() < unlock_time:
                return True, unlock_time

        # Check by IP address
        if ip_address:
            ip_failures = cls.objects.filter(
                ip_address=ip_address,
                success=False,
                created_at__gte=cutoff_time
            ).count()

            if ip_failures >= LOCKOUT_THRESHOLD * 2:  # Higher threshold for IP
                last_attempt = cls.objects.filter(
                    ip_address=ip_address,
                    created_at__gte=cutoff_time
                ).order_by('-created_at').first()

                unlock_time = last_attempt.created_at + LOCKOUT_DURATION
                if timezone.now() < unlock_time:
                    return True, unlock_time

        return False, None


class PasswordResetToken(models.Model):
    """
    Password reset tokens
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens'
    )
    token = models.CharField(max_length=100, unique=True)

    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        verbose_name = "Password Reset Token"
        verbose_name_plural = "Password Reset Tokens"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'is_used']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.token[:10]}..."

    def save(self, *args, **kwargs):
        # Set expiry time (1 hour from creation)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)

    def is_valid(self):
        """Check if token is valid"""
        return not self.is_used and timezone.now() < self.expires_at
