'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentService } from '@/services/agentService'
import type { AgentProfile, AgentOnboardingData } from '@/types/agent'

export const agentKeys = {
  all: ['agents'] as const,
  profile: () => [...agentKeys.all, 'profile'] as const,
  enhanced: () => [...agentKeys.all, 'enhanced'] as const,
  verification: () => [...agentKeys.all, 'verification'] as const,
  list: () => [...agentKeys.all, 'list'] as const,
  detail: (id: string | number) => [...agentKeys.all, 'detail', id] as const,
  certifications: () => [...agentKeys.all, 'certifications'] as const,
  reviews: (agentId: string | number) => [...agentKeys.all, 'reviews', agentId] as const,
  mobileMoney: () => [...agentKeys.all, 'mobileMoney'] as const,
}

export function useAgentProfile() {
  return useQuery({
    queryKey: agentKeys.profile(),
    queryFn: () => agentService.getProfile(),
  })
}

export function useEnhancedAgentProfile() {
  return useQuery({
    queryKey: agentKeys.enhanced(),
    queryFn: () => agentService.getEnhancedProfile(),
  })
}

export function useAgentVerificationStatus() {
  return useQuery({
    queryKey: agentKeys.verification(),
    queryFn: () => agentService.getVerificationStatus(),
  })
}

export function useAgents() {
  return useQuery({
    queryKey: agentKeys.list(),
    queryFn: () => agentService.list(),
  })
}

export function useAgent(id: string | number) {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => agentService.getById(id),
    enabled: !!id,
  })
}

export function useAgentPublicEnhanced(id: string | number) {
  return useQuery({
    queryKey: [...agentKeys.detail(id), 'enhanced'],
    queryFn: () => agentService.getPublicEnhanced(id),
    enabled: !!id,
  })
}

export function useAgentCertifications() {
  return useQuery({
    queryKey: agentKeys.certifications(),
    queryFn: () => agentService.listCertifications(),
  })
}

export function useAgentReviews(agentId: string | number) {
  return useQuery({
    queryKey: agentKeys.reviews(agentId),
    queryFn: () => agentService.getReviews(agentId),
    enabled: !!agentId,
  })
}

export function useAgentMobileMoney() {
  return useQuery({
    queryKey: agentKeys.mobileMoney(),
    queryFn: () => agentService.getMobileMoney(),
  })
}

// Mutations
export function useRegisterAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => agentService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.profile() })
    },
  })
}

export function useOnboardAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AgentOnboardingData) => agentService.onboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.profile() })
    },
  })
}

export function useUpdateAgentProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AgentProfile>) => agentService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.profile() })
      queryClient.invalidateQueries({ queryKey: agentKeys.enhanced() })
    },
  })
}

export function useUploadAgentDocuments() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => agentService.uploadDocuments(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.verification() })
    },
  })
}

export function useUpdateMobileMoney() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      mobile_money_provider: 'mtn' | 'orange'
      mobile_money_phone: string
      mobile_money_account_name: string
    }) => agentService.updateMobileMoney(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.mobileMoney() })
      queryClient.invalidateQueries({ queryKey: agentKeys.profile() })
    },
  })
}

export function useAddCertification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => agentService.addCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.certifications() })
    },
  })
}

export function useAddAgentReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: string | number
      data: { rating: number; comment: string }
    }) => agentService.addReview(agentId, data),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.reviews(agentId) })
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId) })
    },
  })
}
