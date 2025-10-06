'use client'

import React from 'react'
import { CreditCardIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface CreditBalanceProps {
  balance: number
  userType: 'tenant' | 'agent'
  onBuyCredits: () => void
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({
  balance,
  userType,
  onBuyCredits
}) => {
  const isLowBalance = balance < 10

  return (
    <div className={`rounded-lg p-4 border-2 ${
      isLowBalance
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        : 'bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border-green-200 dark:border-green-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isLowBalance ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
          }`}>
            <CreditCardIcon className={`w-6 h-6 ${
              isLowBalance ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your Credits
            </p>
            <p className={`text-2xl font-bold ${
              isLowBalance ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {balance} {balance === 1 ? 'credit' : 'credits'}
            </p>
          </div>
        </div>

        <button
          onClick={onBuyCredits}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
            isLowBalance
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Buy Credits</span>
        </button>
      </div>

      {isLowBalance && (
        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            ⚠️ Low balance! Buy more credits to continue {userType === 'tenant' ? 'viewing properties' : 'listing properties'}.
          </p>
        </div>
      )}
    </div>
  )
}
