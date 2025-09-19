'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AuthErrorPage() {
  const title = "Authentication Error"
  const message = "Something went wrong with your authentication request. Please try again."
  const showBackButton = true
  const showHomeButton = true
  const showLoginButton = true
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold font-display text-property237-primary">
              Property237
            </h1>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
              {title}
            </h2>

            <p className="text-body font-display text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>

            <div className="space-y-4">
              {showBackButton && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              )}

              {showLoginButton && (
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full">
                    Try Sign In Again
                  </Button>
                </Link>
              )}

              {showHomeButton && (
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-6 text-center">
          <p className="text-small font-display text-gray-500 dark:text-gray-400 mb-2">
            Need help?
          </p>
          <div className="space-x-4">
            <a
              href="/support"
              className="text-sm text-property237-primary hover:text-property237-dark font-display"
            >
              Contact Support
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/faq"
              className="text-sm text-property237-primary hover:text-property237-dark font-display"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}