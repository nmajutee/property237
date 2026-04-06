export interface Report {
  id: string | number
  reporter: string | number
  reporter_name: string
  content_type: string | number
  object_id: string | number
  target_type: string
  report_type: 'spam' | 'misleading' | 'duplicate' | 'inappropriate' | 'fake_agent' | 'harassment' | 'fraud' | 'other'
  description: string
  evidence?: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  resolution?: string
  resolution_notes?: string
  reviewed_by?: string | number
  reviewer_name?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface ModerationAction {
  id: string | number
  moderator: string | number
  moderator_name: string
  action_type: string
  reason: string
  content_type: string | number
  object_id: string | number
  target_type: string
  report?: string | number
  metadata: Record<string, any>
  created_at: string
}

export interface ListingAutoCheck {
  id: string | number
  property: string | number
  property_title: string
  check_type: 'duplicate' | 'banned_words' | 'price_anomaly' | 'missing_images'
  severity: 'low' | 'medium' | 'high'
  details: string
  is_resolved: boolean
  resolved_by?: string | number
  created_at: string
}

export interface DuplicateResult {
  property_1: {
    id: string | number
    title: string
    slug: string
    price: string
    area: string
  }
  property_2: {
    id: string | number
    title: string
    slug: string
    price: string
    area: string
  }
  similarity_score: number
}
