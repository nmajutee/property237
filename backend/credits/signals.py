"""
Credit System Signals
Auto-create credit balance for new users
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import CreditBalance, CreditTransaction, CreditPricing
from decimal import Decimal

User = get_user_model()


@receiver(post_save, sender=User)
def create_credit_balance(sender, instance, created, **kwargs):
    """
    Create credit balance when user is created
    Award welcome bonus if configured
    """
    if created:
        balance = CreditBalance.objects.create(user=instance)

        # Award welcome bonus (configure as needed)
        WELCOME_BONUS = Decimal('5.00')  # 5 free credits for new users

        if WELCOME_BONUS > 0:
            balance.add_credits(
                amount=WELCOME_BONUS,
                transaction_type=CreditTransaction.BONUS,
                description="Welcome bonus"
            )

            # Create transaction record
            CreditTransaction.objects.create(
                user=instance,
                transaction_type=CreditTransaction.BONUS,
                amount=WELCOME_BONUS,
                status=CreditTransaction.STATUS_COMPLETED,
                balance_before=Decimal('0.00'),
                balance_after=WELCOME_BONUS,
                description="Welcome bonus for new user",
                payment_method="system"
            )


@receiver(post_save, sender=CreditPricing)
def create_default_pricing(sender, instance, created, **kwargs):
    """
    Ensure default pricing rules exist
    """
    if created:
        defaults = [
            {
                'action': CreditPricing.ACTION_VIEW_PROPERTY,
                'credits_required': Decimal('1.00'),
                'description': '1 credit to view full property details including contact information'
            },
            {
                'action': CreditPricing.ACTION_LIST_PROPERTY,
                'credits_required': Decimal('5.00'),
                'description': '5 credits to list a property (unlimited duration)'
            },
            {
                'action': CreditPricing.ACTION_FEATURED_LISTING,
                'credits_required': Decimal('2.00'),
                'description': '2 credits per day for featured listing (higher visibility)'
            },
            {
                'action': CreditPricing.ACTION_CONTACT_REVEAL,
                'credits_required': Decimal('0.50'),
                'description': '0.5 credits to reveal contact information only'
            },
        ]

        for default in defaults:
            CreditPricing.objects.get_or_create(
                action=default['action'],
                defaults={
                    'credits_required': default['credits_required'],
                    'description': default['description'],
                    'is_active': True
                }
            )
