'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement forgot password API call
    console.log('Password reset requested for:', email)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 2000)
  }

  if (isSubmitted) {
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
            {/* Success Message */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <EnvelopeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
                Check Your Email
              </h2>

              <p className="text-body font-display text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-property237-primary">{email}</span>
              </p>

              <p className="text-small font-display text-gray-500 dark:text-gray-400 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>

                <Link href="/sign-in">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-2">
              Forgot Password?
            </h2>
            <p className="text-body font-display text-gray-600 dark:text-gray-400">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2 font-display">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-property237-primary focus:border-transparent font-display"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400 font-display">OR</span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            <Link href="/sign-in">
              <Button variant="ghost" className="w-full">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>

            <p className="text-small font-display text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/sign-up"
                className="text-property237-primary hover:text-property237-dark font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-property237-primary font-display"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}