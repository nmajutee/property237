import apiClient from './api'
import type {
  AgentProfile,
  AgentRegistrationData,
  AgentOnboardingData,
  AgentCertification,
  AgentReview,
} from '@/types/agent'
import type { PaginatedResponse } from '@/types/property'

export const agentService = {
  // Registration & onboarding
  register: (data: FormData) =>
    apiClient.upload<AgentProfile>('/agents/register/', data),

  onboard: (data: AgentOnboardingData) =>
    apiClient.post<AgentProfile>('/agents/onboard/', data),

  // Profile
  getProfile: () =>
    apiClient.get<AgentProfile>('/agents/profile/'),

  getEnhancedProfile: () =>
    apiClient.get<AgentProfile>('/agents/profile/enhanced/'),

  updateProfile: (data: Partial<AgentProfile>) =>
    apiClient.patch<AgentProfile>('/agents/profile/', data),

  // Verification
  getVerificationStatus: () =>
    apiClient.get<{ status: string; details: Record<string, any> }>(
      '/agents/verification-status/'
    ),

  // Documents
  uploadDocuments: (formData: FormData) =>
    apiClient.upload('/agents/documents/', formData),

  // Mobile money
  getMobileMoney: () =>
    apiClient.get('/agents/mobile-money/'),

  updateMobileMoney: (data: {
    mobile_money_provider: 'mtn' | 'orange'
    mobile_money_phone: string
    mobile_money_account_name: string
  }) =>
    apiClient.patch('/agents/mobile-money/', data),

  // Public listings
  list: () =>
    apiClient.get<PaginatedResponse<AgentProfile>>('/agents/'),

  getById: (id: string | number) =>
    apiClient.get<AgentProfile>(`/agents/${id}/`),

  getPublicEnhanced: (id: string | number) =>
    apiClient.get<AgentProfile>(`/agents/${id}/enhanced/`),

  // Certifications
  listCertifications: () =>
    apiClient.get<AgentCertification[]>('/agents/certifications/'),

  addCertification: (data: FormData) =>
    apiClient.upload<AgentCertification>('/agents/certifications/', data),

  // Reviews
  getReviews: (agentId: string | number) =>
    apiClient.get<PaginatedResponse<AgentReview>>(
      `/agents/${agentId}/reviews/`
    ),

  addReview: (agentId: string | number, data: { rating: number; comment: string }) =>
    apiClient.post<AgentReview>(`/agents/${agentId}/reviews/`, data),
}
