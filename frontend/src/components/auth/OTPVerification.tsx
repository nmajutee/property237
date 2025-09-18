'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { OTPInput } from '../ui/OTPInput'
import { PhoneIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface OTPVerificationProps {
  phoneNumber: string
  onVerify: (otp: string) => void
  onResend: () => void
  onBack?: () => void
  loading?: boolean
  error?: string
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  loading = false,
  error
}) => {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOTPComplete = (value: string) => {
    setOtp(value)
    if (value.length === 6) {
      onVerify(value)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setCanResend(false)
    setTimeLeft(300) // Reset timer
    setOtp('') // Clear current OTP

    try {
      await onResend()
    } finally {
      setResendLoading(false)
    }
  }

  const handleManualVerify = () => {
    if (otp.length === 6) {
      onVerify(otp)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verify Your Phone
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a 6-digit code to
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {phoneNumber}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPComplete}
            disabled={loading}
            error={error && otp.length === 6 ? 'Invalid verification code' : undefined}
          />
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {!canResend ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                Resend code in {formatTime(timeLeft)}
              </span>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResend}
              loading={resendLoading}
              disabled={loading}
            >
              Resend verification code
            </Button>
          )}
        </div>

        {/* Verify Button */}
        <div className="space-y-4">
          <Button
            onClick={handleManualVerify}
            fullWidth
            size="lg"
            loading={loading}
            disabled={otp.length !== 6}
          >
            Verify & Complete Registration
          </Button>

          {onBack && (
            <Button
              variant="outline"
              fullWidth
              onClick={onBack}
              disabled={loading}
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Back to Profile
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Didn't receive the code? Check your SMS or try resending
          </p>
        </div>
      </div>
    </div>
  )
}