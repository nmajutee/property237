import { useState } from "react";
import { Navigation } from "@/shared/components/layout/Navigation";
import { SearchHero } from "@/features/search/components/SearchHero";
import { PropertyGrid } from "@/features/listings/components/PropertyGrid";
import { ResultsHeader, SortRow, MapPanel } from "@/shared/components/ui";
import { useProperties } from "@/features/listings/hooks/useProperties";
import type { PropertyFilters } from "@/features/listings/types";
import type { ViewMode } from "@/shared/types";

import "../styles/index.css";

export default function App() {
    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("rent");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [filters, setFilters] = useState<PropertyFilters>({});
    const [sortBy, setSortBy] = useState("newest");

    // Data fetching
    const { properties, loading, error, refetch } = useProperties({ filters });

    // Filter properties based on search query
    const filteredProperties = properties.filter(
        (property) =>
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (property.area?.name || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'bedrooms':
                return b.no_of_bedrooms - a.no_of_bedrooms;
            case 'bathrooms':
                return b.no_of_bathrooms - a.no_of_bathrooms;
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    // Event handlers
    const handleFilterChange = (newFilters: PropertyFilters) => {
        setFilters({ ...filters, ...newFilters, listingType: activeTab });
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setFilters({ ...filters, listingType: tab });
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
    };

    const handleViewDetails = (propertyId: number) => {
        console.log(`Navigate to property ${propertyId}`);
        // TODO: Implement routing
        // navigate(`/properties/${propertyId}`);
    };

    return (
        <div className="property237-app-container">
            {/* Navigation */}
            <Navigation />

            {/* Hero Section with Search */}
            <SearchHero
                propertiesCount={properties.length}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterChange={handleFilterChange}
            />

            {/* Results Section */}
            <main className="property237-main-container">
                {/* Results Header */}
                <ResultsHeader
                    resultsCount={sortedProperties.length}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Results Body */}
                <div className="property237-results-body">
                    <div className="property237-listings-panel">
                        {/* Sort Controls */}
                        <SortRow onSortChange={handleSortChange} />

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                    <p className="text-red-800 font-semibold mb-2">Failed to load properties</p>
                                    <p className="text-red-600 text-sm mb-4">{error}</p>
                                    <button
                                        onClick={refetch}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Property Grid */}
                        {!error && (
                            <PropertyGrid
                                properties={sortedProperties}
                                loading={loading}
                                onViewDetails={handleViewDetails}
                            />
                        )}
                    </div>

                    {/* Map Panel */}
                    <MapPanel viewMode={viewMode} />
                </div>
            </main>
        </div>
    );
}