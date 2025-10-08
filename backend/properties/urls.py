from django.urls import path
from . import views, views_admin

app_name = 'properties'

urlpatterns = [
    # Property CRUD
    path('', views.PropertyListCreateAPIView.as_view(), name='property-list-create'),

    # Agent's properties
    path('my-properties/', views.my_properties_list, name='my-properties'),

    # Admin utilities
    path('admin/seed/', views_admin.seed_database, name='admin-seed'),
    path('admin/status/', views_admin.database_status, name='admin-status'),
    path('admin/user-status/', views_admin.user_status, name='user-status'),

    # Property metadata and search BEFORE slug route
    path('search/', views.property_search, name='property-search'),
    path('types/', views.PropertyTypeListAPIView.as_view(), name='property-types'),
    path('statuses/', views.PropertyStatusListAPIView.as_view(), name='property-statuses'),

    # Property viewing
    path('viewings/', views.PropertyViewingCreateAPIView.as_view(), name='property-viewing'),

    # Favorites
    path('favorites/', views.favorites_list, name='favorites-list'),
    path('<slug:slug>/favorite/', views.toggle_favorite, name='toggle-favorite'),

    # Slug catch-all LAST
    path('<slug:slug>/', views.PropertyDetailAPIView.as_view(), name='property-detail'),
]