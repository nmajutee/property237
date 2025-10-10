from rest_framework import serializers
from .models import PropertyType, PropertyStatus, Property, PropertyFeature, PropertyViewing
from locations.serializers import AreaSerializer
from agents.serializers import AgentProfileSerializer
from media.models import PropertyImage


class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = ['id', 'name', 'category', 'description', 'is_active']


class PropertyStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyStatus
        fields = ['id', 'name', 'description', 'is_active']


class PropertyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFeature
        fields = ['id', 'feature_name', 'feature_value', 'is_highlighted']


class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer for property images"""
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'image_url', 'thumbnail_url', 'image_type', 'title', 'is_primary', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        """Get full-size image URL"""
        if obj.image:
            url = obj.image.url
            print(f"DEBUG: PropertyImage {obj.id} image.url = {url}")

            # AWS S3 URLs are already absolute
            if url and url.startswith('http'):
                print(f"DEBUG: Returning ImageKit URL: {url}")
                return url

            # For local paths, make absolute
            if url and not url.startswith('http'):
                request = self.context.get('request')
                if request:
                    abs_url = request.build_absolute_uri(url)
                    print(f"DEBUG: Returning absolute URL: {abs_url}")
                    return abs_url

        print(f"DEBUG: No image URL for PropertyImage {obj.id}")
        return None

            return url
        return None

    def get_thumbnail_url(self, obj):
        """Get thumbnail URL - for now same as image_url, can add image processing later"""
        return self.get_image_url(obj)


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for property listings"""
    property_type = PropertyTypeSerializer(read_only=True)
    status = PropertyStatusSerializer(read_only=True)
    area = AreaSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'status', 'listing_type',
            'price', 'currency', 'area', 'no_of_bedrooms', 'no_of_bathrooms',
            'created_at', 'slug', 'featured', 'images', 'primary_image',
            'is_active', 'views_count'
        ]

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if not primary_image:
            # Fallback to first image if no primary
            primary_image = obj.images.first()

        if primary_image and primary_image.image:
            url = primary_image.image.url

            # AWS S3 URLs are already absolute
            if url and url.startswith('http'):
                return url

            # For local paths, make absolute
            if url and not url.startswith('http'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)

            return url
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Complete property data for detail views"""
    property_type = PropertyTypeSerializer(read_only=True)
    status = PropertyStatusSerializer(read_only=True)
    area = AreaSerializer(read_only=True)
    agent = AgentProfileSerializer(read_only=True)
    additional_features = PropertyFeatureSerializer(many=True, read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'


class PropertyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating properties"""
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Property
        exclude = ['created_at', 'updated_at', 'slug', 'views_count', 'agent']

    def create(self, validated_data):
        # Extract images from validated data
        images_data = validated_data.pop('images', [])

        # Agent is already set by the view's perform_create method
        property_instance = super().create(validated_data)

        # Create PropertyImage instances for each uploaded image
        for idx, image in enumerate(images_data):
            PropertyImage.objects.create(
                property=property_instance,
                image=image,
                order=idx,
                is_primary=(idx == 0),  # First image is primary
                uploaded_by=self.context.get('request').user if self.context.get('request') else None
            )

        return property_instance


class PropertyViewingSerializer(serializers.ModelSerializer):
    property_listing = PropertyListSerializer(read_only=True)
    viewer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PropertyViewing
        fields = '__all__'