import apiClient from './api'

export interface TariffPlan {
  id: string | number
  name: string
  slug: string
  tier: 'free' | 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  currency: string
  billing_cycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'lifetime'
  max_properties: number
  max_photos_per_property: number
  max_videos_per_property: number
  featured_listings_count: number
  analytics_level: 'basic' | 'standard' | 'advanced' | 'full'
  support_tier: 'email' | 'phone' | 'priority'
  api_access: boolean
  is_active: boolean
  description?: string
}

export interface AdPackage {
  id: string | number
  name: string
  package_type: 'featured' | 'priority' | 'social_media' | 'email_marketing' | 'analytics'
  price: number
  currency: string
  duration_days: number
  placement: string[]
  is_active: boolean
  description?: string
}

export interface AdCampaign {
  id: string | number
  package: string | number
  property: string | number
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  start_date: string
  end_date: string
  budget: number
  spent: number
  created_at: string
}

export const tariffService = {
  getCategories: () =>
    apiClient.get('/tariffs/categories/'),

  getPlans: (filters?: { category?: number; type?: string; billing?: string }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', String(filters.category))
    if (filters?.type) params.set('type', filters.type)
    if (filters?.billing) params.set('billing', filters.billing)
    const query = params.toString()
    return apiClient.get<TariffPlan[]>(`/tariffs/plans/${query ? `?${query}` : ''}`)
  },

  getPlan: (slug: string) =>
    apiClient.get<TariffPlan>(`/tariffs/plans/${slug}/`),

  comparePlans: (ids?: number[]) => {
    const query = ids ? `?ids=${ids.join(',')}` : ''
    return apiClient.get(`/tariffs/plans/compare/${query}`)
  },

  getFeatures: () =>
    apiClient.get('/tariffs/features/'),

  // Subscriptions
  getSubscriptions: () =>
    apiClient.get('/tariffs/subscriptions/'),

  getCurrentSubscription: () =>
    apiClient.get('/tariffs/subscriptions/current/'),

  subscribe: (planId: number, billingCycle?: string, autoRenew?: boolean) =>
    apiClient.post('/tariffs/subscriptions/subscribe/', {
      plan_id: planId,
      billing_cycle: billingCycle || 'monthly',
      auto_renew: autoRenew ?? true,
    }),

  cancelSubscription: (id: number, reason?: string) =>
    apiClient.post(`/tariffs/subscriptions/${id}/cancel/`, { reason }),

  upgradePlan: (planId: number, reason?: string) =>
    apiClient.post('/tariffs/subscriptions/upgrade/', { plan_id: planId, reason }),

  getUsage: () =>
    apiClient.get('/tariffs/usage/'),

  getUpgradeHistory: () =>
    apiClient.get('/tariffs/upgrade-history/'),
}

export const adService = {
  getPackages: () =>
    apiClient.get<AdPackage[]>('/ads/packages/'),

  getCampaigns: () =>
    apiClient.get<AdCampaign[]>('/ads/campaigns/'),

  createCampaign: (data: {
    package_id: string | number
    property_id: string | number
  }) =>
    apiClient.post<AdCampaign>('/ads/campaigns/', data),

  getCampaign: (id: string | number) =>
    apiClient.get<AdCampaign>(`/ads/campaigns/${id}/`),

  cancelCampaign: (id: string | number) =>
    apiClient.patch<AdCampaign>(`/ads/campaigns/${id}/`, {
      status: 'cancelled',
    }),

  getPromotedProperties: (type?: string) => {
    const query = type ? `?type=${type}` : ''
    return apiClient.get(`/ads/promoted/${query}`)
  },

  getActiveBanners: (placement?: string) => {
    const query = placement ? `?placement=${placement}` : ''
    return apiClient.get(`/ads/banners/${query}`)
  },

  getActiveAds: (placement?: string) => {
    const query = placement ? `?placement=${placement}` : ''
    return apiClient.get(`/ads/active/${query}`)
  },

  recordImpression: (adId: string | number) =>
    apiClient.post(`/ads/${adId}/impression/`, {}),

  recordClick: (adId: string | number) =>
    apiClient.post(`/ads/${adId}/click/`, {}),
}
