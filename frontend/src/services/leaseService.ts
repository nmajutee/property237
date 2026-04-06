import apiClient from './api'
import type {
  LeaseAgreement,
  LeaseAgreementCreate,
  RentSchedule,
} from '@/types/lease'
import type { PaginatedResponse } from '@/types/property'

export const leaseService = {
  // Lease agreements
  list: () =>
    apiClient.get<PaginatedResponse<LeaseAgreement>>('/leases/leases/'),

  getById: (id: string | number) =>
    apiClient.get<LeaseAgreement>(`/leases/leases/${id}/`),

  create: (data: LeaseAgreementCreate) =>
    apiClient.post<LeaseAgreement>('/leases/leases/', data),

  update: (id: string | number, data: Partial<LeaseAgreement>) =>
    apiClient.patch<LeaseAgreement>(`/leases/leases/${id}/`, data),

  // Rent schedule
  getRentSchedule: () =>
    apiClient.get<PaginatedResponse<RentSchedule>>('/leases/rent-schedule/'),

  markRentPaid: (id: string | number) =>
    apiClient.patch<RentSchedule>(`/leases/rent-schedule/${id}/`, {
      is_paid: true,
    }),
}
