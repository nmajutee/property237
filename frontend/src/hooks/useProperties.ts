'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { propertyService } from '@/services/propertyService'
import type {
  Property,
  PropertyListing,
  PropertyFilters,
  PropertyImage,
  PaginatedResponse,
} from '@/types/property'

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  search: (filters?: PropertyFilters) => [...propertyKeys.all, 'search', filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (slug: string) => [...propertyKeys.details(), slug] as const,
  myProperties: () => [...propertyKeys.all, 'mine'] as const,
  favorites: () => [...propertyKeys.all, 'favorites'] as const,
  types: () => [...propertyKeys.all, 'types'] as const,
  statuses: () => [...propertyKeys.all, 'statuses'] as const,
  categories: () => [...propertyKeys.all, 'categories'] as const,
  parentCategories: () => [...propertyKeys.all, 'parentCategories'] as const,
  subcategories: (parentSlug: string) => [...propertyKeys.all, 'subcategories', parentSlug] as const,
  tags: (categoryId?: string | number) => [...propertyKeys.all, 'tags', categoryId] as const,
  states: (publicOnly?: boolean) => [...propertyKeys.all, 'states', publicOnly] as const,
  images: (propertyId: string | number) => [...propertyKeys.all, 'images', propertyId] as const,
  nearby: (params: { lat: number; lng: number; radius_km?: number }) => [...propertyKeys.all, 'nearby', params] as const,
  similar: (slug: string) => [...propertyKeys.all, 'similar', slug] as const,
}

// Queries
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertyService.list(filters),
  })
}

export function usePropertySearch(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.search(filters),
    queryFn: () => propertyService.search(filters),
    enabled: !!filters,
  })
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: propertyKeys.detail(slug),
    queryFn: () => propertyService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useMyProperties() {
  return useQuery({
    queryKey: propertyKeys.myProperties(),
    queryFn: () => propertyService.myProperties(),
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: propertyKeys.favorites(),
    queryFn: () => propertyService.listFavorites(),
  })
}

export function usePropertyTypes() {
  return useQuery({
    queryKey: propertyKeys.types(),
    queryFn: () => propertyService.getTypes(),
    staleTime: 1000 * 60 * 30, // 30 min - rarely changes
  })
}

export function usePropertyStatuses() {
  return useQuery({
    queryKey: propertyKeys.statuses(),
    queryFn: () => propertyService.getStatuses(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useParentCategories() {
  return useQuery({
    queryKey: propertyKeys.parentCategories(),
    queryFn: () => propertyService.getParentCategories(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useSubcategories(parentSlug: string) {
  return useQuery({
    queryKey: propertyKeys.subcategories(parentSlug),
    queryFn: () => propertyService.getSubcategories(parentSlug),
    enabled: !!parentSlug,
    staleTime: 1000 * 60 * 30,
  })
}

export function usePropertyTags(categoryId?: string | number) {
  return useQuery({
    queryKey: propertyKeys.tags(categoryId),
    queryFn: () => propertyService.getTags(categoryId),
    staleTime: 1000 * 60 * 30,
  })
}

export function usePropertyStates(publicOnly?: boolean) {
  return useQuery({
    queryKey: propertyKeys.states(publicOnly),
    queryFn: () => propertyService.getStates(publicOnly),
    staleTime: 1000 * 60 * 30,
  })
}

export function usePropertyImages(propertyId: string | number) {
  return useQuery({
    queryKey: propertyKeys.images(propertyId),
    queryFn: () => propertyService.getImages(propertyId),
    enabled: !!propertyId,
  })
}

export function useNearbyProperties(params: { lat: number; lng: number; radius_km?: number } | null) {
  return useQuery({
    queryKey: propertyKeys.nearby(params!),
    queryFn: () => propertyService.nearby(params!),
    enabled: !!params,
  })
}

export function useSimilarProperties(slug: string) {
  return useQuery({
    queryKey: propertyKeys.similar(slug),
    queryFn: () => propertyService.similar(slug),
    enabled: !!slug,
  })
}

// Mutations
export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Property>) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() })
    },
  })
}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<Property> }) =>
      propertyService.update(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => propertyService.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() })
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => propertyService.toggleFavorite(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() })
    },
  })
}

export function useUploadPropertyImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ propertyId, formData }: { propertyId: string | number; formData: FormData }) =>
      propertyService.uploadImages(propertyId, formData),
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.images(propertyId) })
    },
  })
}

export function useDeletePropertyImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fileId: string | number) => propertyService.deleteImage(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}
