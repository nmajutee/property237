'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navigation/Navbar'
import { tariffService } from '@/services/tariffService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function SubscriptionsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { data: currentSub, isLoading: subLoading } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => tariffService.getCurrentSubscription(),
  })

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['subscription-usage'],
    queryFn: () => tariffService.getUsage(),
  })

  const { data: history } = useQuery({
    queryKey: ['upgrade-history'],
    queryFn: () => tariffService.getUpgradeHistory(),
  })

  const { data: subscriptions } = useQuery({
    queryKey: ['subscriptions-list'],
    queryFn: () => tariffService.getSubscriptions(),
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      tariffService.cancelSubscription(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions-list'] })
      setShowCancelModal(false)
    },
  })

  const sub: any = currentSub
  const usageData: any = usage
  const historyData: any[] = (history as any) || []
  const allSubs: any[] = (subscriptions as any) || []

  const loading = subLoading || usageLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your plan and billing</p>
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {sub?.plan ? 'Upgrade Plan' : 'View Plans'}
          </button>
        </div>

        {/* Current Plan */}
        {sub?.plan ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{sub.plan.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{sub.plan.plan_type} plan</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sub.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                sub.status === 'trial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {sub.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sub.plan.price} <span className="text-sm font-normal text-gray-500">{sub.plan.currency}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">/{sub.billing_cycle || sub.plan.billing_cycle}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sub.days_remaining ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Days Remaining</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sub.properties_used ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">of {sub.plan.max_properties} Properties</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sub.auto_renew ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-500 mt-1">Auto-Renew</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {sub.end_date && (
                  <span>Renewal: {new Date(sub.end_date).toLocaleDateString()}</span>
                )}
              </div>
              {sub.status === 'active' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No active subscription</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Subscribe to a plan to list properties and access premium features</p>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Plans
            </button>
          </div>
        )}

        {/* Plan Limits / Usage */}
        {sub?.plan && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan Limits &amp; Usage</h3>
            <div className="space-y-4">
              {[
                { label: 'Properties', used: sub.properties_used ?? 0, max: sub.plan.max_properties },
                { label: 'Photos per property', used: sub.photos_used ?? 0, max: sub.plan.max_photos_per_property },
                { label: 'Videos per property', used: sub.videos_used ?? 0, max: sub.plan.max_videos_per_property },
              ].map(({ label, used, max }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="text-gray-500 dark:text-gray-400">{used} / {max}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        max > 0 && used / max > 0.8 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${max > 0 ? Math.min((used / max) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Feature flags */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {[
                { label: 'Analytics', enabled: sub.plan.basic_analytics },
                { label: 'Advanced Analytics', enabled: sub.plan.advanced_analytics },
                { label: 'API Access', enabled: sub.plan.api_access },
                { label: 'Phone Support', enabled: sub.plan.phone_support },
                { label: 'Priority Support', enabled: sub.plan.priority_support },
                { label: 'Email Marketing', enabled: sub.plan.email_marketing },
              ].map(({ label, enabled }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span className={enabled ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}>
                    {enabled ? '✓' : '✗'}
                  </span>
                  <span className={enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage History */}
        {usageData && Array.isArray(usageData) && usageData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Usage</h3>
            <div className="space-y-2">
              {(usageData as any[]).slice(0, 10).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{item.usage_type?.replace('_', ' ')}</p>
                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing History */}
        {allSubs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">Plan</th>
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allSubs.map((s: any) => (
                    <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-3 text-gray-900 dark:text-white">{s.plan?.name || '—'}</td>
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{s.amount_paid} {s.currency}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          s.status === 'active' ? 'bg-green-100 text-green-800' :
                          s.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{s.status}</span>
                      </td>
                      <td className="py-2 px-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plan Change History */}
        {historyData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upgrade History</h3>
            <div className="space-y-3">
              {historyData.map((change: any) => (
                <div key={change.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {change.from_plan?.name || '—'} → {change.to_plan?.name || '—'}
                    </p>
                    <p className="text-xs text-gray-500">{change.change_type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(change.requested_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && sub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cancel Subscription</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to cancel your <strong>{sub.plan.name}</strong> subscription?
              You will lose access to premium features at the end of your billing period.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Keep Plan
              </button>
              <button
                onClick={() => cancelMutation.mutate({ id: sub.id, reason: cancelReason })}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
