from django.urls import path
from . import views

app_name = 'ad'

urlpatterns = [
    # Ad packages
    path('packages/', views.AdPackageListAPIView.as_view(), name='package-list'),
    path('packages/<int:pk>/', views.AdPackageDetailAPIView.as_view(), name='package-detail'),

    # User's advertisements (campaigns)
    path('campaigns/', views.AdvertisementListCreateAPIView.as_view(), name='campaign-list-create'),
    path('campaigns/<int:pk>/', views.AdvertisementDetailAPIView.as_view(), name='campaign-detail'),
    path('campaigns/<int:pk>/submit/', views.submit_advertisement, name='campaign-submit'),
    path('campaigns/<int:pk>/pause/', views.pause_advertisement, name='campaign-pause'),

    # Public active ads
    path('active/', views.ActiveAdvertisementListAPIView.as_view(), name='active-ads'),
    path('banners/', views.AdBannerListAPIView.as_view(), name='banner-list'),
    path('promoted/', views.PromotedPropertyListAPIView.as_view(), name='promoted-list'),

    # Tracking
    path('<int:pk>/impression/', views.record_impression, name='record-impression'),
    path('<int:pk>/click/', views.record_click, name='record-click'),
]