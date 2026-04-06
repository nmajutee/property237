export interface AgentDashboardStats {
  total_properties: number
  active_properties: number
  rented_properties: number
  available_properties: number
  total_views: number
  average_price: number
  total_applications: number
  pending_applications: number
  approved_applications: number
  new_properties_30d: number
  new_applications_30d: number
  properties_by_type: { property_type__name: string; count: number }[]
  recent_properties: any[]
}

export interface TenantDashboardStats {
  total_applications: number
  pending_applications: number
  approved_applications: number
  rejected_applications: number
  favorite_properties: number
  recent_applications: any[]
}

export interface PropertyStats {
  total_views: number
  unique_views: number
  total_inquiries: number
  days_on_market: number
  average_time_to_respond?: number
}

export interface DailyViewPoint {
  date: string
  total: number
  unique: number
}

export interface ViewTimeline {
  property_id: number
  days: number
  timeline: DailyViewPoint[]
}

export interface DailyInquiryPoint {
  date: string
  count: number
}

export interface InquiryTimeline {
  property_id: number
  days: number
  timeline: DailyInquiryPoint[]
  by_type: { inquiry_type: string; count: number }[]
}

export interface PropertyPerformance {
  id: number
  title: string
  slug: string
  total_views: number
  unique_views: number
  total_inquiries: number
  conversion_rate: number
}

export interface AgentAnalyticsSummary {
  period_days: number
  total_views: number
  total_inquiries: number
  conversion_rate: number
  daily_views: DailyViewPoint[]
  daily_inquiries: DailyInquiryPoint[]
  per_property: PropertyPerformance[]
}
