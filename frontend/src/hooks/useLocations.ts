'use client'

import { useQuery } from '@tanstack/react-query'
import { locationService } from '@/services/locationService'

export const locationKeys = {
  all: ['locations'] as const,
  countries: () => [...locationKeys.all, 'countries'] as const,
  regions: () => [...locationKeys.all, 'regions'] as const,
  cities: () => [...locationKeys.all, 'cities'] as const,
  areas: () => [...locationKeys.all, 'areas'] as const,
  tree: () => [...locationKeys.all, 'tree'] as const,
  popular: () => [...locationKeys.all, 'popular'] as const,
}

export function useCountries() {
  return useQuery({
    queryKey: locationKeys.countries(),
    queryFn: () => locationService.getCountries(),
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
  })
}

export function useRegions() {
  return useQuery({
    queryKey: locationKeys.regions(),
    queryFn: () => locationService.getRegions(),
    staleTime: 1000 * 60 * 60,
  })
}

export function useCities() {
  return useQuery({
    queryKey: locationKeys.cities(),
    queryFn: () => locationService.getCities(),
    staleTime: 1000 * 60 * 60,
  })
}

export function useAreas() {
  return useQuery({
    queryKey: locationKeys.areas(),
    queryFn: () => locationService.getAreas(),
    staleTime: 1000 * 60 * 60,
  })
}

export function useLocationTree() {
  return useQuery({
    queryKey: locationKeys.tree(),
    queryFn: () => locationService.getTree(),
    staleTime: 1000 * 60 * 60,
  })
}

export function usePopularLocations() {
  return useQuery({
    queryKey: locationKeys.popular(),
    queryFn: () => locationService.getPopular(),
    staleTime: 1000 * 60 * 5, // 5 min - changes more often
  })
}
