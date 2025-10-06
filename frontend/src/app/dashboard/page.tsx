'use client'

import React, { useState, useEffect } from 'react'
import { authAPI } from '../../services/api'
import { User } from '../../types/api'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    redirectToDashboard()
  }, [])

  const redirectToDashboard = async () => {
    try {
      const profileData = await authAPI.getProfile()
      const user = (profileData as any).user as User

      // Redirect based on user type
      if (user.user_type === 'tenant') {
        window.location.href = '/dashboard/tenant'
      } else if (user.user_type === 'agent') {
        window.location.href = '/dashboard/agent'
      } else {
        window.location.href = '/sign-in'
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/sign-in'
      } else {
        // Default to tenant dashboard if error
        window.location.href = '/dashboard/tenant'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
