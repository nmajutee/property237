from django.urls import path
from . import views

app_name = 'credits'

urlpatterns = [
    # Credit Balance
    path('balance/', views.CreditBalanceView.as_view(), name='credit-balance'),
    path('statistics/', views.credit_statistics, name='credit-statistics'),

    # Credit Packages
    path('packages/', views.CreditPackageListView.as_view(), name='credit-packages'),
    path('pricing/', views.CreditPricingListView.as_view(), name='credit-pricing'),

    # Purchase & Usage
    path('purchase/', views.purchase_credits, name='purchase-credits'),
    path('use/', views.use_credits, name='use-credits'),

    # Property Access
    path('check-access/<int:property_id>/', views.check_property_access, name='check-property-access'),
    path('property-views/', views.PropertyViewHistoryView.as_view(), name='property-views'),

    # Transactions
    path('transactions/', views.CreditTransactionListView.as_view(), name='credit-transactions'),

    # Mobile Money Payments
    path('payment/momo/initiate/', views.initiate_momo_payment, name='momo-initiate'),
    path('payment/momo/verify/', views.verify_momo_payment, name='momo-verify'),

    # Referrals
    path('referral/', views.get_referral_code, name='referral-code'),
    path('referral/stats/', views.referral_stats, name='referral-stats'),
    path('referral/apply/', views.apply_referral_code, name='referral-apply'),
]
