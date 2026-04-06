from rest_framework.throttling import AnonRateThrottle


class LoginThrottle(AnonRateThrottle):
    scope = 'login'


class OTPThrottle(AnonRateThrottle):
    scope = 'otp'


class PasswordResetThrottle(AnonRateThrottle):
    scope = 'password_reset'


class SignupThrottle(AnonRateThrottle):
    scope = 'signup'
