import apiClient from './api'
import type { CreditBalance, CreditPackage, CreditTransaction, CreditPricing, CreditStatistics } from '@/types/api'

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(
    ([, v]: [string, any]) => v !== undefined && v !== null && v !== ''
  )
  if (filtered.length === 0) return ''
  return '?' + new URLSearchParams(filtered.map(([k, v]: [string, any]) => [k, String(v)])).toString()
}

export const creditService = {
  getBalance: () =>
    apiClient.get<CreditBalance>('/credits/balance/'),

  getStatistics: () =>
    apiClient.get<CreditStatistics>('/credits/statistics/'),

  getPackages: () =>
    apiClient.get<CreditPackage[]>('/credits/packages/'),

  getPricing: () =>
    apiClient.get<CreditPricing[]>('/credits/pricing/'),

  purchase: (data: {
    package_id: string
    payment_method: 'momo' | 'orange_money' | 'card'
    phone_number?: string
  }) =>
    apiClient.post<{
      success: boolean
      message: string
      transaction: CreditTransaction
      balance: CreditBalance
    }>('/credits/purchase/', data),

  useCredits: (data: {
    action: 'view_property' | 'list_property' | 'featured_listing' | 'contact_reveal'
    reference_id: string
  }) =>
    apiClient.post<{
      success: boolean
      message: string
      transaction: CreditTransaction
      balance: CreditBalance
    }>('/credits/use/', data),

  checkPropertyAccess: (propertyId: string | number) =>
    apiClient.get<{
      has_access: boolean
      reason: string
      credits_required: number
      current_balance: number
    }>(`/credits/check-access/${propertyId}/`),

  getTransactions: (filters?: { type?: string; status?: string }) =>
    apiClient.get<CreditTransaction[]>(
      `/credits/transactions/${buildQuery(filters || {})}`
    ),

  getPropertyViews: () =>
    apiClient.get('/credits/property-views/'),

  initiateMomoPayment: (data: { package_id: string; phone_number: string }) =>
    apiClient.post<{
      success: boolean
      message: string
      payment_reference: string
      amount: number
      currency: string
      package: CreditPackage
    }>('/credits/payment/momo/initiate/', data),

  verifyMomoPayment: (data: { payment_reference: string; package_id: string }) =>
    apiClient.post<{
      success: boolean
      message: string
      transaction: CreditTransaction
      balance: CreditBalance
    }>('/credits/payment/momo/verify/', data),

  // Referrals
  getReferralCode: () =>
    apiClient.get<{
      id: number
      code: string
      status: string
      referrer_bonus: string
      referee_bonus: string
    }>('/credits/referral/'),

  getReferralStats: () =>
    apiClient.get<{
      completed: number
      pending: number
      total_earned: string
      referrals: Array<{
        id: number
        code: string
        status: string
        referrer_email: string
        referred_email: string | null
        referrer_bonus: string
        referee_bonus: string
        created_at: string
        completed_at: string | null
      }>
    }>('/credits/referral/stats/'),

  applyReferralCode: (data: { code: string; user_id: number }) =>
    apiClient.post<{
      success: boolean
      referrer_bonus: string
      referee_bonus: string
    }>('/credits/referral/apply/', data),
}
