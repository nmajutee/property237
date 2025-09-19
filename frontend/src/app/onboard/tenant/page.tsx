'use client'

import React, { useState } from 'react'
import { TenantProfileForm } from '../../../components/auth/tenant/TenantProfileForm'
import { OTPVerification } from '../../../components/auth/OTPVerification'

type OnboardingStep = 'profile' | 'otp' | 'success'

interface TenantData {
  fullName: string
  phone: string
  email: string
  countryCode: string
  language: 'en' | 'fr'
  locationPermission: boolean
}

export default function TenantOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile')
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleProfileSubmit = async (data: TenantData) => {
    setLoading(true)
    setError('')

    try {
      // Simulate API call to create tenant profile and send OTP
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real implementation, this would call your backend
      console.log('Creating tenant profile:', data)

      setTenantData(data)
      setCurrentStep('otp')
    } catch (err) {
      setError('Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async (otp: string) => {
    setLoading(true)
    setError('')

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate success/failure
      if (otp === '123456') {
        // Success flow
        setCurrentStep('success')

        // In real implementation, store auth tokens and redirect
        setTimeout(() => {
          window.location.href = '/dashboard/tenant'
        }, 2000)
      } else {
        throw new Error('Invalid OTP')
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPResend = async () => {
    // Simulate resend OTP
    console.log('Resending OTP to:', tenantData?.phone)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleBack = () => {
    setCurrentStep('profile')
    setError('')
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Property237!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your tenant account has been created successfully. Redirecting to your dashboard...
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {currentStep === 'profile' && (
        <TenantProfileForm
          onSubmit={handleProfileSubmit}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === 'otp' && tenantData && (
        <OTPVerification
          phoneNumber={`${tenantData.countryCode} ${tenantData.phone}`}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onBack={handleBack}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}