export interface MaintenanceCategory {
  id: string | number
  name: string
  description: string
}

export interface ServiceProvider {
  id: string | number
  name: string
  contact_email: string
  contact_phone: string
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency'
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface MaintenanceRequest {
  id: string | number
  property: string | number
  tenant: string | number
  category: string | number
  title: string
  description: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  requested_date: string
  completed_date?: string
  estimated_cost?: number
  actual_cost?: number
  assigned_to?: string | number
}

export interface MaintenanceRequestCreate {
  property: string | number
  category: string | number
  title: string
  description: string
  priority: MaintenancePriority
}
