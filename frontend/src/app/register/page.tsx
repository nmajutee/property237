'use client'

import React, { useState } from 'react'
import { BasicRegistrationForm, RegisterFormData } from '../../components/auth/BasicRegistrationForm'
import { authService } from '../../services/authService'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.register(data)
      setSuccess(`Account created successfully! Welcome, ${response.user.full_name}`)
      console.log('Registration successful:', response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Registration Successful!
            </h2>
            <p className="text-green-700 dark:text-green-200">{success}</p>
            <button
              onClick={() => {
                setSuccess('')
                setError('')
              }}
              className="mt-4 text-green-600 hover:text-green-700 underline"
            >
              Register Another Account
            </button>
          </div>
        ) : (
          <BasicRegistrationForm
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}