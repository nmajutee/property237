from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import (
    TariffCategory, TariffPlan, PlanFeature,
    UserSubscription, SubscriptionUsage, PlanUpgrade
)
from .serializers import (
    TariffCategorySerializer, TariffPlanSerializer, TariffPlanListSerializer,
    PlanFeatureSerializer, UserSubscriptionSerializer, SubscribeSerializer,
    SubscriptionUsageSerializer, PlanUpgradeSerializer
)


class TariffCategoryListAPIView(generics.ListAPIView):
    """List tariff categories"""
    serializer_class = TariffCategorySerializer
    permission_classes = [AllowAny]
    queryset = TariffCategory.objects.filter(is_active=True).order_by('display_order')


class TariffPlanListAPIView(generics.ListAPIView):
    """List active tariff plans"""
    serializer_class = TariffPlanListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = TariffPlan.objects.filter(is_active=True, is_public=True).order_by('display_order', 'price')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category_id=category)
        plan_type = self.request.query_params.get('type')
        if plan_type:
            qs = qs.filter(plan_type=plan_type)
        billing = self.request.query_params.get('billing')
        if billing:
            qs = qs.filter(billing_cycle=billing)
        return qs


class TariffPlanDetailAPIView(generics.RetrieveAPIView):
    """Get plan details with features"""
    serializer_class = TariffPlanSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = TariffPlan.objects.filter(is_active=True)


class PlanFeatureListAPIView(generics.ListAPIView):
    """List plan features for comparison"""
    serializer_class = PlanFeatureSerializer
    permission_classes = [AllowAny]
    queryset = PlanFeature.objects.all().order_by('category', 'display_order')


# Subscriptions
class UserSubscriptionListAPIView(generics.ListAPIView):
    """List user's subscriptions"""
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user).order_by('-created_at')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_subscription(request):
    """Get current active subscription"""
    sub = UserSubscription.objects.filter(
        user=request.user, status__in=['active', 'trial']
    ).order_by('-created_at').first()
    if not sub:
        return Response({'subscription': None, 'message': 'No active subscription'})
    return Response(UserSubscriptionSerializer(sub).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe(request):
    """Subscribe to a plan"""
    serializer = SubscribeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    plan = get_object_or_404(TariffPlan, id=data['plan_id'], is_active=True)

    # Check if user already has active subscription
    existing = UserSubscription.objects.filter(
        user=request.user, status__in=['active', 'trial']
    ).first()
    if existing:
        return Response(
            {'error': 'You already have an active subscription. Upgrade or cancel first.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate dates
    cycle_months = {
        'monthly': 1, 'quarterly': 3, 'semi_annual': 6,
        'annual': 12, 'lifetime': 1200,
    }
    months = cycle_months.get(data['billing_cycle'], 1)
    now = timezone.now()
    end_date = now + timedelta(days=months * 30)

    sub_status = 'active'
    trial_end = None
    if plan.trial_days > 0:
        sub_status = 'trial'
        trial_end = now + timedelta(days=plan.trial_days)

    subscription = UserSubscription.objects.create(
        user=request.user,
        plan=plan,
        status=sub_status,
        start_date=now,
        end_date=end_date,
        trial_end_date=trial_end,
        next_billing_date=end_date,
        amount_paid=plan.price + plan.setup_fee,
        currency=plan.currency,
        billing_cycle=data['billing_cycle'],
        auto_renew=data['auto_renew'],
    )

    return Response(
        UserSubscriptionSerializer(subscription).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request, pk):
    """Cancel a subscription"""
    sub = get_object_or_404(UserSubscription, pk=pk, user=request.user)
    if sub.status in ['cancelled', 'expired']:
        return Response({'error': 'Subscription is already cancelled/expired'}, status=status.HTTP_400_BAD_REQUEST)
    sub.status = 'cancelled'
    sub.cancelled_at = timezone.now()
    sub.cancellation_reason = request.data.get('reason', '')
    sub.auto_renew = False
    sub.save(update_fields=['status', 'cancelled_at', 'cancellation_reason', 'auto_renew'])
    return Response(UserSubscriptionSerializer(sub).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_plan(request):
    """Upgrade or downgrade plan"""
    new_plan_id = request.data.get('plan_id')
    if not new_plan_id:
        return Response({'error': 'plan_id required'}, status=status.HTTP_400_BAD_REQUEST)

    current_sub = UserSubscription.objects.filter(
        user=request.user, status__in=['active', 'trial']
    ).first()
    if not current_sub:
        return Response({'error': 'No active subscription to upgrade from'}, status=status.HTTP_400_BAD_REQUEST)

    new_plan = get_object_or_404(TariffPlan, id=new_plan_id, is_active=True)

    change_type = 'upgrade' if new_plan.price > current_sub.plan.price else 'downgrade'

    # Record the upgrade
    PlanUpgrade.objects.create(
        user=request.user,
        from_plan=current_sub.plan,
        to_plan=new_plan,
        change_type=change_type,
        effective_date=timezone.now(),
        reason=request.data.get('reason', ''),
    )

    # Update subscription
    current_sub.plan = new_plan
    current_sub.save(update_fields=['plan'])

    return Response({
        'message': f'Plan {change_type}d successfully',
        'subscription': UserSubscriptionSerializer(current_sub).data
    })


class SubscriptionUsageListAPIView(generics.ListAPIView):
    """List subscription usage logs"""
    serializer_class = SubscriptionUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SubscriptionUsage.objects.filter(
            subscription__user=self.request.user
        ).order_by('-created_at')


class PlanUpgradeHistoryAPIView(generics.ListAPIView):
    """List plan upgrade/downgrade history"""
    serializer_class = PlanUpgradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PlanUpgrade.objects.filter(user=self.request.user).order_by('-requested_at')


@api_view(['GET'])
@permission_classes([AllowAny])
def compare_plans(request):
    """Compare plans side by side"""
    plan_ids = request.query_params.get('ids', '')
    if plan_ids:
        ids = [int(i) for i in plan_ids.split(',') if i.isdigit()]
        plans = TariffPlan.objects.filter(id__in=ids, is_active=True)
    else:
        plans = TariffPlan.objects.filter(is_active=True, is_public=True).order_by('display_order')

    return Response(TariffPlanSerializer(plans, many=True).data)
