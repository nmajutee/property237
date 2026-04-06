from django.urls import path
from . import views

app_name = 'payment'

urlpatterns = [
    # Payment methods & currencies
    path('methods/', views.PaymentMethodListAPIView.as_view(), name='payment-methods'),
    path('currencies/', views.CurrencyListAPIView.as_view(), name='currencies'),

    # Transactions
    path('transactions/', views.TransactionListAPIView.as_view(), name='transaction-list'),
    path('transactions/create/', views.TransactionCreateAPIView.as_view(), name='transaction-create'),
    path('transactions/<str:transaction_id>/', views.TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('transactions/<str:transaction_id>/verify/', views.verify_transaction, name='transaction-verify'),

    # Payment accounts
    path('accounts/', views.PaymentAccountListCreateAPIView.as_view(), name='account-list-create'),
    path('accounts/<int:pk>/', views.PaymentAccountDetailAPIView.as_view(), name='account-detail'),

    # Invoices
    path('invoices/', views.InvoiceListAPIView.as_view(), name='invoice-list'),
    path('invoices/<str:invoice_number>/', views.InvoiceDetailAPIView.as_view(), name='invoice-detail'),

    # Refunds
    path('refunds/', views.RefundListAPIView.as_view(), name='refund-list'),
    path('refunds/create/', views.RefundCreateAPIView.as_view(), name='refund-create'),

    # Wallet
    path('wallet/', views.WalletBalanceAPIView.as_view(), name='wallet-balance'),

    # Dashboard summary
    path('summary/', views.payment_summary, name='payment-summary'),
]