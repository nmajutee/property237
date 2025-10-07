'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SignUpCard, UserRole } from '../../components/auth/SignUpCard'
import { SimpleSignup } from '../../components/auth/SimpleSignup'
import { authAPI } from '../../services/api'

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

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<'role' | 'details'>('role')
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep('details')
  }

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.signup({
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        phone_number: data.country_code + data.phone_number,
        password: data.password,
        password_confirm: data.confirm_password,
        user_type: selectedRole || data.user_type,
        terms_accepted: true
      })

      // Redirect to OTP verification
      window.location.href = `/verify-otp?phone=${encodeURIComponent(data.country_code + data.phone_number)}`
    } catch (err: any) {
      console.error('Signup error:', err.response?.data)

      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            // Format field name nicely
            const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            const message = Array.isArray(messages) ? messages.join(', ') : messages
            
            // Add helpful hints for common errors
            if (message.includes('already registered') || message.includes('already taken')) {
              return `${fieldName}: ${message}. Already have an account? Try logging in.`
            }
            return `${fieldName}: ${message}`
          })
          .join('. ')
        setError(errorMessages)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (!err.response) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError('Registration failed. Please try again.')
      }

      setLoading(false)
    }
  }

  const handleLoginClick = () => {
    window.location.href = '/sign-in'
  }

  const handleBack = () => {
    setStep('role')
    setSelectedRole(null)
  }

  // Show role selection step
  if (step === 'role') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <SignUpCard
          onSelectRole={handleRoleSelect}
          loading={loading}
          error={error}
        />
      </div>
    )
  }

  // Show details form step
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="relative">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to role selection
        </button>

        <SimpleSignup
          onSignup={handleSignup}
          onLoginClick={handleLoginClick}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}