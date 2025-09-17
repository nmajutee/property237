from rest_framework import serializers
from .models import MaintenanceRequest, MaintenanceCategory, ServiceProvider


class MaintenanceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceCategory
        fields = ['id', 'name', 'description']


class ServiceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = ['id', 'name', 'contact_email', 'contact_phone']


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = [
            'id', 'property', 'tenant', 'category', 'title', 'description', 'priority', 'status',
            'requested_date', 'completed_date', 'estimated_cost', 'actual_cost', 'assigned_to'
        ]
        read_only_fields = ['id', 'requested_date']
