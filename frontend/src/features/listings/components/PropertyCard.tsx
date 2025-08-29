import { Bed, Bath, MapPin } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
    property: Property;
    onViewDetails?: (id: number) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
                                                              property,
                                                              onViewDetails
                                                          }) => {
    const handleClick = () => {
        onViewDetails?.(property.id);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="property237-card" onClick={handleClick}>
            {/* Image */}
            <div className="property237-card-media">
                <img
                    src={`https://picsum.photos/400/300?random=${property.id}`}
                    alt={property.title}
                    className="property237-card-image"
                    loading="lazy"
                />

                {/* Price Badge */}
                <div className="property237-card-price">
                    {formatPrice(property.price)}
                </div>
            </div>

            {/* Content */}
            <div className="property237-card-body">
                {/* Title */}
                <h3 className="property237-card-title">{property.title}</h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{property.area?.name || 'Location not specified'}</span>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    {property.no_of_bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.no_of_bedrooms}</span>
                        </div>
                    )}
                    {property.no_of_bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.no_of_bathrooms}</span>
                        </div>
                    )}
                    {property.property_type && (
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {property.property_type.name}
                        </div>
                    )}
                </div>

                {/* Description */}
                {property.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {property.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PropertyCard;