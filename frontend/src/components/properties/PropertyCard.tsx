'use client'

import React from 'react'
import Link from 'next/link'
import { BuildingOfficeIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline'

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

interface PropertyCardProps {
  property: Property
  viewMode?: 'grid' | 'list'
}

export default function PropertyCard({ property, viewMode = 'grid' }: PropertyCardProps) {
  if (viewMode === 'list') {
    // List view layout
    return (
      <Link
        href={`/properties/${property.id}`}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col sm:flex-row"
      >
        <div className="relative w-full sm:w-72 h-48 sm:h-auto bg-gray-200 dark:bg-gray-700 flex-shrink-0">
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

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white group-hover:text-property237-primary transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm">
              {property.area.city.name}, {property.area.name}
            </span>
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

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-2xl font-heading font-bold text-property237-primary">
                {parseFloat(property.price).toLocaleString()} {property.currency}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">/month</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view layout (default)
  return (
    <Link
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
          <span className="text-sm truncate">
            {property.area.city.name}, {property.area.name}
          </span>
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
  )
}
