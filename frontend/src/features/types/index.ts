export interface Property {
    id: number;
    title: string;
    slug: string;
    price: number;
    listing_type: string;
    property_type?: PropertyType;
    area?: Location;
    no_of_bedrooms: number;
    no_of_bathrooms: number;
    description: string;
    created_at: string;
}

export interface PropertyType {
    id: number;
    name: string;
    category: string;
}

export interface Location {
    id: number;
    name: string;
    region?: string;
}

export interface PropertyFilters {
    location?: number;
    propertyType?: number;
    maxPrice?: number;
    listingType?: string;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}