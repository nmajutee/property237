import { useState, useEffect } from 'react';
import { propertyApi } from '@/features/listings/services/propertyApi';
import type { PropertyType, Location, PriceRange } from '@/features/listings/types';

interface UseSearchReturn {
    locations: Location[];
    propertyTypes: PropertyType[];
    priceRange: PriceRange;
    loading: boolean;
    error: string | null;
}

export const useSearch = (): UseSearchReturn => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 10000000 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [locationsData, typesData, priceData] = await Promise.all([
                    propertyApi.getLocations().catch(() => []),
                    propertyApi.getPropertyTypes().catch(() => []),
                    propertyApi.getPriceRange().catch(() => ({ min: 50000, max: 10000000 }))
                ]);

                setLocations(locationsData);
                setPropertyTypes(typesData);
                setPriceRange(priceData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch search data');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchData();
    }, []);

    return {
        locations,
        propertyTypes,
        priceRange,
        loading,
        error
    };
};