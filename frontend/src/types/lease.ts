export type LeaseStatus = 'draft' | 'pending_signature' | 'active' | 'terminated' | 'expired' | 'cancelled'

export interface LeaseAgreement {
  id: string | number
  property: string | number
  tenant: string | number
  landlord: string | number
  start_date: string
  end_date: string
  rent_amount: number
  security_deposit: number
  terms: string
  status: LeaseStatus
  signed_date?: string
  created_at: string
  updated_at: string
  rent_schedule: RentSchedule[]
}

export interface LeaseAgreementCreate {
  property: string | number
  tenant: string | number
  start_date: string
  end_date: string
  rent_amount: number
  security_deposit: number
  terms: string
}

export interface RentSchedule {
  id: string | number
  due_date: string
  amount: number
  is_paid: boolean
}
