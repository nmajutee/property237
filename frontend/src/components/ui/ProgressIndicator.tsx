'use client'

import React from 'react'
import { cn } from '../../design-system/utils'
import { CheckIcon } from 'lucide-react'

export interface WizardStep {
  id: string
  title: string
  description: string
  completed?: boolean
  current?: boolean
}

interface ProgressIndicatorProps {
  steps: WizardStep[]
  currentStepIndex: number
  className?: string
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  className
}) => {
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-property237-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isFuture = index > currentStepIndex

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-1/2 w-full h-0.5 -z-10',
                    isCompleted || (isCurrent && index < steps.length - 1)
                      ? 'bg-property237-primary'
                      : 'bg-gray-200 dark:bg-gray-700'
                  )}
                />
              )}

              {/* Step Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-colors',
                  isCompleted && 'bg-property237-primary text-white',
                  isCurrent && 'bg-property237-primary/10 dark:bg-property237-primary/20 text-property237-primary ring-2 ring-property237-primary',
                  isFuture && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <div className="text-center">
                <div
                  className={cn(
                    'text-xs font-medium mb-1',
                    isCurrent && 'text-property237-primary',
                    isCompleted && 'text-gray-700 dark:text-gray-300',
                    isFuture && 'text-gray-400'
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 max-w-20 leading-tight">
                  {step.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {steps[currentStepIndex]?.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {steps[currentStepIndex]?.description}
          </div>
        </div>
      </div>
    </div>
  )
}