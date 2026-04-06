'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { analyticsService } from '@/services/analyticsService'

export const analyticsKeys = {
  all: ['analytics'] as const,
  agentDashboard: () => [...analyticsKeys.all, 'agentDashboard'] as const,
  agentAnalytics: (days: number) => [...analyticsKeys.all, 'agentAnalytics', days] as const,
  tenantDashboard: () => [...analyticsKeys.all, 'tenantDashboard'] as const,
  adminDashboard: () => [...analyticsKeys.all, 'adminDashboard'] as const,
  propertyStats: (id: string | number) => [...analyticsKeys.all, 'property', id] as const,
  viewTimeline: (id: string | number, days: number) => [...analyticsKeys.all, 'views', id, days] as const,
  inquiryTimeline: (id: string | number, days: number) => [...analyticsKeys.all, 'inquiries', id, days] as const,
}

export function useAgentDashboard() {
  return useQuery({
    queryKey: analyticsKeys.agentDashboard(),
    queryFn: () => analyticsService.getAgentDashboard(),
  })
}

export function useAgentAnalytics(days = 30) {
  return useQuery({
    queryKey: analyticsKeys.agentAnalytics(days),
    queryFn: () => analyticsService.getAgentAnalytics(days),
  })
}

export function useTenantDashboard() {
  return useQuery({
    queryKey: analyticsKeys.tenantDashboard(),
    queryFn: () => analyticsService.getTenantDashboard(),
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: analyticsKeys.adminDashboard(),
    queryFn: () => analyticsService.getAdminDashboard(),
  })
}

export function usePropertyStats(propertyId: string | number) {
  return useQuery({
    queryKey: analyticsKeys.propertyStats(propertyId),
    queryFn: () => analyticsService.getPropertyStats(propertyId),
    enabled: !!propertyId,
  })
}

export function useViewTimeline(propertyId: string | number, days = 30) {
  return useQuery({
    queryKey: analyticsKeys.viewTimeline(propertyId, days),
    queryFn: () => analyticsService.getViewTimeline(propertyId, days),
    enabled: !!propertyId,
  })
}

export function useInquiryTimeline(propertyId: string | number, days = 30) {
  return useQuery({
    queryKey: analyticsKeys.inquiryTimeline(propertyId, days),
    queryFn: () => analyticsService.getInquiryTimeline(propertyId, days),
    enabled: !!propertyId,
  })
}

export function useRecordInquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string | number; data: { inquiry_type: string; message?: string } }) =>
      analyticsService.recordInquiry(propertyId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.propertyStats(variables.propertyId) })
      queryClient.invalidateQueries({ queryKey: analyticsKeys.agentAnalytics(30) })
    },
  })
}
