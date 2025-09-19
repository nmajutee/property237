'use client'

import React from 'react'
import { useTenantForm } from '../TenantFormContext'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'

export const Step4LeaseAgreement: React.FC = () => {
  const { state, updateLeaseAgreement } = useTenantForm()
  const { leaseAgreement } = state

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentCheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Lease Agreement
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review and accept the terms and conditions to complete your application
        </p>
      </div>

      {/* Agreement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Leasing Agreement
        </label>
        <div className="h-40 overflow-y-auto p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
          <p className="mb-4">
            By creating an account, you agree to the Property237 Terms & Conditions and Privacy Policy.
            You confirm the information provided is accurate and that you will comply with applicable laws and platform rules.
          </p>

          <h4 className="font-semibold mb-2">Key Terms:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>You must provide accurate and up-to-date information</li>
            <li>You agree to comply with property viewing guidelines</li>
            <li>You understand that all property listings are subject to availability</li>
            <li>You consent to receive communications regarding property matches</li>
            <li>You agree to the platform's dispute resolution process</li>
          </ul>
        </div>

        <label className="mt-4 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={leaseAgreement.lease_agreement_acceptance}
            onChange={(e) => updateLeaseAgreement({ lease_agreement_acceptance: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-property237-primary focus:ring-property237-primary"
          />
          <span className="text-gray-700 dark:text-gray-300">
            I agree to the Terms & Conditions and Privacy Policy
          </span>
        </label>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
          What's Next?
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200">
          After completing your application, our team will review your information and documents.
          You'll receive email updates about your verification status and property matches.
        </p>
      </div>
    </div>
  )
}

export default Step4LeaseAgreement
