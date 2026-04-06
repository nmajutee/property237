'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../../components/navigation/Navbar'
import { propertyService } from '@/services/propertyService'
import {
  FilterSidebar,
  PropertyGrid,
  PropertyHeader,
  PriceFilterBar
} from '@/components/properties'
import { Button } from '@/components/ui/Button'
import { PromotedPropertyCards, AdBanner } from '@/components/ads/AdPlacements'
import Link from 'next/link'

// Dynamically import MapView to prevent SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/properties/MapView'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-property237-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    )
  }
)
import {
  MapPinIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface PropertyImage {
  id: number
  image_url: string
  image_type: string
  is_primary: boolean
}

interface Property {
  id: number
  title: string
  slug: string
  property_type: {
    id: number
    name: string
  }
  status: {
    id: number
    name: string
  }
  price: string
  currency: string
  area: {
    name: string
    city: {
      name: string
    }
  }
  no_of_bedrooms: number
  no_of_bathrooms: number
  images: PropertyImage[]
  primary_image: string | null
  featured: boolean
  is_active: boolean
  agent?: {
    id: number
    user: {
      id: number
      first_name: string
      last_name: string
      profile_picture?: string
    }
    average_rating?: number
    total_reviews?: number
  }
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [propertyTypes, setPropertyTypes] = useState<any[]>([{ id: 'all', name: 'All Types' }])
  const [mounted, setMounted] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([])
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>('any')
  const [rentalPeriod, setRentalPeriod] = useState<'long-term' | 'short-term'>('long-term')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [prevPage, setPrevPage] = useState<string | null>(null)
  const pageSize = 20

  useEffect(() => {
    setMounted(true)
    fetchPropertyTypes()
    fetchProperties()
  }, [])

  useEffect(() => {
    fetchProperties({ searchTerm, selectedType, priceRange, page: currentPage })
  }, [currentPage])

  const fetchPropertyTypes = async () => {
    try {
      const data = await propertyService.getTypes() as any
      const typesArray = Array.isArray(data) ? data : (data?.results || [])
      setPropertyTypes([
        { id: 'all', name: 'All Types' },
        ...typesArray
      ])
    } catch (error) {
      console.error('Error fetching property types:', error)
      setPropertyTypes([{ id: 'all', name: 'All Types' }])
    }
  }

  const fetchProperties = async (filters?: any) => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}

      if (filters?.searchTerm) params.search = filters.searchTerm
      if (filters?.selectedType && filters.selectedType !== 'all') params.property_type = filters.selectedType
      if (filters?.priceRange?.min) params.price_min = filters.priceRange.min
      if (filters?.priceRange?.max) params.price_max = filters.priceRange.max
      if (filters?.page && filters.page > 1) params.page = filters.page
      if (filters?.bedrooms) params.bedrooms = filters.bedrooms

      const data = await propertyService.list(params as any) as any
      setProperties(data.results || [])
      setTotalCount(data.count || 0)
      setNextPage(data.next)
      setPrevPage(data.previous)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProperties({
      searchTerm,
      selectedType,
      priceRange,
      page: 1
    })
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setPriceRange({ min: '', max: '' })
    setSelectedBedrooms([])
    setSelectedBathrooms('any')
    setCurrentPage(1)
    fetchProperties({ page: 1 })
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const toggleBedroom = (value: string) => {
    setSelectedBedrooms(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Main Container */}
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar
          rentalPeriod={rentalPeriod}
          setRentalPeriod={setRentalPeriod}
          propertyTypes={propertyTypes}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedBedrooms={selectedBedrooms}
          toggleBedroom={toggleBedroom}
          selectedBathrooms={selectedBathrooms}
          setSelectedBathrooms={setSelectedBathrooms}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Right Content Area - Scrollable */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Map */}
          <MapView show={showMap} properties={properties} />

          {/* Header */}
          <PropertyHeader
            title="Browse Properties"
            resultsCount={properties.length}
            showMap={showMap}
            setShowMap={setShowMap}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onOpenFilters={() => setIsMobileFilterOpen(true)}
          />

          {/* Price Filter Bar */}
          <PriceFilterBar priceRange={priceRange} setPriceRange={setPriceRange} />

          {/* Property Grid */}
          <div className="p-4 sm:p-6">
            {currentPage === 1 && (
              <PromotedPropertyCards type="featured" limit={4} />
            )}

            <PropertyGrid
              properties={properties}
              loading={loading}
              viewMode={viewMode}
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount} properties
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!prevPage}
                    className="px-3 py-1.5 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm rounded ${
                          page === currentPage
                            ? 'bg-property237-primary text-white'
                            : 'border hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={!nextPage}
                    className="px-3 py-1.5 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
