"""
Enterprise Authentication URLs
JWT-based authentication endpoints
"""
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import auth_views

# API versioning
app_name = 'auth'

urlpatterns = [
    # JWT Authentication
    path('login/', auth_views.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', auth_views.logout, name='logout'),

    # User Registration & Management
    path('register/', auth_views.register, name='register'),
    path('profile/', auth_views.profile, name='profile'),
    path('profile/update/', auth_views.update_profile, name='update_profile'),
    path('password/change/', auth_views.change_password, name='change_password'),

    # Email Verification
    path('verify-email/', auth_views.verify_email, name='verify_email'),

    # Password Reset
    path('password/forgot/', auth_views.forgot_password, name='forgot_password'),
    path('password/reset/', auth_views.reset_password, name='reset_password'),

    # User Permissions (for frontend routing)
    path('permissions/', auth_views.user_permissions, name='user_permissions'),
]