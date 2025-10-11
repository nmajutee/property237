'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../../components/navigation/Navbar'
import { getApiBaseUrl } from '@/services/api'
import {
  FilterSidebar,
  PropertyGrid,
  PropertyHeader,
  PriceFilterBar
} from '@/components/properties'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Dynamically import MapView to prevent SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/properties/MapView'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-2"></div>
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

  useEffect(() => {
    setMounted(true)
    fetchPropertyTypes()
    fetchProperties()
  }, [])

  const fetchPropertyTypes = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl()
      console.log('Fetching property types from:', `${apiBaseUrl}/properties/types/`)
      const response = await fetch(`${apiBaseUrl}/properties/types/`)

      if (!response.ok) {
        console.error('Property types API error:', response.status, response.statusText)
        setPropertyTypes([{ id: 'all', name: 'All Types' }])
        return
      }

      const data = await response.json()
      console.log('Property types response:', data)
      console.log('Property types data type:', typeof data, 'Is array:', Array.isArray(data))

      // Handle both array response and paginated response
      let typesArray = []

      if (Array.isArray(data)) {
        typesArray = data
      } else if (data && data.results && Array.isArray(data.results)) {
        // Paginated response
        typesArray = data.results
      } else if (data && typeof data === 'object') {
        // Single object or unexpected format
        console.error('Unexpected property types format:', data)
        typesArray = []
      }

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
      const apiBaseUrl = getApiBaseUrl()

      // Build query parameters
      const params = new URLSearchParams()

      if (filters?.searchTerm) {
        params.append('search', filters.searchTerm)
      }

      if (filters?.selectedType && filters.selectedType !== 'all') {
        params.append('property_type', filters.selectedType)
      }

      if (filters?.priceRange?.min) {
        params.append('price_min', filters.priceRange.min)
      }

      if (filters?.priceRange?.max) {
        params.append('price_max', filters.priceRange.max)
      }

      const queryString = params.toString()
      const url = queryString
        ? `${apiBaseUrl}/properties/?${queryString}`
        : `${apiBaseUrl}/properties/`

      console.log('Fetching properties from:', url)
      const response = await fetch(url)

      if (!response.ok) {
        console.error('Properties API error:', response.status, response.statusText)
        setProperties([])
        return
      }

      const data = await response.json()
      console.log('Properties data:', data)
      console.log('Number of properties:', data.results?.length || 0)
      setProperties(data.results || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchProperties({
      searchTerm,
      selectedType,
      priceRange
    })
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setPriceRange({ min: '', max: '' })
    setSelectedBedrooms([])
    setSelectedBathrooms('any')
    fetchProperties()
  }

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
            <PropertyGrid
              properties={properties}
              loading={loading}
              viewMode={viewMode}
              onClearFilters={handleClearFilters}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
