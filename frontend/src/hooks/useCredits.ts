'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { creditService } from '@/services/creditService'

export const creditKeys = {
  all: ['credits'] as const,
  balance: () => [...creditKeys.all, 'balance'] as const,
  statistics: () => [...creditKeys.all, 'statistics'] as const,
  packages: () => [...creditKeys.all, 'packages'] as const,
  pricing: () => [...creditKeys.all, 'pricing'] as const,
  transactions: (filters?: Record<string, any>) => [...creditKeys.all, 'transactions', filters] as const,
  propertyViews: () => [...creditKeys.all, 'propertyViews'] as const,
  access: (propertyId: string | number) => [...creditKeys.all, 'access', propertyId] as const,
}

export function useCreditBalance() {
  return useQuery({
    queryKey: creditKeys.balance(),
    queryFn: () => creditService.getBalance(),
  })
}

export function useCreditStatistics() {
  return useQuery({
    queryKey: creditKeys.statistics(),
    queryFn: () => creditService.getStatistics(),
  })
}

export function useCreditPackages() {
  return useQuery({
    queryKey: creditKeys.packages(),
    queryFn: () => creditService.getPackages(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreditPricing() {
  return useQuery({
    queryKey: creditKeys.pricing(),
    queryFn: () => creditService.getPricing(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreditTransactions(filters?: { type?: string; status?: string }) {
  return useQuery({
    queryKey: creditKeys.transactions(filters),
    queryFn: () => creditService.getTransactions(filters),
  })
}

export function usePropertyAccess(propertyId: string | number) {
  return useQuery({
    queryKey: creditKeys.access(propertyId),
    queryFn: () => creditService.checkPropertyAccess(propertyId),
    enabled: !!propertyId,
  })
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      package_id: string
      payment_method: 'momo' | 'orange_money' | 'card'
      phone_number?: string
    }) => creditService.purchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.balance() })
      queryClient.invalidateQueries({ queryKey: creditKeys.statistics() })
      queryClient.invalidateQueries({ queryKey: creditKeys.transactions() })
    },
  })
}

export function useUseCredits() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      action: 'view_property' | 'list_property' | 'featured_listing' | 'contact_reveal'
      reference_id: string
    }) => creditService.useCredits(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.balance() })
      queryClient.invalidateQueries({ queryKey: creditKeys.statistics() })
    },
  })
}

export function useInitiateMomoPayment() {
  return useMutation({
    mutationFn: (data: { package_id: string; phone_number: string }) =>
      creditService.initiateMomoPayment(data),
  })
}

export function useVerifyMomoPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { payment_reference: string; package_id: string }) =>
      creditService.verifyMomoPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.balance() })
      queryClient.invalidateQueries({ queryKey: creditKeys.transactions() })
    },
  })
}
