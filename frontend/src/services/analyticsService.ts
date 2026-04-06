import apiClient from './api'
import type {
  AgentDashboardStats,
  TenantDashboardStats,
  PropertyStats,
  ViewTimeline,
  InquiryTimeline,
  AgentAnalyticsSummary,
} from '@/types/analytics'

export const analyticsService = {
  getAgentDashboard: () =>
    apiClient.get<AgentDashboardStats>('/analytics/agent/dashboard/'),

  getTenantDashboard: () =>
    apiClient.get<TenantDashboardStats>('/analytics/tenant/dashboard/'),

  getAdminDashboard: () =>
    apiClient.get('/analytics/admin/dashboard/'),

  getPropertyStats: (propertyId: string | number) =>
    apiClient.get<PropertyStats>(`/analytics/property/${propertyId}/`),

  recordInquiry: (propertyId: string | number, data: { inquiry_type: string; message?: string }) =>
    apiClient.post(`/analytics/property/${propertyId}/inquiry/`, data),

  getViewTimeline: (propertyId: string | number, days = 30) =>
    apiClient.get<ViewTimeline>(`/analytics/property/${propertyId}/views/?days=${days}`),

  getInquiryTimeline: (propertyId: string | number, days = 30) =>
    apiClient.get<InquiryTimeline>(`/analytics/property/${propertyId}/inquiries/?days=${days}`),

  getAgentAnalytics: (days = 30) =>
    apiClient.get<AgentAnalyticsSummary>(`/analytics/agent/analytics/?days=${days}`),
}
