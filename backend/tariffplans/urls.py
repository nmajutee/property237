from django.urls import path
from . import views

app_name = 'tariffplans'

urlpatterns = [
    # Public plan browsing
    path('categories/', views.TariffCategoryListAPIView.as_view(), name='category-list'),
    path('plans/', views.TariffPlanListAPIView.as_view(), name='plan-list'),
    path('plans/compare/', views.compare_plans, name='plan-compare'),
    path('plans/<slug:slug>/', views.TariffPlanDetailAPIView.as_view(), name='plan-detail'),
    path('features/', views.PlanFeatureListAPIView.as_view(), name='feature-list'),

    # Subscriptions
    path('subscriptions/', views.UserSubscriptionListAPIView.as_view(), name='subscription-list'),
    path('subscriptions/current/', views.current_subscription, name='current-subscription'),
    path('subscriptions/subscribe/', views.subscribe, name='subscribe'),
    path('subscriptions/<int:pk>/cancel/', views.cancel_subscription, name='cancel-subscription'),
    path('subscriptions/upgrade/', views.upgrade_plan, name='upgrade-plan'),

    # Usage & history
    path('usage/', views.SubscriptionUsageListAPIView.as_view(), name='usage-list'),
    path('upgrade-history/', views.PlanUpgradeHistoryAPIView.as_view(), name='upgrade-history'),
]