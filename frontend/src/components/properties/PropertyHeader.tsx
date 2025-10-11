'use client'

import React from 'react'
import { MapPinIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'

interface PropertyHeaderProps {
  title: string
  resultsCount: number
  showMap: boolean
  setShowMap: (show: boolean) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onOpenFilters?: () => void
}

export default function PropertyHeader({
  title,
  resultsCount,
  showMap,
  setShowMap,
  viewMode,
  setViewMode,
  onOpenFilters
}: PropertyHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-property237-primary border border-gray-300 dark:border-gray-600 rounded"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          )}

          <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {resultsCount} results
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-property237-primary flex items-center gap-1"
          >
            <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{showMap ? 'Hide' : 'Show'} map</span>
            <span className="sm:hidden">{showMap ? 'Hide' : 'Map'}</span>
          </button>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-property237-primary shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="Grid view"
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
              title="List view"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>

          <select className="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  )
}
