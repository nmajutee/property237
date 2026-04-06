from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import CustomUser, UserPreferences
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    UserPreferencesSerializer
)


class UserRegistrationAPIView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create authentication token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """User login endpoint using username/email + password"""
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'username/email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        return Response({'error': 'Account is deactivated'}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'user': UserProfileSerializer(user).data,
        'token': token.key,
        'message': 'Login successful'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'})
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserPreferencesAPIView(generics.RetrieveUpdateAPIView):
    """User preferences management"""
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        preferences, created = UserPreferences.objects.get_or_create(
            user=self.request.user
        )
        return preferences


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_user_list(request):
    """List all users with search/filter (admin only)"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)

    users = CustomUser.objects.all().order_by('-date_joined')

    search = request.query_params.get('search', '')
    if search:
        from django.db.models import Q
        users = users.filter(
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(phone_number__icontains=search)
        )

    user_type = request.query_params.get('user_type', '')
    if user_type:
        users = users.filter(user_type=user_type)

    is_active = request.query_params.get('is_active', '')
    if is_active:
        users = users.filter(is_active=is_active.lower() == 'true')

    # Manual pagination
    page = int(request.query_params.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    total = users.count()

    user_list = users[start:start + page_size]
    data = [{
        'id': u.id,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'phone_number': u.phone_number,
        'user_type': u.user_type,
        'is_active': u.is_active,
        'date_joined': u.date_joined,
        'last_login': u.last_login,
    } for u in user_list]

    return Response({
        'count': total,
        'results': data,
        'page': page,
        'pages': (total + page_size - 1) // page_size,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_toggle_user_status(request, pk):
    """Activate/deactivate a user (admin only)"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    from django.shortcuts import get_object_or_404
    user = get_object_or_404(CustomUser, pk=pk)
    if user == request.user:
        return Response({'error': 'Cannot deactivate yourself'}, status=status.HTTP_400_BAD_REQUEST)
    user.is_active = not user.is_active
    user.save()
    return Response({'message': f'User {"activated" if user.is_active else "deactivated"}', 'is_active': user.is_active})