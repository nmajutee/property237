'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentService } from '@/services/paymentService'

export const paymentKeys = {
  all: ['payments'] as const,
  methods: () => [...paymentKeys.all, 'methods'] as const,
  transactions: (filters?: any) => [...paymentKeys.all, 'transactions', filters] as const,
  transaction: (id: string | number) => [...paymentKeys.all, 'transaction', id] as const,
  accounts: () => [...paymentKeys.all, 'accounts'] as const,
  invoices: () => [...paymentKeys.all, 'invoices'] as const,
  wallet: () => [...paymentKeys.all, 'wallet'] as const,
  summary: () => [...paymentKeys.all, 'summary'] as const,
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: () => paymentService.getMethods(),
  })
}

export function useTransactions(filters?: { status?: string; transaction_type?: string; page?: number }) {
  return useQuery({
    queryKey: paymentKeys.transactions(filters),
    queryFn: () => paymentService.listTransactions(filters),
  })
}

export function useTransaction(id: string | number) {
  return useQuery({
    queryKey: paymentKeys.transaction(id),
    queryFn: () => paymentService.getTransaction(id),
    enabled: !!id,
  })
}

export function usePaymentAccounts() {
  return useQuery({
    queryKey: paymentKeys.accounts(),
    queryFn: () => paymentService.getAccounts(),
  })
}

export function useInvoices() {
  return useQuery({
    queryKey: paymentKeys.invoices(),
    queryFn: () => paymentService.getInvoices(),
  })
}

export function useWallet() {
  return useQuery({
    queryKey: paymentKeys.wallet(),
    queryFn: () => paymentService.getWallet(),
  })
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: paymentKeys.summary(),
    queryFn: () => paymentService.getSummary(),
  })
}

export function useInitiatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      amount: number
      payment_method: string | number
      transaction_type: string
      description?: string
      phone_number?: string
      lease?: number
      related_property?: number
    }) => paymentService.initiatePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.wallet() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() })
    },
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (transactionId: string) => paymentService.verifyPayment(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.wallet() })
    },
  })
}

export function useCreatePaymentAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      account_type: string
      account_name: string
      account_number: string
      phone_number?: string
    }) => paymentService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.accounts() })
    },
  })
}
