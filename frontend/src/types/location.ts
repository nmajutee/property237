export interface Country {
  id: string | number
  name: string
  code: string
  phone_code: string
  currency: string
}

export interface Region {
  id: string | number
  name: string
  code: string
  country: string | number
}

export interface City {
  id: string | number
  name: string
  region: string | number
  is_major_city: boolean
  latitude?: number
  longitude?: number
}

export interface Area {
  id: string | number
  name: string
  local_name?: string
  city: string | number
  full_location: string
  is_residential: boolean
  is_commercial: boolean
  has_tarred_roads: boolean
  has_electricity: boolean
  has_water_supply: boolean
}

export interface LocationTree {
  countries: Country[]
  regions: Region[]
  cities: City[]
  areas: Area[]
}

export interface PopularLocation {
  area: Area
  property_count: number
  is_trending: boolean
}
