// Property-related TypeScript types based on Django models

export interface PropertyType {
  id: string | number
  name: string
  category: 'residential' | 'commercial'
  subtype?: string
  description?: string
  is_active: boolean
}

export interface PropertyStatus {
  id: string | number
  name: string
  description?: string
  is_active: boolean
}

export interface Area {
  id: string | number
  name: string
  city: {
    id: string | number
    name: string
    region: {
      id: string | number
      name: string
    }
  }
}

export interface AgentProfile {
  id: string | number
  user: {
    id: string | number
    first_name: string
    last_name: string
    email: string
  }
  phone_number?: string
  profile_picture?: string
  company_name?: string
  is_verified: boolean
}

export interface PropertyFeature {
  id: string | number
  feature_name: string
  feature_value?: string
  is_highlighted: boolean
}

export interface Property {
  id: string | number
  title: string
  description: string
  slug: string

  // Property details
  property_type: PropertyType
  status: PropertyStatus
  listing_type: 'rent' | 'sale' | 'guest_house'

  // Location
  area: Area
  google_pin_location?: string
  distance_from_main_road?: number
  road_is_tarred: boolean
  vehicle_access?: 'bike' | 'low_car' | 'suv'

  // Room details
  no_of_bedrooms: number
  no_of_living_rooms: number
  no_of_bathrooms: number
  no_of_kitchens: number
  kitchen_type?: 'full_size' | 'partial'

  // Property specifics
  no_of_floors?: number
  floor_number?: number
  size_sqm?: number

  // Utilities
  electricity_type?: 'private_meter' | 'shared_meter'
  electricity_payment?: 'prepaid' | 'postpaid'
  water_type?: 'camwater' | 'forage'
  has_ac_preinstalled: boolean
  has_hot_water: boolean
  has_generator: boolean

  // Amenities
  has_parking: boolean
  has_security: boolean
  has_pool: boolean
  has_gym: boolean
  has_elevator: boolean

  // Pricing
  price: number
  currency: string
  initial_months_payable?: number
  caution_months?: number
  visit_fee?: number
  price_per_day?: number
  price_negotiable: boolean

  // Land information (for sales)
  land_size_sqm?: number
  has_land_title: boolean
  land_title_type?: 'global' | 'extract'
  land_type?: 'family_land' | 'private_land' | 'community_land' | 'reclaimed_land'

  // Agent and verification
  agent: AgentProfile
  is_verified: boolean
  verified_at?: string

  // SEO and metrics
  featured: boolean
  views_count: number

  // Additional features
  additional_features: PropertyFeature[]

  // Timestamps
  created_at: string
  updated_at: string
}

// Lightweight version for listing views
export interface PropertyListing {
  id: string | number
  title: string
  slug: string
  property_type: PropertyType
  status: PropertyStatus
  listing_type: 'rent' | 'sale' | 'guest_house'
  price: number
  currency: string
  area: Area
  no_of_bedrooms: number
  no_of_bathrooms: number
  agent: AgentProfile
  created_at: string
  featured: boolean
}

// Property card view modes
export type PropertyViewMode = 'grid' | 'list'

// Property search/filter types
export interface PropertyFilters {
  location?: string
  property_type?: string
  listing_type?: 'rent' | 'sale' | 'guest_house'
  min_price?: number
  max_price?: number
  min_bedrooms?: number
  max_bedrooms?: number
  min_bathrooms?: number
  max_bathrooms?: number
  has_parking?: boolean
  has_security?: boolean
  has_pool?: boolean
  features?: string[]
}