'use client'

import React from 'react'
import { useTenantForm } from '../TenantFormContext'
import { FileUpload, UploadedFile } from '../../../ui/FileUpload'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { Input } from '../../../ui/Input'
import { Select } from '../../../ui/Select'

export const Step3DocumentVerification: React.FC = () => {
  const { state, updateDocumentVerification } = useTenantForm()
  const { documentVerification } = state

  const handleIdDocumentChange = (files: UploadedFile[]) => {
    updateDocumentVerification({ idDocument: files })
  }

  const handleAddressVerificationChange = (files: UploadedFile[]) => {
    updateDocumentVerification({ addressVerification: files })
  }

  const handleTaxpayerCardChange = (files: UploadedFile[]) => {
    updateDocumentVerification({ taxpayerCard: files })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your identification documents for verification
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="ID Document Type"
            options={[
              { value: 'national_id', label: 'National ID' },
              { value: 'passport', label: 'Passport' },
              { value: 'drivers_license', label: 'Driver\'s License' }
            ]}
            value={documentVerification.idType}
            onChange={(e) => updateDocumentVerification({ idType: e.target.value })}
            required
          />

          <Input
            label="ID Number"
            type="text"
            value={documentVerification.idNumber}
            onChange={(e) => updateDocumentVerification({ idNumber: e.target.value })}
            placeholder="Enter your ID number"
            required
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Document <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onFilesChange={handleIdDocumentChange}
              files={documentVerification.idDocument}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5242880} // 5MB
              multiple={false}
              description="Upload clear photos of your ID (front and back if applicable)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Verification <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onFilesChange={handleAddressVerificationChange}
              files={documentVerification.addressVerification}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5242880} // 5MB
              multiple={false}
              description="Utility bill or bank statement (not older than 3 months)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Taxpayer Card <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onFilesChange={handleTaxpayerCardChange}
              files={documentVerification.taxpayerCard}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5242880} // 5MB
              multiple={false}
              description="Photo of your taxpayer identification card"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Document Requirements
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Documents must be clear and readable</li>
            <li>• Maximum file size: 5MB per document</li>
            <li>• Accepted formats: PDF, JPG, PNG</li>
            <li>• Address verification must be less than 3 months old</li>
            <li>• Taxpayer card must be current and valid</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Step3DocumentVerification