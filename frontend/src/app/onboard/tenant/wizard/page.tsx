'use client'

import React from 'react'
import WizardLayout from '../../../../components/auth/WizardLayout'
import { TenantFormProvider, useTenantForm } from '../../../../components/auth/tenant/TenantFormContext'
import Step1 from '../../../../components/auth/tenant/steps/Step1PersonalInfo'
import Step2 from '../../../../components/auth/tenant/steps/Step2PropertyDetails'
import Step3 from '../../../../components/auth/tenant/steps/Step3DocumentVerification'
import Step4 from '../../../../components/auth/tenant/steps/Step4LeaseAgreement'

interface StepContentProps {
  isDarkMode: boolean
  onThemeToggle: () => void
}

const StepContent: React.FC<StepContentProps> = ({ isDarkMode, onThemeToggle }) => {
  const { state, nextStep, previousStep } = useTenantForm()
  const { currentStep, personalInfo, propertyDetails, documentVerification, leaseAgreement } = state

  const canGoNext = () => {
    if (currentStep === 1) {
      return Boolean(
        personalInfo.username &&
        personalInfo.full_name &&
        personalInfo.email &&
        personalInfo.phone_number &&
        personalInfo.password &&
        personalInfo.confirm_password &&
        personalInfo.password === personalInfo.confirm_password
      )
    }
    if (currentStep === 2) {
      return Boolean(
        propertyDetails.preferred_location &&
        propertyDetails.budget_max >= propertyDetails.budget_min &&
        propertyDetails.property_type
      )
    }
    if (currentStep === 3) {
      return Boolean(
        documentVerification.idType &&
        documentVerification.idNumber &&
        documentVerification.idDocument.length > 0 &&
        documentVerification.addressVerification.length > 0 &&
        documentVerification.taxpayerCard.length > 0
      )
    }
    if (currentStep === 4) {
      return Boolean(leaseAgreement.lease_agreement_acceptance)
    }
    return true
  }

  const onNext = () => {
    if (currentStep < 4) nextStep()
    else window.location.href = '/dashboard/tenant'
  }

  const onBack = () => previousStep()

  const steps = [
    <Step1 key={1} />,
    <Step2 key={2} />,
    <Step3 key={3} />,
    <Step4 key={4} />,
  ]

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={4}
      stepTitles={["Personal Info", "Property Details", "Document Verification", "Agreement"]}
      onBack={onBack}
      onNext={onNext}
      canGoBack={currentStep > 1}
      canGoNext={canGoNext()}
      showThemeToggle={true}
      isDarkMode={isDarkMode}
      onThemeToggle={onThemeToggle}
    >
      {steps[currentStep - 1]}
    </WizardLayout>
  )
}

export default function TenantWizardPage() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <TenantFormProvider>
        <StepContent isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />
      </TenantFormProvider>
    </div>
  )
}
