'use client'

import React from 'react'
import { Input } from '../../ui/Input'
import { PhoneInput } from '../../ui/PhoneInput'
import { Select } from '../../ui/Select'
import { UserIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { AgentPersonalInfo } from '../AgentOnboardingWizard'

interface PersonalInfoStepProps {
  data: AgentPersonalInfo
  onChange: (data: Partial<AgentPersonalInfo>) => void
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange
}) => {
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' }
  ]

  const updateField = (field: keyof AgentPersonalInfo, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your legal name and contact details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Legal Name */}
        <div className="md:col-span-2">
          <Input
            label="Full Legal Name"
            placeholder="Enter your full legal name"
            value={data.fullLegalName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('fullLegalName', e.target.value)}
            leftIcon={<UserIcon className="h-5 w-5" />}
            helperText="Must match your official ID documents"
            required
          />
        </div>

        {/* Display Name */}
        <div className="md:col-span-2">
          <Input
            label="Display Name"
            placeholder="How you'd like to appear to clients"
            value={data.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('displayName', e.target.value)}
            leftIcon={<UserIcon className="h-5 w-5" />}
            helperText="This name will be visible on your profile"
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          value={data.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          helperText="We'll send important updates here"
          required
        />

        {/* Phone */}
        <div>
          <PhoneInput
            label="Phone Number"
            value={data.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('phone', e.target.value)}
            countryCode={data.countryCode}
            onCountryChange={(code: string) => updateField('countryCode', code)}
            helperText="Used for mobile money verification"
            required
          />
        </div>

        {/* Date of Birth */}
        <Input
          type="date"
          label="Date of Birth (Optional)"
          value={data.dateOfBirth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dateOfBirth', e.target.value)}
          leftIcon={<CalendarIcon className="h-5 w-5" />}
          helperText="Helps verify your identity"
        />

        {/* Language Preference */}
        <Select
          label="Preferred Language"
          options={languageOptions}
          value={data.language}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('language', e.target.value as 'en' | 'fr')}
          helperText="Your preferred language for communication"
          required
        />
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Important:</strong> All information must be accurate and match your official documents.
              This will be verified during the KYC process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}