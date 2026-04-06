'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantService } from '@/services/tenantService'
import type { TenantProfile, TenantApplicationCreate } from '@/types/tenant'

export const tenantKeys = {
  all: ['tenants'] as const,
  profile: () => [...tenantKeys.all, 'profile'] as const,
  documents: () => [...tenantKeys.all, 'documents'] as const,
  applications: () => [...tenantKeys.all, 'applications'] as const,
  application: (id: string | number) => [...tenantKeys.all, 'application', id] as const,
}

export function useTenantProfile() {
  return useQuery({
    queryKey: tenantKeys.profile(),
    queryFn: () => tenantService.getProfile(),
  })
}

export function useTenantDocuments() {
  return useQuery({
    queryKey: tenantKeys.documents(),
    queryFn: () => tenantService.listDocuments(),
  })
}

export function useTenantApplications() {
  return useQuery({
    queryKey: tenantKeys.applications(),
    queryFn: () => tenantService.listApplications(),
  })
}

export function useTenantApplication(id: string | number) {
  return useQuery({
    queryKey: tenantKeys.application(id),
    queryFn: () => tenantService.getApplication(id),
    enabled: !!id,
  })
}

// Mutations
export function useUpdateTenantProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<TenantProfile>) => tenantService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.profile() })
    },
  })
}

export function useCreateTenantProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<TenantProfile>) => tenantService.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.profile() })
    },
  })
}

export function useUploadTenantDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => tenantService.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.documents() })
    },
  })
}

export function useDeleteTenantDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => tenantService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.documents() })
    },
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TenantApplicationCreate) => tenantService.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.applications() })
    },
  })
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => tenantService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.applications() })
    },
  })
}
