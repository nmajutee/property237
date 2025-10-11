"""
URL Configuration for Category API endpoints
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .category_views import (
    CategoryViewSet,
    PropertyTagViewSet,
    PropertyStateViewSet,
    PropertyFormDataViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', PropertyTagViewSet, basename='tag')
router.register(r'states', PropertyStateViewSet, basename='state')
router.register(r'form-data', PropertyFormDataViewSet, basename='form-data')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
