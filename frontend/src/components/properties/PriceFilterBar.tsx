'use client'

import React from 'react'

interface PriceFilterBarProps {
  priceRange: { min: string; max: string }
  setPriceRange: (range: { min: string; max: string }) => void
}

export default function PriceFilterBar({ priceRange, setPriceRange }: PriceFilterBarProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <span className="text-sm font-heading font-semibold text-gray-900 dark:text-white">
          Price:
        </span>
        <div className="flex gap-2 items-center flex-1 max-w-md">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            placeholder="Min"
            className="w-full sm:w-28 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
          />
          <span className="text-sm text-gray-500">—</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            placeholder="Max"
            className="w-full sm:w-28 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
          />
        </div>
      </div>
    </div>
  )
}
