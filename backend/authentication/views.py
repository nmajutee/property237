"""
Authentication Views
API endpoints for authentication
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    SignupSerializer,
    LoginSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserSerializer
)
from .services import AuthService, OTPService, PasswordResetService

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_client_info(request):
    """Extract client information from request"""
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
    if ip_address:
        ip_address = ip_address.split(',')[0]
    else:
        ip_address = request.META.get('REMOTE_ADDR')

    user_agent = request.META.get('HTTP_USER_AGENT', '')

    return ip_address, user_agent


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    User signup endpoint
    POST /api/auth/signup/

    Body:
    {
        "full_name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phone_number": "+237XXXXXXXXX",
        "password": "SecurePass123!",
        "password_confirm": "SecurePass123!",
        "user_type": "tenant|agent",
        "terms_accepted": true
    }
    """
    try:
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        success, user, message = AuthService.signup_user(serializer.validated_data)

        if success:
            # Request OTP for phone verification
            ip_address, user_agent = get_client_info(request)
            otp_success, otp, otp_message = OTPService.request_otp(
                recipient=user.phone_number,
                otp_type='phone',
                purpose='signup',
                user=user,
                ip_address=ip_address,
                user_agent=user_agent
            )

            return Response({
                'success': True,
                'message': message,
                'user': UserSerializer(user).data,
                'otp_sent': otp_success,
                'otp_message': otp_message,
                'next_step': 'verify_phone'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Log the error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Signup error: {str(e)}", exc_info=True)
        
        return Response({
            'success': False,
            'message': 'An unexpected error occurred during registration. Please try again or contact support.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login endpoint
    POST /api/auth/login/

    Body:
    {
        "identifier": "username|email|phone",
        "password": "password",
        "remember_me": false
    }
    """
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    ip_address, user_agent = get_client_info(request)

    # Authenticate user
    success, user, message = AuthService.login_user(
        identifier=serializer.validated_data['identifier'],
        password=serializer.validated_data['password'],
        ip_address=ip_address,
        user_agent=user_agent
    )

    if success:
        # Generate tokens
        tokens = get_tokens_for_user(user)

        return Response({
            'success': True,
            'message': message,
            'user': UserSerializer(user).data,
            'tokens': tokens
        })
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    User logout endpoint
    POST /api/auth/logout/

    Body:
    {
        "refresh_token": "token"
    }
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        return Response({
            'success': True,
            'message': 'Logged out successfully'
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Logout failed'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_otp(request):
    """
    Request OTP for verification
    POST /api/auth/otp/request/

    Body:
    {
        "recipient": "+237XXXXXXXXX|email@example.com",
        "otp_type": "phone|email",
        "purpose": "signup|login|password_reset|phone_change"
    }
    """
    serializer = OTPRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    ip_address, user_agent = get_client_info(request)

    # Find user if authenticated
    user = request.user if request.user.is_authenticated else None

    # Request OTP
    success, otp, message = OTPService.request_otp(
        recipient=serializer.validated_data['recipient'],
        otp_type=serializer.validated_data['otp_type'],
        purpose=serializer.validated_data['purpose'],
        user=user,
        ip_address=ip_address,
        user_agent=user_agent
    )

    if success:
        return Response({
            'success': True,
            'message': message,
            'expires_at': otp.expires_at
        })
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP code
    POST /api/auth/otp/verify/

    Body:
    {
        "recipient": "+237XXXXXXXXX|email@example.com",
        "otp_code": "123456",
        "purpose": "signup|login|password_reset|phone_change"
    }
    """
    serializer = OTPVerifySerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verify OTP
    success, otp, message = OTPService.verify_otp(
        recipient=serializer.validated_data['recipient'],
        otp_code=serializer.validated_data['otp_code'],
        purpose=serializer.validated_data['purpose']
    )

    if success:
        response_data = {
            'success': True,
            'message': message,
            'verified_at': otp.verified_at
        }

        # If user exists and OTP is for signup/login, generate tokens
        if otp.user and otp.purpose in ['signup', 'login']:
            tokens = get_tokens_for_user(otp.user)
            response_data['user'] = UserSerializer(otp.user).data
            response_data['tokens'] = tokens

        return Response(response_data)
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Request password reset
    POST /api/auth/password/reset/request/

    Body:
    {
        "identifier": "email@example.com|+237XXXXXXXXX"
    }
    """
    serializer = PasswordResetRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    ip_address, _ = get_client_info(request)

    # Request reset
    success, message = PasswordResetService.request_password_reset(
        identifier=serializer.validated_data['identifier'],
        ip_address=ip_address
    )

    # Always return success to prevent user enumeration
    return Response({
        'success': True,
        'message': 'If an account exists, reset instructions have been sent'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    """
    Confirm password reset with token
    POST /api/auth/password/reset/confirm/

    Body:
    {
        "token": "reset_token",
        "new_password": "NewSecurePass123!",
        "new_password_confirm": "NewSecurePass123!"
    }
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Confirm reset
    success, message = PasswordResetService.confirm_password_reset(
        token=serializer.validated_data['token'],
        new_password=serializer.validated_data['new_password']
    )

    if success:
        return Response({
            'success': True,
            'message': message
        })
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get current user profile
    GET /api/auth/profile/
    """
    return Response(UserSerializer(request.user).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile
    PATCH /api/auth/profile/
    """
    serializer = UserSerializer(request.user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    else:
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token(request):
    """
    Refresh access token
    POST /api/auth/token/refresh/

    Body:
    {
        "refresh": "refresh_token"
    }
    """
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                'error': 'Refresh token required'
            }, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken(refresh_token)

        return Response({
            'access': str(refresh.access_token)
        })
    except Exception as e:
        return Response({
            'error': 'Invalid refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)
