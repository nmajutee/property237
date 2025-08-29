import { PropertyCard } from './PropertyCard';
import type { Property } from '../types';

interface PropertyGridProps {
    properties: Property[];
    loading?: boolean;
    onViewDetails?: (id: number) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
                                                              properties,
                                                              loading = false,
                                                              onViewDetails
                                                          }) => {
    const handleViewDetails = (propertyId: number) => {
        if (onViewDetails) {
            onViewDetails(propertyId);
        } else {
            // Default navigation
            window.location.href = `/properties/${propertyId}`;
        }
    };

    if (loading) {
        return (
            <div className="property237-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="property237-card animate-pulse">
                        <div className="property237-card-media bg-gray-200"></div>
                        <div className="property237-card-body">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No properties found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="property237-grid">
            {properties.map((property) => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={handleViewDetails}
                />
            ))}
        </div>
    );
};

export default PropertyGrid;