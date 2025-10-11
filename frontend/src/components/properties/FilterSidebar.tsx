'use client'

import React from 'react'
import { Button } from '../ui/Button'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface PropertyType {
  id: string | number
  name: string
}

interface FilterSidebarProps {
  // Filter states
  rentalPeriod: 'long-term' | 'short-term'
  setRentalPeriod: (period: 'long-term' | 'short-term') => void
  propertyTypes: PropertyType[]
  selectedType: string
  setSelectedType: (type: string) => void
  selectedBedrooms: string[]
  toggleBedroom: (value: string) => void
  selectedBathrooms: string
  setSelectedBathrooms: (value: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSearch: () => void
  onClearFilters: () => void
  // Mobile
  isOpen?: boolean
  onClose?: () => void
}

export default function FilterSidebar({
  rentalPeriod,
  setRentalPeriod,
  propertyTypes,
  selectedType,
  setSelectedType,
  selectedBedrooms,
  toggleBedroom,
  selectedBathrooms,
  setSelectedBathrooms,
  searchTerm,
  setSearchTerm,
  onSearch,
  onClearFilters,
  isOpen = true,
  onClose
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        {onClose && (
          <div className="md:hidden flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Rental Period */}
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              Rental period
            </h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={rentalPeriod === 'long-term'}
                  onChange={() => setRentalPeriod('long-term')}
                  className="w-4 h-4 text-property237-primary border-gray-300 focus:ring-property237-primary"
                />
                <span className="ml-2 text-sm font-heading text-gray-700 dark:text-gray-300">
                  Long term
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={rentalPeriod === 'short-term'}
                  onChange={() => setRentalPeriod('short-term')}
                  className="w-4 h-4 text-property237-primary border-gray-300 focus:ring-property237-primary"
                />
                <span className="ml-2 text-sm font-heading text-gray-700 dark:text-gray-300">
                  Short term
                </span>
              </label>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              Property type
            </h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {propertyTypes.map((type) => (
                <label key={type.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedType === type.id.toString()}
                    onChange={() =>
                      setSelectedType(selectedType === type.id.toString() ? '' : type.id.toString())
                    }
                    className="w-4 h-4 text-property237-primary border-gray-300 rounded focus:ring-property237-primary"
                  />
                  <span className="ml-2 text-sm font-heading text-gray-700 dark:text-gray-300">
                    {type.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              Bedrooms
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2', '3', '4+'].map((num) => (
                <button
                  key={num}
                  onClick={() => toggleBedroom(num)}
                  className={`py-2 px-2 text-sm font-heading font-medium rounded border transition-colors ${
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
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              Bathroom
            </h3>
            <select
              value={selectedBathrooms}
              onChange={(e) => setSelectedBathrooms(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm font-heading text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
            >
              <option value="any">Any</option>
              <option value="combined">Combined</option>
              <option value="separate">Separate</option>
            </select>
          </div>

          {/* View Type */}
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              View
            </h3>
            <div className="space-y-2">
              {['Any', 'Courtyard', 'Street'].map((view) => (
                <label key={view} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="view"
                    defaultChecked={view === 'Any'}
                    className="w-4 h-4 text-property237-primary border-gray-300 focus:ring-property237-primary"
                  />
                  <span className="ml-2 text-sm font-heading text-gray-700 dark:text-gray-300">
                    {view}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Search by Location */}
          <div>
            <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white mb-3">
              Location
            </h3>
            <div className="relative mb-2.5">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="City, area..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm font-heading text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
              />
            </div>
            <Button onClick={onSearch} className="w-full text-sm font-heading py-2" size="sm">
              Search
            </Button>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={onClearFilters}
            className="w-full py-2 px-4 text-sm font-heading font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </aside>
    </>
  )
}
