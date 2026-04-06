'use client'

import { useState } from 'react'
import { tariffService } from '@/services/tariffService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function PricingPage() {
  const [billingFilter, setBillingFilter] = useState('monthly')
  const queryClient = useQueryClient()

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['tariff-plans', billingFilter],
    queryFn: () => tariffService.getPlans({ billing: billingFilter }),
  })
  const { data: currentSub } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => tariffService.getCurrentSubscription(),
  })

  const subscribeMutation = useMutation({
    mutationFn: ({ planId, billing }: { planId: number; billing: string }) =>
      tariffService.subscribe(planId, billing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] })
    },
  })

  const plans = (plansData as any) || []
  const subscription: any = (currentSub as any)?.plan ? currentSub : null

  const getPlanColor = (type: string) => {
    const colors: Record<string, string> = {
      free: 'border-gray-200',
      basic: 'border-blue-300',
      standard: 'border-green-300',
      premium: 'border-yellow-400 shadow-lg',
      enterprise: 'border-purple-400',
    }
    return colors[type] || 'border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pricing Plans</h1>
          <p className="text-gray-500">Choose the plan that fits your needs</p>

          {/* Billing toggle */}
          <div className="flex justify-center gap-2 mt-4">
            {['monthly', 'quarterly', 'annual'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingFilter(cycle)}
                className={`px-4 py-2 rounded text-sm ${
                  billingFilter === cycle ? 'bg-green-600 text-white' : 'bg-white border'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Current subscription banner */}
        {subscription && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-center">
            <p className="text-green-700">
              Current Plan: <strong>{(subscription as any).plan?.name}</strong> •
              Status: {(subscription as any).status} •
              {(subscription as any).days_remaining} days remaining
            </p>
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-gray-500">Loading plans...</p>
        ) : (plans as any[]).length === 0 ? (
          <p className="text-center text-gray-500">No plans available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(plans as any[]).map((plan: any) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg border-2 p-6 relative ${getPlanColor(plan.plan_type)}`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                {plan.badge_text && (
                  <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    {plan.badge_text}
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.plan_type}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm"> {plan.currency}/{plan.billing_cycle}</span>
                  {plan.original_price && plan.discount_percentage > 0 && (
                    <div className="text-sm">
                      <span className="line-through text-gray-400">{plan.original_price}</span>
                      <span className="text-green-600 ml-1">-{plan.discount_percentage}%</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 text-sm mb-6">
                  <li>🏠 {plan.max_properties} properties</li>
                  {plan.max_photos_per_property && <li>📷 {plan.max_photos_per_property} photos/property</li>}
                  {plan.max_ad_campaigns > 0 && <li>📢 {plan.max_ad_campaigns} ad campaigns</li>}
                  {plan.basic_analytics && <li>📊 Analytics</li>}
                  {plan.email_support && <li>📧 Email support</li>}
                  {plan.phone_support && <li>📞 Phone support</li>}
                  {plan.priority_support && <li>⚡ Priority support</li>}
                  {plan.api_access && <li>🔗 API access</li>}
                </ul>

                <button
                  onClick={() => subscribeMutation.mutate({ planId: plan.id, billing: billingFilter })}
                  disabled={subscribeMutation.isPending}
                  className={`w-full py-2 rounded font-medium ${
                    plan.is_popular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-green-600 text-green-600 hover:bg-green-50'
                  } disabled:opacity-50`}
                >
                  {subscribeMutation.isPending ? 'Processing...' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
