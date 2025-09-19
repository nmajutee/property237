'use client'

import React from 'react'
import { cn } from '../../design-system/utils'
import { NavigationBar } from '../composite/NavigationBar'
import { Button } from '../ui/Button'

// Progress Step Component
interface ProgressStepProps {
  step: number
  currentStep: number
  title: string
  isCompleted?: boolean
  isLast?: boolean
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  step,
  currentStep,
  title,
  isCompleted = false,
  isLast = false
}) => {
  const isActive = step === currentStep
  const isPast = step < currentStep || isCompleted

  return (
    <div className="flex items-center">
      {/* Step Circle */}
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
        isPast
          ? "bg-property237-primary border-property237-primary text-white"
          : isActive
          ? "border-property237-primary text-property237-primary bg-property237-primary/10"
          : "border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500"
      )}>
        {isPast ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-sm font-bold">{step}</span>
        )}
      </div>

      {/* Step Title */}
      <div className="ml-3 hidden sm:block">
        <p className={cn(
          "text-sm font-bold transition-colors font-display",
          isActive ? "text-property237-primary" : "text-gray-500 dark:text-gray-400"
        )}>
          {title}
        </p>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div className={cn(
          "flex-1 h-0.5 ml-4 transition-colors",
          isPast ? "bg-property237-primary" : "bg-gray-200 dark:bg-gray-700"
        )} />
      )}
    </div>
  )
}

// Progress Bar Component
interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
      <div
        className="bg-property237-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
      />
    </div>
  )
}

// Main Wizard Layout Component
interface WizardLayoutProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  canGoNext?: boolean
  canGoBack?: boolean
  nextLabel?: string
  backLabel?: string
  isLoading?: boolean
  showThemeToggle?: boolean
  isDarkMode?: boolean
  onThemeToggle?: () => void
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  children,
  onBack,
  onNext,
  canGoNext = true,
  canGoBack = true,
  nextLabel = "Continue",
  backLabel = "Back",
  isLoading = false,
  showThemeToggle = true,
  isDarkMode = false,
  onThemeToggle
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <NavigationBar
          showThemeToggle={showThemeToggle}
          isDarkMode={isDarkMode}
          onThemeToggle={onThemeToggle}
        />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-2xl">
            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {stepTitles.map((title, index) => (
                <ProgressStep
                  key={index}
                  step={index + 1}
                  currentStep={currentStep}
                  title={title}
                  isLast={index === stepTitles.length - 1}
                />
              ))}
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-background-dark shadow-xl rounded-xl p-8 space-y-6 border border-property237-primary/10 dark:border-property237-primary/20">
              {/* Step Content */}
              <div className="min-h-[400px]">
                {children}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={onBack}
                  disabled={!canGoBack || currentStep === 1}
                >
                  {backLabel}
                </Button>

                <Button
                  variant="default"
                  size="default"
                  onClick={onNext}
                  disabled={!canGoNext}
                  loading={isLoading}
                  loadingText="Processing..."
                >
                  {nextLabel}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default WizardLayout