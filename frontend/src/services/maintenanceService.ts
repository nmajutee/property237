import apiClient from './api'
import type {
  MaintenanceRequest,
  MaintenanceRequestCreate,
  MaintenanceCategory,
  ServiceProvider,
} from '@/types/maintenance'
import type { PaginatedResponse } from '@/types/property'

export const maintenanceService = {
  // Requests
  list: () =>
    apiClient.get<PaginatedResponse<MaintenanceRequest>>(
      '/maintenance/maintenance/'
    ),

  getById: (id: string | number) =>
    apiClient.get<MaintenanceRequest>(`/maintenance/maintenance/${id}/`),

  create: (data: MaintenanceRequestCreate) =>
    apiClient.post<MaintenanceRequest>('/maintenance/maintenance/', data),

  update: (id: string | number, data: Partial<MaintenanceRequest>) =>
    apiClient.patch<MaintenanceRequest>(
      `/maintenance/maintenance/${id}/`,
      data
    ),

  // Categories
  getCategories: () =>
    apiClient.get<PaginatedResponse<MaintenanceCategory>>(
      '/maintenance/maintenance-categories/'
    ),

  // Service providers
  getProviders: () =>
    apiClient.get<PaginatedResponse<ServiceProvider>>(
      '/maintenance/service-providers/'
    ),
}
