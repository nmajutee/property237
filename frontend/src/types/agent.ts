export interface AgentProfile {
  id: string | number
  user: {
    id: string | number
    first_name: string
    last_name: string
    email: string
  }
  street?: string
  city?: string
  region?: string
  postal_code?: string
  country?: string
  id_type?: 'passport' | 'drivers_license' | 'national_id'
  id_number?: string
  mobile_money_provider?: 'mtn' | 'orange'
  mobile_money_phone?: string
  mobile_money_account_name?: string
  name_match_status?: 'match' | 'close' | 'mismatch' | 'pending'
  is_mobile_money_verified: boolean
  license_number?: string
  agency_name?: string
  years_experience?: '0-1' | '1-3' | '3-5' | '5-10' | '10+'
  specialization?: 'residential' | 'commercial' | 'luxury' | 'rental' | 'investment' | 'land'
  bio?: string
  service_areas: (string | number)[]
  is_verified: boolean
  is_featured: boolean
  total_sales: number
  total_rentals: number
  client_rating: number
  total_reviews: number
  phone_number?: string
  profile_picture?: string
  company_name?: string
}

export interface AgentRegistrationData {
  street: string
  city: string
  region: string
  postal_code?: string
  country?: string
  residence_proof?: File
  id_type: 'passport' | 'drivers_license' | 'national_id'
  id_number: string
  id_document?: File
  address_verification?: File
  taxpayer_card?: File
  selfie_document?: File
  mobile_money_provider: 'mtn' | 'orange'
  mobile_money_phone: string
  mobile_money_account_name: string
  license_number?: string
  agency_name?: string
  years_experience: string
  specialization: string
  bio?: string
  service_areas: (string | number)[]
}

export interface AgentOnboardingData {
  personal_info: Record<string, any>
  address: Record<string, any>
  kyc_documents: Record<string, any>
  mobile_money: Record<string, any>
  verification: Record<string, any>
}

export interface AgentCertification {
  id: string | number
  name: string
  issuing_organization: string
  issue_date: string
  expiry_date?: string
  certificate_number?: string
  document?: string
}

export interface AgentReview {
  id: string | number
  agent: string | number
  reviewer: {
    id: string | number
    first_name: string
    last_name: string
  }
  rating: number
  comment: string
  created_at: string
}
