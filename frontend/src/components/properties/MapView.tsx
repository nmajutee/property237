'use client'

import React from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface MapViewProps {
  show: boolean
  height?: string
}

export default function MapView({ show, height = 'h-64 sm:h-80 md:h-96' }: MapViewProps) {
  if (!show) return null

  return (
    <div className={`${height} bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0`}>
      <div className="text-center px-4">
        <MapPinIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Map view coming soon</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Interactive property map will be displayed here
        </p>
      </div>
    </div>
  )
}
