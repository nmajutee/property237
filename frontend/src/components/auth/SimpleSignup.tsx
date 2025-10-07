'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { PhoneInput } from '../ui/PhoneInput'
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface SignupFormData {
  full_name: string
  username: string
  email: string
  phone_number: string
  country_code: string
  password: string
  confirm_password: string
  user_type: 'tenant' | 'agent'
}

interface SimpleSignupProps {
  onSignup: (data: SignupFormData) => Promise<void>
  onLoginClick: () => void
  loading?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export const SimpleSignup: React.FC<SimpleSignupProps> = ({
  onSignup,
  onLoginClick,
  loading = false,
  error,
  fieldErrors = {}
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    username: '',
    email: '',
    phone_number: '',
    country_code: '+237',
    password: '',
    confirm_password: '',
    user_type: 'tenant'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required'
    } else if (!/^\d{9}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Phone must be 9 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any previous errors
    setErrors({})
    
    // Validate form
    if (validateForm()) {
      await onSignup(formData)
    }
  }

  // Merge backend field errors with frontend validation errors
  const displayErrors = { ...errors, ...fieldErrors }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Property237
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join Property237 to find or list properties
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
                error={displayErrors.full_name}
                leftIcon={<UserIcon className="h-5 w-5" />}
              />
            </div>

            {/* Username */}
            <div>
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a unique username"
                required
                error={displayErrors.username}
                leftIcon={<UserIcon className="h-5 w-5" />}
              />
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                error={displayErrors.email}
                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <Select
                    options={[
                      { value: '+237', label: '+237 (CM)' },
                      { value: '+234', label: '+234 (NG)' },
                      { value: '+225', label: '+225 (CI)' }
                    ]}
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                    className="w-32"
                  />
                  <Input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="698765432"
                    required
                    error={displayErrors.phone_number}
                    className="flex-1"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  OTP will be sent to this number for verification
                </p>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 8 characters"
                required
                error={displayErrors.password}
                leftIcon={<LockClosedIcon className="h-5 w-5" />}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                placeholder="Re-enter password"
                required
                error={displayErrors.confirm_password || displayErrors.password_confirm}
                leftIcon={<LockClosedIcon className="h-5 w-5" />}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-property237-primary border-gray-300 dark:border-gray-600 rounded focus:ring-property237-primary focus:ring-offset-2 mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={onLoginClick}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            What happens next?
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>✓ We'll send an OTP code to your phone for verification</li>
            <li>✓ Once verified, you can start using the platform immediately</li>
            <li>✓ Buy credits to {formData.user_type === 'tenant' ? 'view property details' : 'list your properties'}</li>
            <li>✓ Upload documents later to verify your profile (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
