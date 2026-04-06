export interface TenantProfile {
  id: string | number
  user: {
    id: string | number
    first_name: string
    last_name: string
    email: string
  }
  preferred_location?: string
  budget_min?: number
  budget_max?: number
  property_category?: string
  property_type?: string
  land_type?: string
  preferred_amenities?: string[]
  lease_agreement_acceptance: boolean
  government_id_upload?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  id_document_front?: string
  id_document_back?: string
  taxpayer_card?: string
  employer_name?: string
  monthly_income_range?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  documents: TenantDocument[]
  created_at: string
  updated_at: string
}

export interface TenantDocument {
  id: string | number
  name: string
  file: string
  uploaded_at: string
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'withdrawn'

export interface TenantApplication {
  id: string | number
  tenant: string | number
  tenant_name: string
  tenant_email: string
  property_id: string | number
  property_title: string
  property_location: string
  property_price: number
  property_image?: string
  status: ApplicationStatus
  desired_move_in_date: string
  lease_duration_months: number
  offered_rent?: number
  additional_occupants?: number
  special_requests?: string
  cover_letter?: string
  review_notes?: string
  review_date?: string
  created_at: string
  updated_at: string
  submitted_at?: string
}

export interface TenantApplicationCreate {
  property_id: string | number
  desired_move_in_date: string
  lease_duration_months: number
  offered_rent?: number
  additional_occupants?: number
  special_requests?: string
  cover_letter?: string
}
