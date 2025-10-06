'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CreditPackage {
  id: string
  credits: number
  price: number
  currency: string
  popular?: boolean
  bonus?: number
}

interface CreditPurchaseProps {
  userType: 'tenant' | 'agent'
  onPurchase: (packageId: string) => Promise<void>
  onClose: () => void
  loading?: boolean
  error?: string
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    credits: 10,
    price: 1000,
    currency: 'XAF'
  },
  {
    id: 'basic',
    credits: 25,
    price: 2000,
    currency: 'XAF',
    bonus: 5
  },
  {
    id: 'popular',
    credits: 50,
    price: 3500,
    currency: 'XAF',
    popular: true,
    bonus: 15
  },
  {
    id: 'premium',
    credits: 100,
    price: 6000,
    currency: 'XAF',
    bonus: 30
  },
  {
    id: 'business',
    credits: 250,
    price: 12500,
    currency: 'XAF',
    bonus: 100
  }
]

export const CreditPurchase: React.FC<CreditPurchaseProps> = ({
  userType,
  onPurchase,
  onClose,
  loading = false,
  error
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('popular')

  const handlePurchase = async () => {
    await onPurchase(selectedPackage)
  }

  const getTotalCredits = (pkg: CreditPackage) => {
    return pkg.credits + (pkg.bonus || 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-yellow-500 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Buy Credits
              </h2>
              <p className="text-white/90">
                {userType === 'tenant'
                  ? 'Get credits to view full property details'
                  : 'Get credits to list your properties'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Packages */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {getTotalCredits(pkg)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    credits
                  </div>

                  {pkg.bonus && pkg.bonus > 0 && (
                    <div className="mb-2">
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded">
                        +{pkg.bonus} BONUS
                      </span>
                    </div>
                  )}

                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {pkg.price.toLocaleString()} {pkg.currency}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ~{(pkg.price / getTotalCredits(pkg)).toFixed(0)} XAF/credit
                  </div>
                </div>

                {selectedPackage === pkg.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How Credits Work
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {userType === 'tenant' ? (
                <>
                  <li>• 1 credit = View one property's full details</li>
                  <li>• Browse listings for free (basic info only)</li>
                  <li>• Credits are used only when viewing full details</li>
                  <li>• Credits never expire</li>
                </>
              ) : (
                <>
                  <li>• 5 credits = List one property</li>
                  <li>• Your listings stay active until you remove them</li>
                  <li>• Featured listings available for extra visibility</li>
                  <li>• Credits never expire</li>
                </>
              )}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Payment Method
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border-2 border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">MTN MoMo</span>
              </button>
              <button className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed">
                <div className="w-8 h-8 bg-orange-500 rounded"></div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Orange Money</span>
              </button>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full"
            loading={loading}
            disabled={loading}
            leftIcon={<SparklesIcon className="w-5 h-5" />}
          >
            Purchase {getTotalCredits(CREDIT_PACKAGES.find(p => p.id === selectedPackage)!)} Credits for{' '}
            {CREDIT_PACKAGES.find(p => p.id === selectedPackage)!.price.toLocaleString()} XAF
          </Button>
        </div>
      </div>
    </div>
  )
}
