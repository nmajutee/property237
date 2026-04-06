'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moderationService } from '@/services/moderationService'

export const moderationKeys = {
  all: ['moderation'] as const,
  reports: (status?: string) => [...moderationKeys.all, 'reports', status] as const,
  report: (id: string | number) => [...moderationKeys.all, 'report', id] as const,
  myReports: () => [...moderationKeys.all, 'myReports'] as const,
  log: (params?: { action_type?: string; page?: number }) => [...moderationKeys.all, 'log', params] as const,
  checks: (propertyId: string | number) => [...moderationKeys.all, 'checks', propertyId] as const,
  duplicates: () => [...moderationKeys.all, 'duplicates'] as const,
}

export function useMyReports() {
  return useQuery({
    queryKey: moderationKeys.myReports(),
    queryFn: () => moderationService.myReports(),
  })
}

export function useReports(status?: string) {
  return useQuery({
    queryKey: moderationKeys.reports(status),
    queryFn: () => moderationService.listReports(status),
  })
}

export function useReport(id: string | number) {
  return useQuery({
    queryKey: moderationKeys.report(id),
    queryFn: () => moderationService.getReport(id),
    enabled: !!id,
  })
}

export function useModerationLog(params?: { action_type?: string; page?: number }) {
  return useQuery({
    queryKey: moderationKeys.log(params),
    queryFn: () => moderationService.getModerationLog(params),
  })
}

export function useListingChecks(propertyId: string | number) {
  return useQuery({
    queryKey: moderationKeys.checks(propertyId),
    queryFn: () => moderationService.getListingChecks(propertyId),
    enabled: !!propertyId,
  })
}

export function useDuplicates() {
  return useQuery({
    queryKey: moderationKeys.duplicates(),
    queryFn: () => moderationService.checkDuplicates(),
  })
}

export function useSubmitReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moderationService.submitReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.myReports() })
    },
  })
}

export function useResolveReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { resolution: string; resolution_notes?: string } }) =>
      moderationService.resolveReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all })
    },
  })
}

export function useDismissReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason?: string }) =>
      moderationService.dismissReport(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all })
    },
  })
}
