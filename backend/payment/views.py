from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    PaymentMethod, Currency, Transaction, PaymentAccount,
    Invoice, Refund, WalletBalance
)
from .serializers import (
    PaymentMethodSerializer, CurrencySerializer, TransactionSerializer,
    TransactionCreateSerializer, PaymentAccountSerializer,
    InvoiceSerializer, RefundSerializer, WalletBalanceSerializer
)


class PaymentMethodListAPIView(generics.ListAPIView):
    """List active payment methods"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [AllowAny]
    queryset = PaymentMethod.objects.filter(is_active=True)


class CurrencyListAPIView(generics.ListAPIView):
    """List active currencies"""
    serializer_class = CurrencySerializer
    permission_classes = [AllowAny]
    queryset = Currency.objects.filter(is_active=True)


class TransactionListAPIView(generics.ListAPIView):
    """List user's transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user).order_by('-created_at')
        tx_type = self.request.query_params.get('type')
        if tx_type:
            qs = qs.filter(transaction_type=tx_type)
        tx_status = self.request.query_params.get('status')
        if tx_status:
            qs = qs.filter(status=tx_status)
        return qs


class TransactionDetailAPIView(generics.RetrieveAPIView):
    """Get transaction detail"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'transaction_id'

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionCreateAPIView(generics.CreateAPIView):
    """Initiate a transaction"""
    serializer_class = TransactionCreateSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_transaction(request, transaction_id):
    """Verify/confirm a pending transaction (simulated gateway callback)"""
    txn = get_object_or_404(Transaction, transaction_id=transaction_id, user=request.user)
    if txn.status != 'pending':
        return Response({'error': f'Transaction is {txn.status}, cannot verify'}, status=status.HTTP_400_BAD_REQUEST)
    # In production, verify with gateway API
    txn.status = 'completed'
    txn.processed_at = timezone.now()
    txn.save(update_fields=['status', 'processed_at'])
    return Response(TransactionSerializer(txn).data)


# Payment Accounts
class PaymentAccountListCreateAPIView(generics.ListCreateAPIView):
    """List and create user payment accounts"""
    serializer_class = PaymentAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentAccount.objects.filter(user=self.request.user, is_active=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentAccountDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete payment account"""
    serializer_class = PaymentAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentAccount.objects.filter(user=self.request.user)


# Invoices
class InvoiceListAPIView(generics.ListAPIView):
    """List user's invoices"""
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user).order_by('-created_at')


class InvoiceDetailAPIView(generics.RetrieveAPIView):
    """Get invoice detail"""
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'invoice_number'

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


# Refunds
class RefundCreateAPIView(generics.CreateAPIView):
    """Request a refund"""
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        txn = serializer.validated_data['transaction']
        if txn.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only request refunds for your own transactions")
        serializer.save()


class RefundListAPIView(generics.ListAPIView):
    """List user's refund requests"""
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Refund.objects.filter(transaction__user=self.request.user).order_by('-requested_at')


# Wallet
class WalletBalanceAPIView(generics.ListAPIView):
    """Get user's wallet balances"""
    serializer_class = WalletBalanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WalletBalance.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_summary(request):
    """Get payment summary for dashboard"""
    from django.db.models import Sum, Count
    txns = Transaction.objects.filter(user=request.user)
    completed = txns.filter(status='completed')
    return Response({
        'total_transactions': txns.count(),
        'total_spent': str(completed.aggregate(total=Sum('total_amount'))['total'] or 0),
        'pending_count': txns.filter(status='pending').count(),
        'completed_count': completed.count(),
        'failed_count': txns.filter(status='failed').count(),
    })
