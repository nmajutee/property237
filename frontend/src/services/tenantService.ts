import apiClient from './api'
import type {
  TenantProfile,
  TenantDocument,
  TenantApplication,
  TenantApplicationCreate,
} from '@/types/tenant'
import type { PaginatedResponse } from '@/types/property'

export const tenantService = {
  // Profile
  getProfile: () =>
    apiClient.get<TenantProfile>('/tenants/tenants/'),

  updateProfile: (data: Partial<TenantProfile>) =>
    apiClient.patch<TenantProfile>('/tenants/tenants/', data),

  createProfile: (data: Partial<TenantProfile>) =>
    apiClient.post<TenantProfile>('/tenants/tenants/', data),

  // Documents
  listDocuments: () =>
    apiClient.get<PaginatedResponse<TenantDocument>>(
      '/tenants/tenant-documents/'
    ),

  uploadDocument: (formData: FormData) =>
    apiClient.upload<TenantDocument>('/tenants/tenant-documents/', formData),

  deleteDocument: (id: string | number) =>
    apiClient.delete(`/tenants/tenant-documents/${id}/`),

  // Applications
  listApplications: () =>
    apiClient.get<PaginatedResponse<TenantApplication>>(
      '/tenants/applications/'
    ),

  getApplication: (id: string | number) =>
    apiClient.get<TenantApplication>(`/tenants/applications/${id}/`),

  createApplication: (data: TenantApplicationCreate) =>
    apiClient.post<TenantApplication>('/tenants/applications/', data),

  updateApplication: (id: string | number, data: Partial<TenantApplication>) =>
    apiClient.patch<TenantApplication>(`/tenants/applications/${id}/`, data),

  withdrawApplication: (id: string | number) =>
    apiClient.post<TenantApplication>(`/tenants/applications/${id}/withdraw/`),

  // Agent-specific application endpoints
  agentApplications: (statusFilter?: string) => {
    const query = statusFilter ? `?status=${statusFilter}` : ''
    return apiClient.get<TenantApplication[]>(`/tenants/applications/agent/${query}`)
  },

  updateApplicationStatus: (id: string | number, data: { status: string; review_notes?: string }) =>
    apiClient.post<TenantApplication>(`/tenants/applications/${id}/update-status/`, data),

  getContract: (id: string | number) =>
    apiClient.get<any>(`/tenants/applications/${id}/contract/`),

  signContract: (id: string | number) =>
    apiClient.post<any>(`/tenants/applications/${id}/sign-contract/`),

  // Credit Score
  getCreditScore: () =>
    apiClient.get<{
      total: number
      max: number
      grade: string
      components: {
        payment_history: number
        verification: number
        documents: number
        lease_compliance: number
        profile_completeness: number
      }
    }>('/tenants/credit-score/'),
}
