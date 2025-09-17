"""
Enterprise Authentication Views
JWT-based authentication with role-based access control
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .permissions import RoleBasedPermission
import logging

User = get_user_model()
logger = logging.getLogger('property237')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Enhanced JWT token with user info and permissions"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user_id'] = user.id
        token['email'] = user.email
        token['user_type'] = user.user_type
        token['full_name'] = user.get_full_name()
        token['is_verified'] = getattr(user, 'is_verified', False)

        # Add role-based permissions
        from django.conf import settings
        role_permissions = settings.ROLE_PERMISSIONS.get(user.user_type, [])
        token['permissions'] = role_permissions

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user info to response
        user = self.user
        data.update({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'is_verified': getattr(user, 'is_verified', False),
                'phone_number': getattr(user, 'phone_number', ''),
                'profile_picture': getattr(user, 'profile_picture', None),
            }
        })

        logger.info(f"User {user.email} authenticated successfully")
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with enhanced security"""
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Log authentication attempt
        email = request.data.get('email', 'unknown')
        logger.info(f"Authentication attempt for email: {email}")

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Set secure HTTP-only cookie for refresh token (optional)
            refresh_token = response.data.get('refresh')
            if refresh_token:
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=7 * 24 * 60 * 60,  # 7 days
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite='Lax'
                )

        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration with role assignment"""
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Add custom claims
        refresh['user_type'] = user.user_type
        refresh['permissions'] = settings.ROLE_PERMISSIONS.get(user.user_type, [])

        logger.info(f"New user registered: {user.email} as {user.user_type}")

        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'is_verified': False,
            },
            'tokens': {
                'access': access_token,
                'refresh': str(refresh),
            },
            'message': 'Registration successful. Please verify your email.'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout with token blacklisting"""
    try:
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            # Try to get from cookie
            refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        logger.info(f"User {request.user.email} logged out")

        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        return response

    except Exception as e:
        logger.error(f"Logout error for user {request.user.email}: {str(e)}")
        return Response(
            {'error': 'Invalid token'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    serializer = UserProfileSerializer(
        request.user,
        data=request.data,
        partial=request.method == 'PATCH'
    )

    if serializer.is_valid():
        serializer.save()
        logger.info(f"User {request.user.email} updated profile")
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response(
            {'error': 'Both current and new passwords are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(current_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    logger.info(f"User {user.email} changed password")

    return Response({'message': 'Password changed successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def user_permissions(request):
    """Get user permissions for frontend routing"""
    from django.conf import settings

    permissions = settings.ROLE_PERMISSIONS.get(request.user.user_type, [])

    return Response({
        'user_type': request.user.user_type,
        'permissions': permissions,
        'has_admin_access': request.user.user_type == 'admin',
        'can_manage_properties': 'properties.manage' in permissions or '*' in permissions,
        'can_view_reports': 'reports.view' in permissions or '*' in permissions,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """Email verification endpoint"""
    token = request.data.get('token')

    if not token:
        return Response(
            {'error': 'Verification token required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Implement email verification logic here
    # This would typically decode a JWT token with user ID and expiry

    return Response({'message': 'Email verified successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Forgot password endpoint"""
    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_email(email)
        user = User.objects.get(email=email)

        # Generate password reset token and send email
        # Implement actual email sending logic here

        logger.info(f"Password reset requested for: {email}")

        return Response({
            'message': 'If this email exists, you will receive password reset instructions'
        })

    except (ValidationError, User.DoesNotExist):
        # Don't reveal if email exists
        return Response({
            'message': 'If this email exists, you will receive password reset instructions'
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password with token"""
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not token or not new_password:
        return Response(
            {'error': 'Token and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Implement password reset logic here
    # This would typically decode a JWT token with user ID and expiry

    return Response({'message': 'Password reset successfully'})