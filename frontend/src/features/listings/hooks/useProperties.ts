import { useState, useEffect } from 'react';
import { propertyApi } from '../services/propertyApi';
import type { Property, PropertyFilters } from '../types';
import type { PaginatedResponse } from '@/shared/types';

interface UsePropertiesParams {
    filters?: PropertyFilters;
    page?: number;
    limit?: number;
}

interface UsePropertiesReturn {
    data: PaginatedResponse<Property> | null;
    properties: Property[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// Sample data fallback
const sampleProperties: Property[] = [
    {
        id: 1,
        title: "Modern Apartment in City Center",
        slug: "modern-apartment-city-center",
        price: 250000,
        listing_type: "rent",
        property_type: { id: 1, name: "Apartment", category: "apartment" },
        area: { id: 1, name: "Yaoundé, Cameroon" },
        no_of_bedrooms: 2,
        no_of_bathrooms: 1,
        description: "Beautiful modern apartment with great city views",
        created_at: "2025-08-21",
    },
    {
        id: 2,
        title: "Luxury Villa with Pool",
        slug: "luxury-villa-pool",
        price: 450000,
        listing_type: "sale",
        property_type: { id: 2, name: "Villa", category: "villa" },
        area: { id: 2, name: "Douala, Cameroon" },
        no_of_bedrooms: 3,
        no_of_bathrooms: 2,
        description: "Spacious family home in quiet neighborhood",
        created_at: "2025-08-21",
    },
];

export const useProperties = (
    params: UsePropertiesParams = {}
): UsePropertiesReturn => {
    const [data, setData] = useState<PaginatedResponse<Property> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await propertyApi.getProperties(
                params.filters,
                params.page,
                params.limit
            );

            // Merge with sample data if backend returns empty or limited data
            const backendProperties = response.results || response.data || [];
            const mergedProperties = [...backendProperties, ...sampleProperties];

            const finalData = {
                ...response,
                data: mergedProperties,
                total: mergedProperties.length
            };

            setData(finalData);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch properties');

            // Fallback to sample data
            setData({
                data: sampleProperties,
                total: sampleProperties.length,
                page: 1,
                totalPages: 1
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [params.filters, params.page, params.limit]);

    return {
        data,
        properties: data?.data || [],
        loading,
        error,
        refetch: fetchProperties
    };
};