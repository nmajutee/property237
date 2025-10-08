"""
Admin utility views for one-time setup operations
"""
from django.core.management import call_command
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from properties.models import PropertyType, PropertyStatus
from locations.models import Region, City, Area


@api_view(['POST'])
@permission_classes([IsAdminUser])
def seed_database(request):
    """
    One-time endpoint to seed the database with initial data.
    Only accessible by admin users.
    """
    try:
        # Check if already seeded
        types_count = PropertyType.objects.count()
        statuses_count = PropertyStatus.objects.count()
        regions_count = Region.objects.count()

        if types_count > 0 and statuses_count > 0 and regions_count > 0:
            return Response({
                'status': 'already_seeded',
                'message': 'Database already contains data',
                'counts': {
                    'property_types': types_count,
                    'property_statuses': statuses_count,
                    'regions': regions_count,
                }
            })

        # Run seeding commands
        call_command('populate_property_data')
        call_command('populate_cameroon_locations')

        # Get updated counts
        return Response({
            'status': 'success',
            'message': 'Database seeded successfully',
            'counts': {
                'property_types': PropertyType.objects.count(),
                'property_statuses': PropertyStatus.objects.count(),
                'regions': Region.objects.count(),
                'cities': City.objects.count(),
                'areas': Area.objects.count(),
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def database_status(request):
    """
    Check if database has been seeded with initial data.
    Public endpoint to verify setup.
    """
    return Response({
        'seeded': PropertyType.objects.exists() and PropertyStatus.objects.exists() and Region.objects.exists(),
        'counts': {
            'property_types': PropertyType.objects.count(),
            'property_statuses': PropertyStatus.objects.count(),
            'regions': Region.objects.count(),
            'cities': City.objects.count(),
            'areas': Area.objects.count(),
        }
    })


@api_view(['GET'])
def user_status(request):
    """
    Check current user's status and permissions.
    Requires authentication.
    """
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=401)

    from agents.models import AgentProfile

    has_agent_profile = False
    agent_profile_id = None
    try:
        agent_profile = request.user.agents_profile
        has_agent_profile = True
        agent_profile_id = agent_profile.id
    except AgentProfile.DoesNotExist:
        pass

    return Response({
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'phone_number': str(request.user.phone_number),
            'user_type': request.user.user_type,
            'is_phone_verified': request.user.is_phone_verified,
            'can_list_property': request.user.can_list_property(),
        },
        'agent_profile': {
            'exists': has_agent_profile,
            'id': agent_profile_id,
        }
    })
