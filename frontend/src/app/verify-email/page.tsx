'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '../../components/ui/Button'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (tokenParam) {
      setToken(tokenParam)
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam))
      }
      verifyEmail(tokenParam)
    } else {
      setVerificationStatus('error')
    }
  }, [searchParams])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const verifyEmail = async (verificationToken: string) => {
    try {
      // TODO: Implement email verification API call
      console.log('Verifying email with token:', verificationToken)

      // Simulate API call
      setTimeout(() => {
        // Randomly simulate success or expired token
        const isSuccess = Math.random() > 0.3 // 70% success rate for demo
        if (isSuccess) {
          setVerificationStatus('success')
        } else {
          setVerificationStatus('expired')
        }
      }, 2000)
    } catch (err) {
      console.error('Email verification failed:', err)
      setVerificationStatus('error')
    }
  }

  const handleResendVerification = async () => {
    if (!email) return

    setIsResending(true)

    try {
      // TODO: Implement resend verification API call
      console.log('Resending verification to:', email)

      // Simulate API call
      setTimeout(() => {
        setIsResending(false)
        setResendCooldown(60) // 60 second cooldown
      }, 1500)
    } catch (err) {
      console.error('Failed to resend verification:', err)
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary mx-auto mb-4"></div>
            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
              Verifying Your Email
            </h2>
            <p className="text-body font-display text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
              Email Verified Successfully!
            </h2>

            <p className="text-body font-display text-gray-600 dark:text-gray-400 mb-6">
              Your email address has been verified. You can now access all features of your Property237 account.
            </p>

            <div className="space-y-4">
              <Link href="/sign-in">
                <Button variant="default" className="w-full">
                  Continue to Sign In
                </Button>
              </Link>

              <Link href="/dashboard/tenant">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>

            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
              Verification Link Expired
            </h2>

            <p className="text-body font-display text-gray-600 dark:text-gray-400 mb-6">
              This verification link has expired. We can send you a new verification email.
            </p>

            {email && (
              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  variant="default"
                  className="w-full"
                  disabled={isResending || resendCooldown > 0}
                >
                  {isResending ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Send New Verification Email
                    </>
                  )}
                </Button>

                <Link href="/sign-in">
                  <Button variant="ghost" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )

      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-h2 font-display text-gray-900 dark:text-gray-100 mb-4">
              Verification Failed
            </h2>

            <p className="text-body font-display text-gray-600 dark:text-gray-400 mb-6">
              We couldn't verify your email address. The link may be invalid or has already been used.
            </p>

            <div className="space-y-4">
              <Link href="/sign-up">
                <Button variant="default" className="w-full">
                  Create New Account
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="ghost" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )
    }
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
          {renderContent()}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}