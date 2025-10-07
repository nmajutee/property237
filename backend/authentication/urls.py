from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    # OTP Verification
    path('otp/request/', views.request_otp, name='request-otp'),
    path('otp/verify/', views.verify_otp, name='verify-otp'),

    # Password Reset
    path('password/reset/request/', views.request_password_reset, name='request-password-reset'),
    path('password/reset/confirm/', views.confirm_password_reset, name='confirm-password-reset'),

    # Profile
    path('profile/', views.get_profile, name='get-profile'),
    path('profile/update/', views.update_profile, name='update-profile'),

    # Token
    path('token/refresh/', views.refresh_token, name='refresh-token'),
]
