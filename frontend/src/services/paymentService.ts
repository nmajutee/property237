import apiClient from './api'
import type { PaymentMethod, Transaction } from '@/types/payment'
import type { PaginatedResponse } from '@/types/property'

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(
    ([, v]: [string, any]) => v !== undefined && v !== null && v !== ''
  )
  if (filtered.length === 0) return ''
  return '?' + new URLSearchParams(filtered.map(([k, v]: [string, any]) => [k, String(v)])).toString()
}

export const paymentService = {
  // Payment methods
  getMethods: () =>
    apiClient.get<PaymentMethod[]>('/payments/methods/'),

  // Transactions
  listTransactions: (filters?: {
    status?: string
    transaction_type?: string
    page?: number
  }) =>
    apiClient.get<PaginatedResponse<Transaction>>(
      `/payments/transactions/${buildQuery(filters || {})}`
    ),

  getTransaction: (id: string | number) =>
    apiClient.get<Transaction>(`/payments/transactions/${id}/`),

  // Initiate payment
  initiatePayment: (data: {
    amount: number
    payment_method: string | number
    transaction_type: string
    description?: string
    phone_number?: string
    lease?: number
    related_property?: number
  }) =>
    apiClient.post<Transaction>('/payments/transactions/create/', data),

  // Verify payment callback
  verifyPayment: (transactionId: string) =>
    apiClient.post<Transaction>(`/payments/transactions/${transactionId}/verify/`),

  // Payment accounts
  getAccounts: () =>
    apiClient.get('/payments/accounts/'),

  createAccount: (data: {
    account_type: string
    account_name: string
    account_number: string
    phone_number?: string
  }) =>
    apiClient.post('/payments/accounts/', data),

  // Invoices
  getInvoices: () =>
    apiClient.get('/payments/invoices/'),

  // Wallet
  getWallet: () =>
    apiClient.get('/payments/wallet/'),

  // Summary
  getSummary: () =>
    apiClient.get('/payments/summary/'),
}
