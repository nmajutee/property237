'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/sign-up')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-property237-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to Sign Up...</p>
      </div>
    </div>
  )
}
