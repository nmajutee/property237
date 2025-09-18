'use client'

import React from 'react'
import { Button } from '../../../components/ui/Button'
import { HomeIcon, MapPinIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline'

export default function TenantDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Property237
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Property237!</h2>
          <p className="text-lg opacity-90 mb-4">
            Your tenant account is ready. Start exploring properties in Cameroon.
          </p>
          <Button variant="secondary" size="lg">
            Browse Properties
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <HomeIcon className="h-8 w-8 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Find Properties
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover your perfect home from thousands of verified listings
            </p>
            <Button variant="outline" fullWidth>
              Search Now
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <MapPinIcon className="h-8 w-8 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Near Me
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Properties close to your current location
            </p>
            <Button variant="outline" fullWidth>
              View Nearby
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <HeartIcon className="h-8 w-8 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Saved Properties
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your favorite properties and watchlist
            </p>
            <Button variant="outline" fullWidth>
              View Saved
            </Button>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Properties
          </h3>
          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No properties viewed yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Start exploring to see properties here
            </p>
            <Button>
              Browse Properties
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}