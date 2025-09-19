'use client'

import React from 'react'
import { Button } from '../../ui/Button'
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline'

interface TenantOnboardingSuccessProps {
  tenantName?: string
  onContinue?: () => void
  onReturnHome?: () => void
}

export const TenantOnboardingSuccess: React.FC<TenantOnboardingSuccessProps> = ({
  tenantName = 'Tenant',
  onContinue,
  onReturnHome
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to Property237!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hi {tenantName}, your tenant profile has been successfully created.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            You can now start searching for properties, connect with agents, and manage your rental journey.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            What's Next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse available properties in your preferred locations
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with verified agents and property owners
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete your profile verification for better matches
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set up alerts for properties matching your criteria
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onContinue && (
            <Button
              onClick={onContinue}
              className="w-full"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Start Property Search
            </Button>
          )}

          {onReturnHome && (
            <Button
              variant="outline"
              onClick={onReturnHome}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@property237.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@property237.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}