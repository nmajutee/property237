'use client'

import React from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your Property237 account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <Input
              type="email"
              label="Email or Phone"
              placeholder="Enter your email or phone number"
              leftIcon={<UserIcon className="h-5 w-5" />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              leftIcon={<LockClosedIcon className="h-5 w-5" />}
              required
            />

            <Button type="submit" fullWidth size="lg">
              Sign In
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <a
              href="#"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Forgot your password?
            </a>

            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}