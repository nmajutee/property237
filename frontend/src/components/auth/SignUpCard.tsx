'use client'

import React, { useState } from 'react'
import { HomeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { cn } from '../../design-system/utils'

export type UserRole = 'tenant' | 'agent'

interface RoleOptionProps {
  role: UserRole
  icon: React.ReactNode
  title: string
  onClick: () => void
  className?: string
}

const RoleOption: React.FC<RoleOptionProps> = ({
  role, // eslint-disable-line @typescript-eslint/no-unused-vars
  icon,
  title,
  onClick,
  className
}) => {
  return (
    <button
      type="button"
      role="button"
      aria-label={`Select ${title}`}
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-center gap-3 rounded-lg border-2 border-transparent',
        'bg-property237-primary/10 dark:bg-property237-primary/20 px-6 py-4 text-lg font-bold',
        'text-black dark:text-white transition-all',
        'hover:bg-property237-primary/20 dark:hover:bg-property237-primary/30 hover:border-property237-primary',
        'focus:outline-none focus:ring-2 focus:ring-property237-primary focus:ring-offset-2',
        'focus:ring-offset-background-light dark:focus:ring-offset-background-dark',
        className
      )}
    >
      <span className="text-2xl">{icon}</span>
      <span>{title}</span>
    </button>
  )
}

export interface SignUpCardProps {
  onSelectRole: (role: UserRole) => void
  loading?: boolean
  error?: string
}

export const SignUpCard: React.FC<SignUpCardProps> = ({
  onSelectRole,
  loading = false,
  error
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleRoleSelect = (role: UserRole) => {
    if (!termsAccepted) {
      return
    }
    onSelectRole(role)
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex items-center justify-between py-4 border-b border-property237-primary/20 dark:border-property237-primary/30">
            <div className="flex items-center gap-2">
              {/* Property237 Logo SVG */}
              <svg
                className="h-6 w-6 text-property237-primary"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              <h1 className="text-xl font-bold text-black dark:text-white">Property237</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Title Section */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-black dark:text-white">
                Join Property237 — Sign Up
              </h2>
              <p className="mt-2 text-base text-black/60 dark:text-white/60">
                Choose your role to get started.
              </p>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-background-dark shadow-xl rounded-xl p-8 space-y-6 border border-property237-primary/10 dark:border-property237-primary/20">
              {/* Role Selection */}
              <div className="space-y-4">
                <RoleOption
                  role="tenant"
                  icon={<HomeIcon className="h-6 w-6" />}
                  title="I'm a Tenant"
                  onClick={() => handleRoleSelect('tenant')}
                />

                <RoleOption
                  role="agent"
                  icon={<BuildingOffice2Icon className="h-6 w-6" />}
                  title="I'm an Agent"
                  onClick={() => handleRoleSelect('agent')}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center">
                <div className="flex-grow border-t border-property237-primary/20 dark:border-property237-primary/30"></div>
                <span className="mx-4 text-sm font-medium text-black/40 dark:text-white/40">OR</span>
                <div className="flex-grow border-t border-property237-primary/20 dark:border-property237-primary/30"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <a
                  className="font-medium text-property237-primary hover:text-property237-primary/80 transition-colors"
                  href="/login"
                >
                  Already have an account? Log in
                </a>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    className={cn(
                      'h-4 w-4 rounded border-property237-primary/50 text-property237-primary focus:ring-property237-primary',
                      'bg-background-light dark:bg-background-dark dark:border-property237-primary/60',
                      'transition-colors'
                    )}
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    className="font-medium text-black/80 dark:text-white/80 cursor-pointer"
                    htmlFor="terms"
                  >
                    I agree to the{' '}
                    <a
                      className="text-homefinder-primary hover:text-homefinder-primary/80 transition-colors"
                      href="/terms"
                    >
                      Terms & Conditions
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center text-sm text-black/60 dark:text-white/60">
                  Processing...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}