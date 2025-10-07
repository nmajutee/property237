"""
Credit System Views
API endpoints for credit management
"""
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.utils import timezone
from .models import (
    CreditBalance,
    CreditPackage,
    CreditTransaction,
    CreditPricing,
    PropertyView
)
from .serializers import (
    CreditBalanceSerializer,
    CreditPackageSerializer,
    CreditTransactionSerializer,
    CreditPurchaseSerializer,
    CreditUsageSerializer,
    CreditPricingSerializer,
    PropertyViewSerializer
)
from .services import CreditService


class CreditBalanceView(generics.RetrieveAPIView):
    """
    Get current user's credit balance
    GET /api/credits/balance/
    """
    serializer_class = CreditBalanceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        balance, _ = CreditBalance.objects.get_or_create(user=self.request.user)
        return balance


class CreditPackageListView(generics.ListAPIView):
    """
    List available credit packages
    GET /api/credits/packages/
    """
    serializer_class = CreditPackageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CreditPackage.objects.filter(is_active=True).order_by('display_order', 'price')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_credits(request):
    """
    Purchase credits
    POST /api/credits/purchase/

    Body:
    {
        "package_id": "uuid",
        "payment_method": "momo|orange_money|card",
        "phone_number": "+237XXXXXXXXX"  // for mobile money
    }
    """
    serializer = CreditPurchaseSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get client IP and user agent
    ip_address = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    metadata = {
        'ip_address': ip_address,
        'user_agent': user_agent,
        'phone_number': serializer.validated_data.get('phone_number', '')
    }

    # Process purchase
    success, transaction_obj, message = CreditService.purchase_credits(
        user=request.user,
        package_id=serializer.validated_data['package_id'],
        payment_method=serializer.validated_data['payment_method'],
        metadata=metadata
    )

    if success:
        return Response({
            'success': True,
            'message': message,
            'transaction': CreditTransactionSerializer(transaction_obj).data,
            'balance': CreditBalanceSerializer(request.user.credit_balance).data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def use_credits(request):
    """
    Use credits for an action
    POST /api/credits/use/

    Body:
    {
        "action": "view_property|list_property|featured_listing|contact_reveal",
        "reference_id": "property_id or other reference"
    }
    """
    serializer = CreditUsageSerializer(
        data=request.data,
        context={'request': request}
    )

    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get client IP
    ip_address = request.META.get('REMOTE_ADDR')
    metadata = {'ip_address': ip_address}

    # Use credits
    success, transaction_obj, message = CreditService.use_credits(
        user=request.user,
        action=serializer.validated_data['action'],
        reference_id=serializer.validated_data['reference_id'],
        metadata=metadata
    )

    if success:
        return Response({
            'success': True,
            'message': message,
            'transaction': CreditTransactionSerializer(transaction_obj).data,
            'balance': CreditBalanceSerializer(request.user.credit_balance).data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_property_access(request, property_id):
    """
    Check if user can access property details
    GET /api/credits/check-access/<property_id>/
    """
    has_access, reason = CreditService.check_property_access(
        user=request.user,
        property_id=property_id
    )

    credits_required = CreditPricing.get_price(CreditPricing.ACTION_VIEW_PROPERTY)

    return Response({
        'has_access': has_access,
        'reason': reason,
        'credits_required': float(credits_required),
        'current_balance': float(request.user.credit_balance.balance) if hasattr(request.user, 'credit_balance') else 0
    })


class CreditTransactionListView(generics.ListAPIView):
    """
    List user's credit transactions
    GET /api/credits/transactions/
    """
    serializer_class = CreditTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CreditTransaction.objects.filter(
            user=self.request.user
        ).select_related('package', 'user')

        # Filter by type
        transaction_type = self.request.query_params.get('type')
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)

        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset.order_by('-created_at')


class PropertyViewHistoryView(generics.ListAPIView):
    """
    List user's property view history
    GET /api/credits/property-views/
    """
    serializer_class = PropertyViewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PropertyView.objects.filter(
            user=self.request.user
        ).select_related('property', 'transaction').order_by('-viewed_at')


class CreditPricingListView(generics.ListAPIView):
    """
    List credit pricing rules
    GET /api/credits/pricing/
    """
    serializer_class = CreditPricingSerializer
    permission_classes = [AllowAny]
    queryset = CreditPricing.objects.filter(is_active=True)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def credit_statistics(request):
    """
    Get user's credit statistics
    GET /api/credits/statistics/
    """
    stats = CreditService.get_user_statistics(request.user)

    if stats:
        return Response(stats)
    else:
        return Response(
            {'error': 'Credit balance not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_momo_payment(request):
    """
    Initiate MTN Mobile Money payment
    POST /api/credits/payment/momo/initiate/

    Body:
    {
        "package_id": "uuid",
        "phone_number": "+237XXXXXXXXX"
    }
    """
    package_id = request.data.get('package_id')
    phone_number = request.data.get('phone_number')

    if not package_id or not phone_number:
        return Response({
            'error': 'package_id and phone_number are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        package = CreditPackage.objects.get(id=package_id, is_active=True)
    except CreditPackage.DoesNotExist:
        return Response({
            'error': 'Invalid credit package'
        }, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Integrate with MTN Mobile Money API
    # For now, return mock response

    payment_reference = f"MOMO-{timezone.now().strftime('%Y%m%d%H%M%S')}"

    return Response({
        'success': True,
        'message': 'Payment initiated. Please check your phone for the payment prompt.',
        'payment_reference': payment_reference,
        'amount': float(package.price),
        'currency': package.currency,
        'package': CreditPackageSerializer(package).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_momo_payment(request):
    """
    Verify MTN Mobile Money payment status
    POST /api/credits/payment/momo/verify/

    Body:
    {
        "payment_reference": "MOMO-XXXX",
        "package_id": "uuid"
    }
    """
    payment_reference = request.data.get('payment_reference')
    package_id = request.data.get('package_id')

    if not payment_reference or not package_id:
        return Response({
            'error': 'payment_reference and package_id are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Verify payment with MTN Mobile Money API
    # For now, simulate successful payment

    # Process credit purchase
    success, transaction_obj, message = CreditService.purchase_credits(
        user=request.user,
        package_id=package_id,
        payment_method='momo',
        payment_reference=payment_reference,
        metadata={
            'ip_address': request.META.get('REMOTE_ADDR'),
            'verified_at': timezone.now().isoformat()
        }
    )

    if success:
        return Response({
            'success': True,
            'message': 'Payment verified and credits added to your account',
            'transaction': CreditTransactionSerializer(transaction_obj).data,
            'balance': CreditBalanceSerializer(request.user.credit_balance).data
        })
    else:
        return Response({
            'success': False,
            'message': message
        }, status=status.HTTP_400_BAD_REQUEST)
