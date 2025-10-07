"""
Credit System Services
Business logic for credit operations
"""
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid
from .models import (
    CreditBalance,
    CreditPackage,
    CreditTransaction,
    CreditPricing,
    PropertyView
)

User = get_user_model()


class CreditService:
    """Service class for credit operations"""

    @staticmethod
    @transaction.atomic
    def purchase_credits(user, package_id, payment_method, payment_reference=None, metadata=None):
        """
        Process credit purchase
        Returns: (success: bool, transaction: CreditTransaction, message: str)
        """
        try:
            # Get package
            package = CreditPackage.objects.select_for_update().get(
                id=package_id,
                is_active=True
            )

            # Get or create credit balance
            balance, _ = CreditBalance.objects.select_for_update().get_or_create(
                user=user
            )

            # Calculate credits to add
            credits_to_add = Decimal(str(package.total_credits))
            balance_before = balance.balance

            # Create transaction record (pending)
            transaction_obj = CreditTransaction.objects.create(
                user=user,
                transaction_type=CreditTransaction.PURCHASE,
                amount=credits_to_add,
                status=CreditTransaction.STATUS_PENDING,
                balance_before=balance_before,
                balance_after=balance_before + credits_to_add,
                description=f"Purchase of {package.name} package",
                package=package,
                payment_method=payment_method,
                payment_reference=payment_reference or str(uuid.uuid4()),
                payment_amount=package.price,
                payment_currency=package.currency,
                metadata=metadata or {}
            )

            # Add credits to balance
            new_balance = balance.add_credits(
                amount=credits_to_add,
                transaction_type=CreditTransaction.PURCHASE,
                description=f"Purchase of {package.name} package"
            )

            # Update transaction to completed
            transaction_obj.status = CreditTransaction.STATUS_COMPLETED
            transaction_obj.completed_at = timezone.now()
            transaction_obj.balance_after = new_balance
            transaction_obj.save()

            return True, transaction_obj, "Credits purchased successfully"

        except CreditPackage.DoesNotExist:
            return False, None, "Invalid credit package"
        except Exception as e:
            return False, None, f"Purchase failed: {str(e)}"

    @staticmethod
    @transaction.atomic
    def use_credits(user, action, reference_id, metadata=None):
        """
        Deduct credits for an action
        Returns: (success: bool, transaction: CreditTransaction, message: str)
        """
        try:
            # Get credit balance
            balance = CreditBalance.objects.select_for_update().get(user=user)

            # Get required credits
            credits_required = CreditPricing.get_price(action)

            # Check sufficient balance
            if not balance.has_credits(credits_required):
                return False, None, f"Insufficient credits. Required: {credits_required}, Available: {balance.balance}"

            # For property views, check if already viewed
            if action == CreditPricing.ACTION_VIEW_PROPERTY:
                if PropertyView.objects.filter(user=user, property_id=reference_id).exists():
                    return False, None, "You have already viewed this property"

            balance_before = balance.balance

            # Create transaction record
            transaction_obj = CreditTransaction.objects.create(
                user=user,
                transaction_type=CreditTransaction.USAGE,
                amount=-credits_required,
                status=CreditTransaction.STATUS_COMPLETED,
                balance_before=balance_before,
                balance_after=balance_before - credits_required,
                description=f"Credits used for: {action}",
                reference_id=reference_id,
                metadata=metadata or {},
                completed_at=timezone.now()
            )

            # Deduct credits
            new_balance = balance.deduct_credits(
                amount=credits_required,
                transaction_type=CreditTransaction.USAGE,
                description=f"Credits used for: {action}"
            )

            # Update transaction balance
            transaction_obj.balance_after = new_balance
            transaction_obj.save()

            # Record property view if applicable
            if action == CreditPricing.ACTION_VIEW_PROPERTY:
                PropertyView.objects.create(
                    user=user,
                    property_id=reference_id,
                    transaction=transaction_obj,
                    ip_address=metadata.get('ip_address') if metadata else None
                )

            return True, transaction_obj, "Credits deducted successfully"

        except CreditBalance.DoesNotExist:
            return False, None, "Credit balance not found"
        except ValueError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Credit usage failed: {str(e)}"

    @staticmethod
    @transaction.atomic
    def refund_credits(user, transaction_id, reason=""):
        """
        Refund credits from a transaction
        Returns: (success: bool, refund_transaction: CreditTransaction, message: str)
        """
        try:
            # Get original transaction
            original_txn = CreditTransaction.objects.select_for_update().get(
                id=transaction_id,
                user=user,
                transaction_type=CreditTransaction.USAGE,
                status=CreditTransaction.STATUS_COMPLETED
            )

            # Get credit balance
            balance = CreditBalance.objects.select_for_update().get(user=user)

            # Calculate refund amount (positive value)
            refund_amount = abs(original_txn.amount)
            balance_before = balance.balance

            # Create refund transaction
            refund_txn = CreditTransaction.objects.create(
                user=user,
                transaction_type=CreditTransaction.REFUND,
                amount=refund_amount,
                status=CreditTransaction.STATUS_COMPLETED,
                balance_before=balance_before,
                balance_after=balance_before + refund_amount,
                description=f"Refund for transaction {transaction_id}: {reason}",
                reference_id=str(original_txn.id),
                completed_at=timezone.now()
            )

            # Add credits back
            new_balance = balance.add_credits(
                amount=refund_amount,
                transaction_type=CreditTransaction.REFUND,
                description=f"Refund: {reason}"
            )

            # Update refund transaction
            refund_txn.balance_after = new_balance
            refund_txn.save()

            return True, refund_txn, "Credits refunded successfully"

        except CreditTransaction.DoesNotExist:
            return False, None, "Original transaction not found"
        except Exception as e:
            return False, None, f"Refund failed: {str(e)}"

    @staticmethod
    def check_property_access(user, property_id):
        """
        Check if user has access to view property details
        Returns: (has_access: bool, reason: str)
        """
        # Check if user has already viewed
        if PropertyView.objects.filter(user=user, property_id=property_id).exists():
            return True, "already_viewed"

        # Check if user has sufficient credits
        try:
            balance = user.credit_balance
            credits_required = CreditPricing.get_price(CreditPricing.ACTION_VIEW_PROPERTY)

            if balance.has_credits(credits_required):
                return True, "sufficient_credits"
            else:
                return False, f"insufficient_credits"
        except CreditBalance.DoesNotExist:
            return False, "no_balance"

    @staticmethod
    def get_user_statistics(user):
        """Get user credit statistics"""
        try:
            balance = user.credit_balance

            # Get transaction counts
            purchase_count = CreditTransaction.objects.filter(
                user=user,
                transaction_type=CreditTransaction.PURCHASE,
                status=CreditTransaction.STATUS_COMPLETED
            ).count()

            usage_count = CreditTransaction.objects.filter(
                user=user,
                transaction_type=CreditTransaction.USAGE,
                status=CreditTransaction.STATUS_COMPLETED
            ).count()

            properties_viewed = PropertyView.objects.filter(user=user).count()

            return {
                'balance': float(balance.balance),
                'total_purchased': float(balance.total_purchased),
                'total_spent': float(balance.total_spent),
                'total_earned': float(balance.total_earned),
                'purchase_count': purchase_count,
                'usage_count': usage_count,
                'properties_viewed': properties_viewed,
                'last_purchase': balance.last_purchase_at
            }
        except CreditBalance.DoesNotExist:
            return None
