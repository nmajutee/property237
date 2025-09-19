from utils.permissions import IsAgentOrReadOnly, IsVerifiedAgent
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.http import Http404
from .models import (
    AgentProfile, AgentCertification, AgentReview,
    AgentAddress, AgentDocument, AgentMobileMoney
)
from .serializers import (
    AgentProfileSerializer, AgentRegistrationSerializer,
    AgentCertificationSerializer, AgentReviewSerializer,
    AgentOnboardingDataSerializer, EnhancedAgentProfileSerializer,
    AgentAddressSerializer,
    AgentDocumentSerializer, AgentMobileMoneySerializer
)


class AgentRegistrationAPIView(generics.CreateAPIView):
    """Register as an agent"""
    queryset = AgentProfile.objects.all()
    serializer_class = AgentRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if user already has an agent profile
        if hasattr(request.user, 'agent_profile'):
            return Response(
                {'error': 'User already has an agent profile'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update user type to agent
        request.user.user_type = 'agent'
        request.user.save()

        return super().create(request, *args, **kwargs)


class AgentProfileAPIView(generics.RetrieveUpdateAPIView):
    """Get and update agent profile"""
    serializer_class = AgentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.agent_profile


class AgentListAPIView(generics.ListAPIView):
    """List all verified agents"""
    queryset = AgentProfile.objects.filter(
        is_verified=True
    ).select_related('user').prefetch_related('service_areas')
    serializer_class = AgentProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by specialization
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)

        # Filter by service area
        area = self.request.query_params.get('area', None)
        if area:
            queryset = queryset.filter(service_areas__id=area)

        # Filter featured agents
        featured = self.request.query_params.get('featured', None)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset.order_by('-is_featured', '-client_rating', '-total_sales')


class AgentDetailAPIView(generics.RetrieveAPIView):
    """Get agent details by ID"""
    queryset = AgentProfile.objects.filter(is_verified=True)
    serializer_class = AgentProfileSerializer
    lookup_field = 'id'


class AgentCertificationListCreateAPIView(generics.ListCreateAPIView):
    """List and create agent certifications"""
    serializer_class = AgentCertificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AgentCertification.objects.filter(
            agent=self.request.user.agent_profile
        )

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user.agent_profile)


class AgentReviewListCreateAPIView(generics.ListCreateAPIView):
    """List and create agent reviews"""
    serializer_class = AgentReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        agent_id = self.kwargs.get('agent_id')
        return AgentReview.objects.filter(agent_id=agent_id)

    def perform_create(self, serializer):
        agent_id = self.kwargs.get('agent_id')
        serializer.save(
            agent_id=agent_id,
            reviewer=self.request.user
        )


