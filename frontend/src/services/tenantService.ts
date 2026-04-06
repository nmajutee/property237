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
    apiClient.patch<TenantApplication>(`/tenants/applications/${id}/`, {
      status: 'withdrawn',
    }),
}
