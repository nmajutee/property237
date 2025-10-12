'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy My Properties Page - Redirects to Dashboard
 * 
 * This page has been replaced by the new dashboard properties page
 * which uses the consistent DashboardLayout component with sidebar navigation.
 * 
 * Old route: /my-properties
 * New route: /dashboard/agent/properties
 */
export default function MyPropertiesRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new dashboard properties page with layout
    router.replace('/dashboard/agent/properties' as any)
  }, [router])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
