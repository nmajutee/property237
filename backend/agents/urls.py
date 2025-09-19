from django.urls import path
from . import views

app_name = 'agents'

urlpatterns = [
    # Legacy registration (kept for backward compatibility)
    path('register/', views.AgentRegistrationAPIView.as_view(), name='agent-register'),
    path('profile/', views.AgentProfileAPIView.as_view(), name='agent-profile'),

    # New multi-step onboarding system
    path('onboard/', views.AgentOnboardingAPIView.as_view(), name='agent-onboard'),
    path('profile/enhanced/', views.EnhancedAgentProfileAPIView.as_view(), name='enhanced-agent-profile'),
    path('verification-status/', views.AgentVerificationStatusAPIView.as_view(), name='agent-verification-status'),

    # Document management
    path('documents/', views.AgentDocumentUploadAPIView.as_view(), name='agent-documents'),

    # Mobile money info
    path('mobile-money/', views.AgentMobileMoneyAPIView.as_view(), name='agent-mobile-money'),

    # Agent listing and details
    path('', views.AgentListAPIView.as_view(), name='agent-list'),
    path('<int:id>/', views.AgentDetailAPIView.as_view(), name='agent-detail'),
    path('<int:id>/enhanced/', views.PublicEnhancedAgentProfileAPIView.as_view(), name='public-enhanced-agent-detail'),

    # Agent certifications
    path('certifications/', views.AgentCertificationListCreateAPIView.as_view(), name='agent-certifications'),

    # Agent reviews
    path('<int:agent_id>/reviews/', views.AgentReviewListCreateAPIView.as_view(), name='agent-reviews'),
]