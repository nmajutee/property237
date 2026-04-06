import apiClient from './api'
import type {
  Property,
  PropertyListing,
  PropertyType,
  PropertyStatus,
  PropertyFilters,
  PropertyImage,
  Category,
  PropertyTag,
  PropertyState,
  PaginatedResponse,
} from '@/types/property'

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(
    ([, v]: [string, any]) => v !== undefined && v !== null && v !== ''
  )
  if (filtered.length === 0) return ''
  return '?' + new URLSearchParams(filtered.map(([k, v]: [string, any]) => [k, String(v)])).toString()
}

export const propertyService = {
  // List & search
  list: (filters?: PropertyFilters) =>
    apiClient.get<PaginatedResponse<PropertyListing>>(
      `/properties/${buildQuery(filters || {})}`
    ),

  search: (filters?: PropertyFilters) =>
    apiClient.get<PaginatedResponse<PropertyListing>>(
      `/properties/search/${buildQuery(filters || {})}`
    ),

  // Proximity search
  nearby: (params: { lat: number; lng: number; radius_km?: number } & Partial<PropertyFilters>) =>
    apiClient.get<{ count: number; center: { lat: number; lng: number }; radius_km: number; results: (PropertyListing & { distance_km?: number })[] }>(
      `/properties/nearby/${buildQuery(params)}`
    ),

  // Similar properties
  similar: (slug: string) =>
    apiClient.get<PropertyListing[]>(`/properties/${slug}/similar/`),

  // CRUD
  getBySlug: (slug: string) =>
    apiClient.get<Property>(`/properties/${slug}/`),

  create: (data: Partial<Property>) =>
    apiClient.post<Property>('/properties/', data),

  update: (slug: string, data: Partial<Property>) =>
    apiClient.patch<Property>(`/properties/${slug}/`, data),

  delete: (slug: string) =>
    apiClient.delete(`/properties/${slug}/`),

  // Agent's own properties
  myProperties: () =>
    apiClient.get<PaginatedResponse<PropertyListing>>('/properties/my-properties/'),

  // Favorites
  listFavorites: () =>
    apiClient.get<PaginatedResponse<PropertyListing>>('/properties/favorites/'),

  toggleFavorite: (slug: string) =>
    apiClient.post<{ success: boolean; is_favorited: boolean }>(
      `/properties/${slug}/favorite/`
    ),

  // Viewings
  createViewing: (data: { property_listing: string | number; viewer: string | number }) =>
    apiClient.post('/properties/viewings/', data),

  // Metadata
  getTypes: () =>
    apiClient.get<PropertyType[]>('/properties/types/'),

  getStatuses: () =>
    apiClient.get<PropertyStatus[]>('/properties/statuses/'),

  // Categories
  getCategories: () =>
    apiClient.get<Category[]>('/properties/categories/'),

  getParentCategories: () =>
    apiClient.get<Category[]>('/properties/categories/parents/'),

  getSubcategories: (parentSlug: string) =>
    apiClient.get<Category[]>(`/properties/categories/${parentSlug}/subcategories/`),

  // Tags & states
  getTags: (categoryId?: string | number) =>
    apiClient.get<PropertyTag[]>(
      categoryId
        ? `/properties/tags/for_category/${categoryId}/`
        : '/properties/tags/'
    ),

  getStates: (publicOnly?: boolean) =>
    apiClient.get<PropertyState[]>(
      publicOnly ? '/properties/states/public/' : '/properties/states/'
    ),

  getFormData: (categoryId?: string | number) =>
    apiClient.get(
      categoryId
        ? `/properties/form-data/for_category/${categoryId}/`
        : '/properties/form-data/'
    ),

  // Media
  uploadImages: (propertyId: string | number, formData: FormData) =>
    apiClient.upload<PropertyImage>(`/media/property/${propertyId}/`, formData),

  deleteImage: (fileId: string | number) =>
    apiClient.delete(`/media/${fileId}/delete/`),

  getImages: (propertyId: string | number) =>
    apiClient.get<PropertyImage[]>(`/media/property/${propertyId}/`),
}
