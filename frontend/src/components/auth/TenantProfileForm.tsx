'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { PhoneInput } from '../ui/PhoneInput'
import { Select } from '../ui/Select'
import { UserIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

interface TenantProfileData {
  fullName: string
  phone: string
  email: string
  countryCode: string
  language: 'en' | 'fr'
  locationPermission: boolean
}

interface TenantProfileFormProps {
  onSubmit: (data: TenantProfileData) => void
  loading?: boolean
  error?: string
}

export const TenantProfileForm: React.FC<TenantProfileFormProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<TenantProfileData>({
    fullName: '',
    phone: '',
    email: '',
    countryCode: '+237',
    language: 'en',
    locationPermission: false
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' }
  ]

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().split(' ').length < 2) {
      errors.fullName = 'Please enter both first and last name'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 9-digit phone number'
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLocationRequest = async () => {
    setIsRequestingLocation(true)

    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({ ...prev, locationPermission: true }))
            setIsRequestingLocation(false)
            // Store coordinates for later use
            localStorage.setItem('userLocation', JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }))
          },
          (error) => {
            console.log('Location permission denied:', error)
            setIsRequestingLocation(false)
            // Continue without location
          }
        )
      }
    } catch (error) {
      setIsRequestingLocation(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateFormData = (field: keyof TenantProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create Your Tenant Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick setup to start finding your perfect home
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('fullName', e.target.value)}
            error={formErrors.fullName}
            required
            leftIcon={<UserIcon className="h-5 w-5" />}
          />

          {/* Phone Number */}
          <PhoneInput
            label="Phone Number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('phone', e.target.value)}
            countryCode={formData.countryCode}
            onCountryChange={(code: string) => updateFormData('countryCode', code)}
            error={formErrors.phone}
            helperText="We'll send you a verification code"
            required
          />

          {/* Email (Optional) */}
          <Input
            type="email"
            label="Email Address (Optional)"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('email', e.target.value)}
            error={formErrors.email}
            helperText="For important updates and notifications"
          />

          {/* Language Preference */}
          <Select
            label="Preferred Language"
            options={languageOptions}
            value={formData.language}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('language', e.target.value as 'en' | 'fr')}
            required
          />

          {/* Location Permission */}
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Find Properties Near You
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Allow location access to see nearby properties and get personalized recommendations
                  </p>

                  {!formData.locationPermission ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLocationRequest}
                      loading={isRequestingLocation}
                      leftIcon={<GlobeAltIcon className="h-4 w-4" />}
                    >
                      {isRequestingLocation ? 'Requesting...' : 'Allow Location Access'}
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium">Location access granted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateFormData('locationPermission', false)}
              className="w-full text-gray-600 dark:text-gray-400"
            >
              Skip for now - I'll browse all properties
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-8"
          >
            Create Tenant Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}