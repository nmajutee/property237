'use client'

import { useState } from 'react'
import { adService } from '@/services/tariffService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function AdsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ package_id: '', property_id: '' })
  const queryClient = useQueryClient()

  const { data: packages } = useQuery({
    queryKey: ['ad-packages'],
    queryFn: () => adService.getPackages(),
  })
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['ad-campaigns'],
    queryFn: () => adService.getCampaigns(),
  })

  const createCampaign = useMutation({
    mutationFn: (data: any) => adService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-campaigns'] })
      setShowCreate(false)
      setForm({ package_id: '', property_id: '' })
    },
  })

  const pkgList = (packages as any) || []
  const campaigns = (campaignsData as any)?.results || campaignsData || []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-blue-100 text-blue-700',
      expired: 'bg-gray-100 text-gray-600',
      paused: 'bg-orange-100 text-orange-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Advertising</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Campaign
          </button>
        </div>

        {/* Ad packages */}
        <h2 className="text-lg font-semibold mb-3">Available Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(pkgList as any[]).map((pkg: any) => (
            <div key={pkg.id} className={`bg-white rounded shadow p-4 ${pkg.is_popular ? 'border-2 border-yellow-400' : ''}`}>
              <h3 className="font-semibold">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{pkg.price} {pkg.currency}</p>
                  <p className="text-xs text-gray-500">{pkg.duration_days} days</p>
                </div>
                <div className="text-xs space-y-0.5 text-right">
                  {pkg.featured_listing && <p>✅ Featured</p>}
                  {pkg.priority_placement && <p>✅ Priority</p>}
                  {pkg.social_media_boost && <p>✅ Social Media</p>}
                  {pkg.analytics_access && <p>✅ Analytics</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create campaign form */}
        {showCreate && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Create Campaign</h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.package_id}
                onChange={(e) => setForm({ ...form, package_id: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Package</option>
                {(pkgList as any[]).map((pkg: any) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price} {pkg.currency}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Property ID"
                value={form.property_id}
                onChange={(e) => setForm({ ...form, property_id: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={() => createCampaign.mutate({
                package_id: parseInt(form.package_id),
                property_id: parseInt(form.property_id),
              })}
              disabled={createCampaign.isPending || !form.package_id || !form.property_id}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        )}

        {/* My campaigns */}
        <h2 className="text-lg font-semibold mb-3">My Campaigns</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : campaigns.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            No campaigns yet. Create one to promote your property!
          </div>
        ) : (
          <div className="space-y-3">
            {(campaigns as any[]).map((campaign: any) => (
              <div key={campaign.id} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.title || `Campaign #${campaign.id}`}</h3>
                    <p className="text-sm text-gray-500">
                      {campaign.start_date} → {campaign.end_date}
                    </p>
                    <div className="flex gap-3 mt-2 text-sm">
                      <span>👁 {campaign.impressions || 0} views</span>
                      <span>👆 {campaign.clicks || 0} clicks</span>
                      <span>📊 CTR: {campaign.click_through_rate?.toFixed(1) || '0'}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    <p className="text-sm font-medium mt-1">{campaign.total_cost} {campaign.currency}</p>
                    <span className={`text-xs ${campaign.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {campaign.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