class AgentOnboardingAPIView(APIView):
    """
    Multi-step agent onboarding API
    Handles comprehensive agent registration matching frontend wizard
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Handle complete agent onboarding data"""
        serializer = AgentOnboardingDataSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Create the complete agent profile
                result = serializer.save()

                # Return success response with created data
                return Response({
                    'success': True,
                    'message': 'Agent profile created successfully',
                    'agent_id': result['agent_profile'].id,
                    'user_id': result['user'].id,
                    'next_steps': [
                        'Upload required documents',
                        'Verify mobile money account (if provided)',
                        'Wait for admin verification'
                    ]
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({
                    'success': False,
                    'error': 'Failed to create agent profile',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class AgentDocumentUploadAPIView(APIView):
    """
    Handle document uploads for agent verification
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Upload a document for the authenticated agent"""
        try:
            # Ensure user has agent profile
            if not hasattr(request.user, 'agent_profile'):
                return Response({
                    'error': 'User does not have an agent profile'
                }, status=status.HTTP_400_BAD_REQUEST)

            agent_profile = request.user.agent_profile

            # Get document type and file
            document_type = request.data.get('document_type')
            file = request.data.get('file')

            if not document_type or not file:
                return Response({
                    'error': 'Both document_type and file are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create document record
            document = AgentDocument.objects.create(
                agent=agent_profile,
                document_type=document_type,
                file=file,
                original_filename=file.name,
                file_size=file.size,
                mime_type=file.content_type,
                description=request.data.get('description', '')
            )

            serializer = AgentDocumentSerializer(document)

            return Response({
                'success': True,
                'document': serializer.data,
                'message': 'Document uploaded successfully'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': 'Failed to upload document',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        """List all documents for the authenticated agent"""
        try:
            if not hasattr(request.user, 'agent_profile'):
                return Response({
                    'error': 'User does not have an agent profile'
                }, status=status.HTTP_400_BAD_REQUEST)

            documents = AgentDocument.objects.filter(
                agent=request.user.agent_profile
            )

            serializer = AgentDocumentSerializer(documents, many=True)

            return Response({
                'documents': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Failed to retrieve documents',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AgentMobileMoneyAPIView(generics.RetrieveUpdateAPIView):
    """
    Get and update agent mobile money information
    """
    serializer_class = AgentMobileMoneySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            agent_profile = self.request.user.agent_profile
            mobile_money, created = AgentMobileMoney.objects.get_or_create(
                agent=agent_profile
            )
            return mobile_money
        except AgentProfile.DoesNotExist:
            raise Http404("Agent profile not found")

    def post(self, request, *args, **kwargs):
        """Send verification code to mobile money account"""
        # This would integrate with actual mobile money API
        # For now, just return success
        return Response({
            'success': True,
            'message': 'Verification code sent to mobile number',
            'code_expires_in': 300  # 5 minutes
        })


class EnhancedAgentProfileAPIView(generics.RetrieveAPIView):
    """
    Get comprehensive agent profile with all related data
    """
    serializer_class = EnhancedAgentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.agent_profile


class PublicEnhancedAgentProfileAPIView(generics.RetrieveAPIView):
    """
    Get comprehensive agent profile for public viewing
    """
    queryset = AgentProfile.objects.filter(is_verified=True, is_active=True)
    serializer_class = EnhancedAgentProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class AgentVerificationStatusAPIView(APIView):
    """
    Check agent verification status and requirements
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            agent_profile = request.user.agent_profile

            # Check verification requirements
            has_address = hasattr(agent_profile, 'address')
            has_documents = agent_profile.documents.exists()
            verified_documents = agent_profile.documents.filter(is_verified=True).count()
            total_documents = agent_profile.documents.count()

            # Check mobile money if provided
            mobile_money_verified = False
            if hasattr(agent_profile, 'mobile_money'):
                mobile_money_verified = agent_profile.mobile_money.is_verified

            verification_status = {
                'is_verified': agent_profile.is_verified,
                'requirements': {
                    'profile_complete': bool(agent_profile.bio and agent_profile.specialization),
                    'address_provided': has_address,
                    'documents_uploaded': has_documents,
                    'documents_verified': verified_documents > 0,
                    'mobile_money_verified': mobile_money_verified
                },
                'documents': {
                    'total': total_documents,
                    'verified': verified_documents,
                    'pending': total_documents - verified_documents
                },
                'next_steps': []
            }

            # Generate next steps
            if not verification_status['requirements']['profile_complete']:
                verification_status['next_steps'].append('Complete profile information')
            if not verification_status['requirements']['address_provided']:
                verification_status['next_steps'].append('Provide address information')
            if not verification_status['requirements']['documents_uploaded']:
                verification_status['next_steps'].append('Upload required documents')
            if verification_status['documents']['pending'] > 0:
                verification_status['next_steps'].append('Wait for document verification')
            if hasattr(agent_profile, 'mobile_money') and not mobile_money_verified:
                verification_status['next_steps'].append('Verify mobile money account')

            return Response(verification_status)

        except AgentProfile.DoesNotExist:
            return Response({
                'error': 'Agent profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
