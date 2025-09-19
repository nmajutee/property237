'use client'

import React, { useCallback } from 'react'
import { TenantFormProvider, useTenantForm } from './TenantFormContext'
import { Step1PersonalInfo } from './steps/Step1PersonalInfo'
import { Step2PropertyDetails } from './steps/Step2PropertyDetails'
import { Step3DocumentVerification } from './steps/Step3DocumentVerification'
import { Step4LeaseAgreement } from './steps/Step4LeaseAgreement'
import { Button } from '../../ui/Button'
import { ProgressIndicator, WizardStep } from '../../ui/ProgressIndicator'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface TenantOnboardingWizardProps {
  onComplete?: () => void
  onCancel?: () => void
  onBackToSignup?: () => void
}

const TenantWizardContent: React.FC<TenantOnboardingWizardProps> = ({
  onComplete,
  onCancel,
  onBackToSignup
}) => {
  const { state, nextStep, previousStep } = useTenantForm()
  const { currentStep } = state
  const totalSteps = 4

  // Define wizard steps for ProgressIndicator
  const wizardSteps: WizardStep[] = [
    {
      id: '1',
      title: 'Personal Info',
      description: 'Your basic information'
    },
    {
      id: '2',
      title: 'Property Preferences',
      description: 'What you\'re looking for'
    },
    {
      id: '3',
      title: 'Document Verification',
      description: 'Upload your documents'
    },
    {
      id: '4',
      title: 'Lease Agreement',
      description: 'Complete your application'
    }
  ]

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  const canProceed = () => {
    if (currentStep === 1) {
      const { personalInfo } = state
      return (
        personalInfo.username.trim() !== '' &&
        personalInfo.full_name.trim() !== '' &&
        personalInfo.email.trim() !== '' &&
        personalInfo.phone_number.trim() !== '' &&
        personalInfo.password.trim() !== ''
      )
    }
    if (currentStep === 2) {
      const { propertyDetails } = state
      return (
        propertyDetails.preferred_location.trim() !== '' &&
        propertyDetails.property_type.trim() !== '' &&
        propertyDetails.budget_min > 0
      )
    }
    if (currentStep === 3) {
      const { documentVerification } = state
      return (
        documentVerification.idType.trim() !== '' &&
        documentVerification.idNumber.trim() !== '' &&
        documentVerification.idDocument.length > 0 &&
        documentVerification.addressVerification.length > 0 &&
        documentVerification.taxpayerCard.length > 0
      )
    }
    if (currentStep === 4) {
      const { leaseAgreement } = state
      return leaseAgreement.lease_agreement_acceptance
    }
    return false
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />
      case 2:
        return <Step2PropertyDetails />
      case 3:
        return <Step3DocumentVerification />
      case 4:
        return <Step4LeaseAgreement />
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information'
      case 2:
        return 'Property Preferences'
      case 3:
        return 'Document Verification'
      case 4:
        return 'Lease Agreement'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back to Sign Up Button */}
        {onBackToSignup && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBackToSignup}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Sign Up</span>
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-property237-primary/10 dark:bg-property237-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HomeIcon className="w-8 h-8 text-property237-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tenant Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to find your perfect property
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator
            steps={wizardSteps}
            currentStepIndex={currentStep - 1}
          />
        </div>

        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {getStepTitle()}
          </h2>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={previousStep}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
              >
                Complete Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const TenantOnboardingWizard: React.FC<TenantOnboardingWizardProps> = (props) => {
  return (
    <TenantFormProvider>
      <TenantWizardContent {...props} />
    </TenantFormProvider>
  )
}