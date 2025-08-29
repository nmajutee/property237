import { apiClient } from '@/shared/services/api/client';
import type { Property, PropertyFilters, PropertyType, Location, PriceRange } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/shared/types';

export const propertyApi = {
    // Get all properties with optional filters
    getProperties: async (
        filters?: PropertyFilters,
        page = 1,
        limit = 12
    ): Promise<PaginatedResponse<Property>> => {
        const response = await apiClient.get('/properties/', {
            params: { ...filters, page, limit }
        });
        return response.data;
    },

    // Get single property by ID
    getProperty: async (id: string): Promise<ApiResponse<Property>> => {
        const response = await apiClient.get(`/properties/${id}/`);
        return response.data;
    },

    // Get property types
    getPropertyTypes: async (): Promise<PropertyType[]> => {
        const response = await apiClient.get('/properties/types/');
        return response.data?.results || response.data || [];
    },

    // Get locations/cities
    getLocations: async (): Promise<Location[]> => {
        const response = await apiClient.get('/locations/cities/');
        return response.data?.results || response.data || [];
    },

    // Get price range
    getPriceRange: async (): Promise<PriceRange> => {
        const response = await apiClient.get('/properties/price-range/');
        return {
            min: response.data.min_price || 50000,
            max: response.data.max_price || 10000000
        };
    },

    // Search properties
    searchProperties: async (
        query: string,
        filters?: PropertyFilters
    ): Promise<PaginatedResponse<Property>> => {
        const response = await apiClient.get('/properties/search/', {
            params: { q: query, ...filters }
        });
        return response.data;
    }
};