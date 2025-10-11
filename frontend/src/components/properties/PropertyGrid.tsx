'use client'

import React from 'react'
import PropertyCard from './PropertyCard'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'

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

interface PropertyGridProps {
  properties: Property[]
  loading: boolean
  viewMode?: 'grid' | 'list'
  onClearFilters?: () => void
}

export default function PropertyGrid({
  properties,
  loading,
  viewMode = 'grid',
  onClearFilters
}: PropertyGridProps) {
  if (loading) {
    return (
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
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">
          No properties found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Try adjusting your search criteria
        </p>
        {onClearFilters && (
          <Button onClick={onClearFilters}>Clear Filters</Button>
        )}
      </div>
    )
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} viewMode={viewMode} />
      ))}
    </div>
  )
}
