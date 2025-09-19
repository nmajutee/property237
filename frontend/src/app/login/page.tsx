'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new sign-in page
    router.replace('/sign-in')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary mx-auto mb-4"></div>
        <p className="text-body font-display text-gray-600 dark:text-gray-400">
          Redirecting to Sign In...
        </p>
      </div>
    </div>
  )
}