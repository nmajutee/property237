'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Checkbox } from '../ui/Checkbox'

export interface RegisterFormData {
  email: string
  first_name: string
  last_name: string
  user_type: 'tenant' | 'agent'
  phone_number: string
  password: string
  password_confirm: string
  terms_accepted: boolean
}

interface BasicRegistrationFormProps {
  onSubmit: (data: RegisterFormData) => void
  loading?: boolean
  error?: string
}

export const BasicRegistrationForm: React.FC<BasicRegistrationFormProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    first_name: '',
    last_name: '',
    user_type: 'tenant',
    phone_number: '',
    password: '',
    password_confirm: '',
    terms_accepted: false
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const userTypeOptions = [
    { value: 'tenant', label: 'Tenant (Property Seeker)' },
    { value: 'agent', label: 'Real Estate Agent' }
  ]

  const updateField = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.first_name) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name) {
      errors.last_name = 'Last name is required'
    }

    if (!formData.phone_number) {
      errors.phone_number = 'Phone number is required'
    } else if (!/^(\+237)?[6-9]\d{8}$/.test(formData.phone_number.replace(/\s|-/g, ''))) {
      errors.phone_number = 'Please enter a valid Cameroon phone number (e.g., +237670000000)'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match'
    }

    if (!formData.terms_accepted) {
      errors.terms_accepted = 'You must accept the terms and conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join Property237 to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            value={formData.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            placeholder="Enter your first name"
            error={validationErrors.first_name}
            required
          />

          <Input
            label="Last Name"
            type="text"
            value={formData.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            placeholder="Enter your last name"
            error={validationErrors.last_name}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="Enter your email address"
          error={validationErrors.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone_number}
          onChange={(e) => updateField('phone_number', e.target.value)}
          placeholder="+237 670 000 000"
          error={validationErrors.phone_number}
          required
        />

        <Select
          label="I am a"
          options={userTypeOptions}
          value={formData.user_type}
          onChange={(e) => updateField('user_type', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="Enter your password"
            error={validationErrors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.password_confirm}
            onChange={(e) => updateField('password_confirm', e.target.value)}
            placeholder="Confirm your password"
            error={validationErrors.password_confirm}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={formData.terms_accepted}
              onChange={(checked) => updateField('terms_accepted', checked)}
            />
            <div>
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="/terms" className="text-property237-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-property237-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
              {validationErrors.terms_accepted && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                  {validationErrors.terms_accepted}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-property237-primary hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}