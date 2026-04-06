import apiClient from './api'
import type {
  Country,
  Region,
  City,
  Area,
  LocationTree,
  PopularLocation,
} from '@/types/location'

export const locationService = {
  getCountries: () =>
    apiClient.get<Country[]>('/locations/countries/'),

  getRegions: () =>
    apiClient.get<Region[]>('/locations/regions/'),

  getCities: () =>
    apiClient.get<City[]>('/locations/cities/'),

  getAreas: () =>
    apiClient.get<Area[]>('/locations/areas/'),

  getTree: () =>
    apiClient.get<LocationTree>('/locations/tree/'),

  getPopular: () =>
    apiClient.get<PopularLocation[]>('/locations/popular/'),
}
