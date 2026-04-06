import apiClient from './api'
import type { Report, ModerationAction, ListingAutoCheck, DuplicateResult } from '@/types/moderation'

export const moderationService = {
  // User-facing: submit reports
  submitReport: (data: {
    content_type_name: 'property' | 'agent' | 'user'
    object_id: string | number
    report_type: string
    description: string
    evidence?: File
  }) => {
    if (data.evidence) {
      const formData = new FormData()
      formData.append('content_type_name', data.content_type_name)
      formData.append('object_id', String(data.object_id))
      formData.append('report_type', data.report_type)
      formData.append('description', data.description)
      formData.append('evidence', data.evidence)
      return apiClient.upload<Report>('/moderation/reports/submit/', formData)
    }
    return apiClient.post<Report>('/moderation/reports/submit/', data)
  },

  myReports: () =>
    apiClient.get<Report[]>('/moderation/reports/mine/'),

  // Admin: reports management
  listReports: (status?: string) =>
    apiClient.get<Report[]>(
      `/moderation/reports/${status ? `?status=${status}` : ''}`
    ),

  getReport: (id: string | number) =>
    apiClient.get<Report>(`/moderation/reports/${id}/`),

  resolveReport: (id: string | number, data: { resolution: string; resolution_notes?: string }) =>
    apiClient.post(`/moderation/reports/${id}/resolve/`, data),

  dismissReport: (id: string | number, reason?: string) =>
    apiClient.post(`/moderation/reports/${id}/dismiss/`, { reason }),

  // Admin: audit log
  getModerationLog: (params?: { action_type?: string; page?: number }) =>
    apiClient.get<{ count: number; results: ModerationAction[] }>(
      `/moderation/log/${params ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
      ).toString() : ''}`
    ),

  // Admin: listing checks
  getListingChecks: (propertyId: string | number) =>
    apiClient.get<ListingAutoCheck[]>(`/moderation/checks/${propertyId}/`),

  // Admin: duplicate detection
  checkDuplicates: () =>
    apiClient.get<{ count: number; duplicates: DuplicateResult[] }>('/moderation/duplicates/'),
}
