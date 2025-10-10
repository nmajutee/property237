from django.urls import path
from . import views
from . import imagekit_views

app_name = 'media'

urlpatterns = [
    # Media file management
    path('upload/', views.MediaFileUploadAPIView.as_view(), name='media-upload'),
    path('property/<int:property_id>/', views.MediaFileListAPIView.as_view(), name='media-list'),
    path('<int:file_id>/delete/', views.delete_media_file, name='media-delete'),

    # ImageKit uploads
    path('upload-property-media/', imagekit_views.upload_property_media, name='imagekit-property-upload'),
    path('upload-profile-picture/', imagekit_views.upload_profile_picture, name='imagekit-profile-upload'),
    path('imagekit-auth/', imagekit_views.get_imagekit_auth_params, name='imagekit-auth'),
]