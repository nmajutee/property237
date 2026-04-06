'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leaseService } from '@/services/leaseService'
import type { LeaseAgreementCreate, LeaseAgreement } from '@/types/lease'

export const leaseKeys = {
  all: ['leases'] as const,
  list: () => [...leaseKeys.all, 'list'] as const,
  detail: (id: string | number) => [...leaseKeys.all, 'detail', id] as const,
  rentSchedule: () => [...leaseKeys.all, 'rentSchedule'] as const,
}

export function useLeases() {
  return useQuery({
    queryKey: leaseKeys.list(),
    queryFn: () => leaseService.list(),
  })
}

export function useLease(id: string | number) {
  return useQuery({
    queryKey: leaseKeys.detail(id),
    queryFn: () => leaseService.getById(id),
    enabled: !!id,
  })
}

export function useRentSchedule() {
  return useQuery({
    queryKey: leaseKeys.rentSchedule(),
    queryFn: () => leaseService.getRentSchedule(),
  })
}

export function useCreateLease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LeaseAgreementCreate) => leaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.list() })
    },
  })
}

export function useUpdateLease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number
      data: Partial<LeaseAgreement>
    }) => leaseService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: leaseKeys.list() })
    },
  })
}

export function useMarkRentPaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => leaseService.markRentPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.rentSchedule() })
    },
  })
}
