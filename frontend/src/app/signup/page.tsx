'use client'

import React from 'react'
import { SignUpCard, UserRole } from '../../components/auth/SignUpCard'

export default function SignUpPage() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleRoleSelect = async (role: UserRole) => {
    setLoading(true)
    setError('')

    try {
      // Simulate API call to register role selection
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Route to appropriate onboarding flow
      if (role === 'tenant') {
        window.location.href = '/onboard/tenant'
      } else if (role === 'agent') {
        window.location.href = '/onboard/agent'
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <SignUpCard
      onSelectRole={handleRoleSelect}
      loading={loading}
      error={error}
    />
  )
}