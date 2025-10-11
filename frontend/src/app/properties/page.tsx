'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navigation/Navbar'
import { Button } from '../../components/ui/Button'
import { getApiBaseUrl } from '@/services/api'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon
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
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [propertyTypes, setPropertyTypes] = useState<any[]>([{ id: 'all', name: 'All Types' }])
  const [mounted, setMounted] = useState(false)

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
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Properties
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find your perfect home from thousands of verified listings
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Location
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="City, neighborhood, or address..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                placeholder="Any"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button
              onClick={handleClearFilters}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-property237-primary"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {properties.length}
            </span>{' '}
            properties found
          </p>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {property.primary_image || (property.images && property.images.length > 0) ? (
                    <img
                      src={property.primary_image || property.images[0]?.image_url || ''}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BuildingOfficeIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-property237-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {property.property_type.name}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.area.city.name}, {property.area.name}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{property.no_of_bedrooms} beds</span>
                      <span>{property.no_of_bathrooms} baths</span>
                      <span className="capitalize">{property.status.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-2xl font-bold text-property237-primary">
                        {parseFloat(property.price).toLocaleString()} {property.currency}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">/month</span>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
