"""
Serializers for Category, PropertyTag, and PropertyState
"""
from django.db import models as django_models
from rest_framework import serializers
from .category_models import Category, PropertyTag, PropertyState


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for property categories"""
    subcategories = serializers.SerializerMethodField()
    is_parent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'code', 'description', 'icon',
            'parent', 'is_parent', 'is_active', 'order', 'subcategories'
        ]
        read_only_fields = ['slug']

    def get_is_parent(self, obj):
        return obj.is_parent()

    def get_subcategories(self, obj):
        if obj.is_parent():
            subcats = obj.subcategories.filter(is_active=True).order_by('order', 'name')
            return SubcategorySerializer(subcats, many=True).data
        return []


class SubcategorySerializer(serializers.ModelSerializer):
    """Simplified serializer for subcategories (no nesting)"""
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    parent_code = serializers.CharField(source='parent.code', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon',
                 'parent', 'parent_name', 'parent_code', 'order']


class PropertyTagSerializer(serializers.ModelSerializer):
    """Serializer for property tags"""
    applies_to_categories = serializers.SerializerMethodField()

    class Meta:
        model = PropertyTag
        fields = [
            'id', 'name', 'slug', 'description', 'color', 'icon',
            'applies_to_categories', 'is_active', 'order'
        ]
        read_only_fields = ['slug']

    def get_applies_to_categories(self, obj):
        """Return list of category IDs or empty for 'all'"""
        if not obj.applies_to.exists():
            return 'all'
        return list(obj.applies_to.values_list('id', flat=True))


class PropertyStateSerializer(serializers.ModelSerializer):
    """Serializer for property states"""
    applies_to_categories = serializers.SerializerMethodField()
    display_name = serializers.CharField(source='name', read_only=True)

    class Meta:
        model = PropertyState
        fields = [
            'id', 'code', 'name', 'display_name', 'description', 'color',
            'allows_inquiries', 'is_publicly_visible', 'applies_to_categories',
            'is_active', 'order'
        ]

    def get_applies_to_categories(self, obj):
        """Return list of category IDs or empty for 'all'"""
        if not obj.applies_to.exists():
            return 'all'
        return list(obj.applies_to.values_list('id', flat=True))


class CategoryWithFiltersSerializer(serializers.ModelSerializer):
    """
    Complete category data with applicable tags and states
    Used for dynamic form generation
    """
    subcategories = SubcategorySerializer(many=True, read_only=True)
    applicable_tags = serializers.SerializerMethodField()
    applicable_states = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'code', 'description', 'icon',
            'subcategories', 'applicable_tags', 'applicable_states'
        ]

    def get_applicable_tags(self, obj):
        """Get all tags applicable to this category"""
        # Tags with no categories OR tags that include this category
        applicable_tags = PropertyTag.objects.filter(
            is_active=True
        ).filter(
            django_models.Q(applies_to__isnull=True) | django_models.Q(applies_to=obj)
        ).distinct()
        return PropertyTagSerializer(applicable_tags, many=True).data

    def get_applicable_states(self, obj):
        """Get all states applicable to this category"""
        # States with no categories OR states that include this category
        from django.db import models as django_models
        applicable_states = PropertyState.objects.filter(
            is_active=True
        ).filter(
            django_models.Q(applies_to__isnull=True) | django_models.Q(applies_to=obj)
        ).distinct()
        return PropertyStateSerializer(applicable_states, many=True).data
