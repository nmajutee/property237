import { MapPin, Home, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useSearch } from '../hooks/useSearch';
import type { PropertyType, Location, PropertyFilters } from '@/features/listings/types';

type SearchHeroProps = {
    propertiesCount: number;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onFilterChange?: (filters: PropertyFilters) => void;
};

export const SearchHero: React.FC<SearchHeroProps> = ({
                                                          propertiesCount,
                                                          activeTab,
                                                          setActiveTab,
                                                          searchQuery,
                                                          setSearchQuery,
                                                          onFilterChange,
                                                      }) => {
    const { locations, propertyTypes, priceRange, loading } = useSearch();

    // Filter states
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);
    const [currentPrice, setCurrentPrice] = useState(500000);

    // Dropdown states
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

    // Format XAF currency
    const formatXAF = (amount: number) => {
        return new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Handle search
    const handleSearch = () => {
        const filters: PropertyFilters = {
            location: selectedLocation?.id,
            propertyType: selectedPropertyType?.id,
            maxPrice: currentPrice,
            listingType: activeTab,
        };

        onFilterChange?.(filters);

        // Optional: trigger search query update
        if (selectedLocation && selectedPropertyType) {
            setSearchQuery(`${selectedPropertyType.name} in ${selectedLocation.name}`);
        }
    };

    // Handle location selection
    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setShowLocationDropdown(false);
    };

    // Handle property type selection
    const handlePropertyTypeSelect = (propertyType: PropertyType) => {
        setSelectedPropertyType(propertyType);
        setShowPropertyDropdown(false);
    };

    return (
        <section className="property237-new-hero">
            {/* Background Image */}
            <div className="property237-hero-background">
                <div className="property237-hero-overlay"></div>
            </div>

            <div className="property237-hero-content-centered">
                {/* Main Heading - Centered Above Filter */}
                <div className="property237-hero-text-centered">
                    <h1 className="property237-hero-main-title">
                        Find a perfect home you'll love
                    </h1>
                    <p className="property237-hero-subtitle">
                        We provide a complete service for the sale, purchase or rental of real estate.
                    </p>
                </div>

                {/* Filter Card - Full Width but Centered */}
                <div className="property237-filter-card-wide">
                    {/* Top Tabs */}
                    <div className="property237-filter-tabs">
                        <button
                            className={`property237-filter-tab ${activeTab === "rent" ? "active" : ""}`}
                            onClick={() => setActiveTab("rent")}
                        >
                            Rent
                        </button>
                        <button
                            className={`property237-filter-tab ${activeTab === "sale" ? "active" : ""}`}
                            onClick={() => setActiveTab("sale")}
                        >
                            Buy
                        </button>
                        <button
                            className={`property237-filter-tab ${activeTab === "guest_house" ? "active" : ""}`}
                            onClick={() => setActiveTab("guest_house")}
                        >
                            Guest House
                        </button>
                        <button
                            className={`property237-filter-tab ${activeTab === "commercial" ? "active" : ""}`}
                            onClick={() => setActiveTab("commercial")}
                        >
                            Commercial
                        </button>
                        <button
                            className={`property237-filter-tab ${activeTab === "new-launch" ? "active" : ""}`}
                            onClick={() => setActiveTab("new-launch")}
                        >
                            New Launch
                            <span className="property237-new-badge">NEW</span>
                        </button>
                    </div>

                    {/* Filter Controls */}
                    <div className="property237-filter-controls-wide">
                        {/* Location Dropdown */}
                        <div className="property237-filter-dropdown">
                            <button
                                className="property237-dropdown-btn"
                                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            >
                                <MapPin className="property237-filter-icon" />
                                <span className="property237-dropdown-text">
                  {selectedLocation ? selectedLocation.name : "Location"}
                </span>
                                <svg className="property237-dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {showLocationDropdown && (
                                <div className="property237-dropdown-menu">
                                    {locations.length === 0 ? (
                                        <div className="property237-dropdown-item-disabled">Loading locations...</div>
                                    ) : (
                                        locations.map((location) => (
                                            <button
                                                key={location.id}
                                                className="property237-dropdown-item"
                                                onClick={() => handleLocationSelect(location)}
                                            >
                                                <span>{location.name}</span>
                                                {location.region && (
                                                    <span className="property237-dropdown-subtitle">{location.region}</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Property Type Dropdown */}
                        <div className="property237-filter-dropdown">
                            <button
                                className="property237-dropdown-btn"
                                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                            >
                                <Home className="property237-filter-icon" />
                                <span className="property237-dropdown-text">
                  {selectedPropertyType ? selectedPropertyType.name : "Property Type"}
                </span>
                                <svg className="property237-dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {showPropertyDropdown && (
                                <div className="property237-dropdown-menu">
                                    {propertyTypes.length === 0 ? (
                                        <div className="property237-dropdown-item-disabled">Loading property types...</div>
                                    ) : (
                                        propertyTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                className="property237-dropdown-item"
                                                onClick={() => handlePropertyTypeSelect(type)}
                                            >
                                                <span>{type.name}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="property237-filter-price">
                            <label className="property237-price-label">Max Price</label>
                            <div className="property237-price-range">
                <span className="property237-price-value">
                  {loading ? "Loading..." : formatXAF(currentPrice)}
                </span>
                                {!loading && (
                                    <input
                                        type="range"
                                        min={priceRange.min}
                                        max={priceRange.max}
                                        value={currentPrice}
                                        onChange={(e) => setCurrentPrice(Number(e.target.value))}
                                        className="property237-price-slider"
                                        step="50000"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Advanced Search Toggle */}
                        <button className="property237-advanced-btn" title="Advanced Filters">
                            <SlidersHorizontal className="property237-filter-icon" />
                        </button>

                        {/* Search Button */}
                        <button
                            className="property237-search-btn"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <Search className="property237-search-icon" />
                            Search Property
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchHero;