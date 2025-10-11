'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/navigation/Navbar'
import { Button } from '../../components/ui/Button'
import { getApiBaseUrl } from '@/services/api'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

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
        {/* Left Sidebar - Filters */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Rental Period */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                Rental period
              </h3>
              <div className="space-y-1.5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={rentalPeriod === 'long-term'}
                    onChange={() => setRentalPeriod('long-term')}
                    className="w-3.5 h-3.5 text-property237-primary border-gray-300 focus:ring-property237-primary"
                  />
                  <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">Long term</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={rentalPeriod === 'short-term'}
                    onChange={() => setRentalPeriod('short-term')}
                    className="w-3.5 h-3.5 text-property237-primary border-gray-300 focus:ring-property237-primary"
                  />
                  <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">Short term</span>
                </label>
              </div>
            </div>

            {/* Real Estate Type */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                Property type
              </h3>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {propertyTypes.map((type) => (
                  <label key={type.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedType === type.id.toString()}
                      onChange={() => setSelectedType(selectedType === type.id.toString() ? '' : type.id.toString())}
                      className="w-3.5 h-3.5 text-property237-primary border-gray-300 rounded focus:ring-property237-primary"
                    />
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                Bedrooms
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {['1', '2', '3', '4+'].map((num) => (
                  <button
                    key={num}
                    onClick={() => toggleBedroom(num)}
                    className={`py-1.5 px-2 text-xs font-medium rounded border transition-colors ${
                      selectedBedrooms.includes(num)
                        ? 'bg-property237-primary text-white border-property237-primary'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-property237-primary'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathroom */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                Bathroom
              </h3>
              <select
                value={selectedBathrooms}
                onChange={(e) => setSelectedBathrooms(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
              >
                <option value="any">Any</option>
                <option value="combined">Combined</option>
                <option value="separate">Separate</option>
              </select>
            </div>

            {/* View Type */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                View
              </h3>
              <div className="space-y-1.5">
                {['Any', 'Courtyard', 'Street'].map((view) => (
                  <label key={view} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="view"
                      defaultChecked={view === 'Any'}
                      className="w-3.5 h-3.5 text-property237-primary border-gray-300 focus:ring-property237-primary"
                    />
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{view}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search by Location */}
            <div>
              <h3 className="text-xs font-heading font-semibold text-gray-900 dark:text-white mb-2">
                Location
              </h3>
              <div className="relative mb-2">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="City, area..."
                  className="w-full pl-7 pr-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                />
              </div>
              <Button onClick={handleSearch} className="w-full text-xs py-1.5" size="sm">
                Search
              </Button>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="w-full py-1.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Map Section */}
          {showMap && (
            <div className="h-64 bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Map view coming soon</p>
              </div>
            </div>
          )}

          {/* Header Below Map */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Browse Properties
                </h1>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {properties.length} results
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-property237-primary flex items-center gap-1"
                >
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {showMap ? 'Hide' : 'Show'} map
                </button>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-property237-primary shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Squares2X2Icon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-property237-primary shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </button>
                </div>
                <select className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Filter Below Header */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-heading font-semibold text-gray-900 dark:text-white">
                Price:
              </span>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  placeholder="Min"
                  className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                />
                <span className="text-xs text-gray-500">—</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  placeholder="Max"
                  className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                />
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {properties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
                      {property.primary_image || (property.images && property.images.length > 0) ? (
                        <img
                          src={property.primary_image || property.images[0]?.image_url || ''}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BuildingOfficeIcon className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                      <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform">
                        <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-property237-primary text-white px-3 py-1 rounded-full text-sm font-heading font-semibold shadow-lg">
                          {property.property_type.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white group-hover:text-property237-primary transition-colors">
                          {property.title}
                        </h3>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{property.area.city.name}, {property.area.name}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold">{property.no_of_bedrooms}</span> beds
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold">{property.no_of_bathrooms}</span> baths
                        </span>
                        <span className="capitalize text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {property.status.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-heading font-bold text-property237-primary">
                            {parseFloat(property.price).toLocaleString()} {property.currency}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">/month</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
