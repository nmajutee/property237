from django.contrib import admin
from .models import OTPVerification, LoginAttempt, PasswordResetToken


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = [
        'recipient',
        'otp_type',
        'purpose',
        'is_verified',
        'attempts',
        'created_at',
        'expires_at'
    ]
    list_filter = [
        'otp_type',
        'purpose',
        'is_verified',
        'created_at'
    ]
    search_fields = ['recipient', 'user__email', 'user__username']
    readonly_fields = [
        'otp_code',
        'created_at',
        'verified_at',
        'ip_address',
        'user_agent'
    ]

    def has_add_permission(self, request):
        return False


@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    list_display = [
        'identifier',
        'success',
        'failure_reason',
        'ip_address',
        'created_at'
    ]
    list_filter = ['success', 'created_at']
    search_fields = ['identifier', 'ip_address', 'user__email']
    readonly_fields = ['identifier', 'ip_address', 'user_agent', 'success', 'failure_reason', 'user', 'created_at']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'token_preview',
        'is_used',
        'created_at',
        'expires_at'
    ]
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email', 'user__username', 'token']
    readonly_fields = ['user', 'token', 'created_at', 'expires_at', 'used_at', 'ip_address']

    def token_preview(self, obj):
        return f"{obj.token[:20]}..."
    token_preview.short_description = 'Token'

    def has_add_permission(self, request):
        return False
