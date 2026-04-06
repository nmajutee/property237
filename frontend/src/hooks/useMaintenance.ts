'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { maintenanceService } from '@/services/maintenanceService'
import type { MaintenanceRequestCreate, MaintenanceRequest } from '@/types/maintenance'

export const maintenanceKeys = {
  all: ['maintenance'] as const,
  list: () => [...maintenanceKeys.all, 'list'] as const,
  detail: (id: string | number) => [...maintenanceKeys.all, 'detail', id] as const,
  categories: () => [...maintenanceKeys.all, 'categories'] as const,
  providers: () => [...maintenanceKeys.all, 'providers'] as const,
}

export function useMaintenanceRequests() {
  return useQuery({
    queryKey: maintenanceKeys.list(),
    queryFn: () => maintenanceService.list(),
  })
}

export function useMaintenanceRequest(id: string | number) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: () => maintenanceService.getById(id),
    enabled: !!id,
  })
}

export function useMaintenanceCategories() {
  return useQuery({
    queryKey: maintenanceKeys.categories(),
    queryFn: () => maintenanceService.getCategories(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useServiceProviders() {
  return useQuery({
    queryKey: maintenanceKeys.providers(),
    queryFn: () => maintenanceService.getProviders(),
  })
}

export function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MaintenanceRequestCreate) => maintenanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.list() })
    },
  })
}

export function useUpdateMaintenanceRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number
      data: Partial<MaintenanceRequest>
    }) => maintenanceService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.list() })
    },
  })
}
