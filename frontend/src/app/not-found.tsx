'use client'

import React from 'react'
import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-property237-primary/10 to-property237-dark/10 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-property237-primary mb-4">404</h1>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <HomeIcon className="w-32 h-32 text-gray-300 dark:text-gray-600" />
              <MagnifyingGlassIcon className="w-16 h-16 text-property237-primary absolute -right-4 -bottom-4" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-property237-primary text-white font-semibold rounded-lg hover:bg-property237-dark transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Browse Properties
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Looking for something else?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link
              href="/about"
              className="text-property237-primary hover:text-property237-dark font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-property237-primary hover:text-property237-dark font-medium"
            >
              Contact
            </Link>
            <Link
              href="/help"
              className="text-property237-primary hover:text-property237-dark font-medium"
            >
              Help Center
            </Link>
            <Link
              href="/sign-in"
              className="text-property237-primary hover:text-property237-dark font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Error Code: 404 - Page Not Found
        </p>
      </div>
    </div>
  )
}
