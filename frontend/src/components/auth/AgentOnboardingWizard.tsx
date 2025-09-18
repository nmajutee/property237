'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/Button'
import { UploadedFile } from '../ui/FileUpload'
import { ProgressIndicator, WizardStep } from '../ui/ProgressIndicator'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { AddressStep } from './AddressStep'
import { CompanyStep } from './CompanyStep'
import { KYCStep } from './KYCStep'
import { MobileMoneyStep } from './MobileMoneyStep'
import { ReviewStep } from './ReviewStep'
import {
  CheckBadgeIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

// Data Types
export interface AgentPersonalInfo {
  fullLegalName: string
  displayName: string
  email: string
  phone: string
  countryCode: string
  dateOfBirth: string
  language: 'en' | 'fr'
}

export interface AgentAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  residenceProof: File | null;
  residenceProofFileName: string;
  isBusinessAddressSame: boolean;
  businessStreet: string;
  businessCity: string;
  businessRegion: string;
  businessPostalCode: string;
  businessCountry: string;
}

export interface AgentCompany {
  companyName: string;
  rcNumber: string;
  taxId: string;
  hasVAT: boolean;
  vatNumber: string;
  yearEstablished: string;
  businessCategory: string;
  companySize: string;
  businessDescription: string;
  businessDocs: UploadedFile[];
}

export interface AgentKYC {
  idType: string;
  idNumber: string;
  idFrontDoc: UploadedFile[];
  idBackDoc: UploadedFile[];
  businessLicense: UploadedFile[];
  proofOfOwnership: UploadedFile[];
  additionalDocs: UploadedFile[];
}

export interface AgentMobileMoney {
  provider: 'mtn' | 'orange' | 'other';
  phoneNumber: string;
  accountName: string;
  nameMatchStatus: 'match' | 'close' | 'mismatch' | 'pending';
  verificationCode?: string;
  isVerified: boolean;
}

export interface AgentVerification {
  selfieDoc: UploadedFile[];
  termsAccepted: boolean;
  dataConsentAccepted: boolean;
  marketingConsent: boolean;
}

export interface AgentOnboardingData {
  personalInfo: AgentPersonalInfo
  address: AgentAddress
  company: AgentCompany
  kyc: AgentKYC
  mobileMoney: AgentMobileMoney
  verification: AgentVerification
  currentStep: number
  isComplete: boolean
}

// Wizard Steps Configuration
const wizardSteps: WizardStep[] = [
  { id: 'personal', title: 'Personal', description: 'Basic information' },
  { id: 'address', title: 'Address', description: 'Location details' },
  { id: 'company', title: 'Company', description: 'Business info' },
  { id: 'kyc', title: 'Documents', description: 'ID verification' },
  { id: 'mobile-money', title: 'Payment', description: 'Mobile money' },
  { id: 'review', title: 'Review', description: 'Final verification' }
]

interface AgentOnboardingWizardProps {
  onSubmit: (data: AgentOnboardingData) => void
  onSaveDraft: (data: AgentOnboardingData) => void
  initialData?: Partial<AgentOnboardingData>
  loading?: boolean
  error?: string
}

const STORAGE_KEY = 'agent_onboarding_draft'

export const AgentOnboardingWizard: React.FC<AgentOnboardingWizardProps> = ({
  onSubmit,
  onSaveDraft,
  initialData,
  loading = false,
  error
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<AgentOnboardingData>({
    personalInfo: {
      fullLegalName: '',
      displayName: '',
      email: '',
      phone: '',
      countryCode: '+237',
      dateOfBirth: '',
      language: 'en'
    },
    address: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'CM',
      residenceProof: null,
      residenceProofFileName: '',
      isBusinessAddressSame: false,
      businessStreet: '',
      businessCity: '',
      businessRegion: '',
      businessPostalCode: '',
      businessCountry: 'CM'
    },
    company: {
      companyName: '',
      rcNumber: '',
      taxId: '',
      hasVAT: false,
      vatNumber: '',
      yearEstablished: '',
      businessCategory: '',
      companySize: '',
      businessDescription: '',
      businessDocs: []
    },
    kyc: {
      idType: '',
      idNumber: '',
      idFrontDoc: [],
      idBackDoc: [],
      businessLicense: [],
      proofOfOwnership: [],
      additionalDocs: []
    },
    mobileMoney: {
      provider: 'mtn',
      phoneNumber: '',
      accountName: '',
      nameMatchStatus: 'pending',
      isVerified: false
    },
    verification: {
      selfieDoc: [],
      termsAccepted: false,
      dataConsentAccepted: false,
      marketingConsent: false
    },
    currentStep: 0,
    isComplete: false,
    ...initialData
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isDraftSaved, setIsDraftSaved] = useState(false)

  // Load saved draft on component mount
  useEffect(() => {
    const loadSavedDraft = () => {
      try {
        const savedDraft = localStorage.getItem(STORAGE_KEY)
        if (savedDraft && !initialData) {
          const parsedDraft = JSON.parse(savedDraft)
          setFormData(parsedDraft)
          setCurrentStep(parsedDraft.currentStep || 0)
        }
      } catch (error) {
        console.error('Error loading saved draft:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    // Only run once on mount
    loadSavedDraft()
  }, [initialData]) // Include initialData dependency

  // Auto-save to localStorage whenever form data changes
  const saveToLocalStorage = useCallback((data: AgentOnboardingData, step: number) => {
    try {
      const draftData = { ...data, currentStep: step }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData))
      setIsDraftSaved(true)
      setTimeout(() => setIsDraftSaved(false), 2000)
    } catch (error) {
      console.error('Error saving draft to localStorage:', error)
    }
  }, []) // Empty dependency array to prevent recreation

  // Auto-save draft with proper debouncing - TEMPORARILY DISABLED
  // useEffect(() => {
  //   if (!formData || Object.keys(formData).length === 0) return

  //   const timeoutId = setTimeout(() => {
  //     saveToLocalStorage(formData, currentStep)
  //     // Temporarily disable calling onSaveDraft to prevent infinite loop
  //     // if (onSaveDraft && typeof onSaveDraft === 'function') {
  //     //   onSaveDraft({ ...formData, currentStep })
  //     // }
  //   }, 2000) // Debounce for 2 seconds

  //   return () => clearTimeout(timeoutId)
  // }, [formData, currentStep, saveToLocalStorage]) // Removed onSaveDraft from dependencies

  // Clear draft when application is completed
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

  // Stable updateFormData function to prevent unnecessary re-renders
  const updateFormData = useCallback(<K extends keyof AgentOnboardingData>(
    section: K,
    data: Partial<AgentOnboardingData[K]>
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...data }
    }))

    // Temporarily disable validation error clearing to test infinite loop
    // setValidationErrors(prev => ({
    //   ...prev,
    //   [section]: []
    // }))
  }, [])

  // Enhanced validation with detailed error messages
  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    switch (step) {
      case 0: // Personal Info
        if (!formData.personalInfo.fullLegalName) errors.push('Full legal name is required')
        if (!formData.personalInfo.email) errors.push('Email address is required')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
          errors.push('Please enter a valid email address')
        }
        if (!formData.personalInfo.phone) errors.push('Phone number is required')
        if (!formData.personalInfo.dateOfBirth) errors.push('Date of birth is required')
        break

      case 1: // Address
        if (!formData.address.street) errors.push('Street address is required')
        if (!formData.address.city) errors.push('City is required')
        if (!formData.address.region) errors.push('Region is required')
        if (!formData.address.country) errors.push('Country is required')
        if (!formData.address.residenceProof || formData.address.residenceProof === null) {
          errors.push('Proof of residence document is required')
        }
        break

      case 2: // Company
        if (!formData.company.companyName) errors.push('Company name is required')
        if (!formData.company.rcNumber) errors.push('RC number is required')
        if (!formData.company.taxId) errors.push('Tax ID is required')
        if (!formData.company.businessCategory) errors.push('Business category is required')
        if (!formData.company.businessDescription) errors.push('Business description is required')
        if (!formData.company.yearEstablished) errors.push('Year established is required')
        break

      case 3: // KYC
        if (!formData.kyc.idType) errors.push('ID document type is required')
        if (!formData.kyc.idNumber) errors.push('ID number is required')
        if (formData.kyc.idFrontDoc.length === 0) errors.push('ID front document is required')
        if (formData.kyc.idBackDoc.length === 0) errors.push('ID back document is required')
        if (formData.kyc.businessLicense.length === 0) errors.push('Business license is required')
        break

      case 4: // Mobile Money
        if (!formData.mobileMoney.phoneNumber) errors.push('Mobile money phone number is required')
        if (!formData.mobileMoney.accountName) errors.push('Account name is required')
        if (!formData.mobileMoney.isVerified) errors.push('Mobile money account must be verified')
        break

      case 5: // Review
        if (!formData.verification.termsAccepted) errors.push('You must accept the terms of service')
        if (!formData.verification.dataConsentAccepted) errors.push('You must consent to data processing')
        if (formData.verification.selfieDoc.length === 0) errors.push('Verification selfie is required')
        break

      default:
        break
    }

    return { isValid: errors.length === 0, errors }
  }

  const canProceed = (step: number): boolean => {
    const validation = validateStep(step)
    setValidationErrors(prev => ({
      ...prev,
      [step]: validation.errors
    }))
    return validation.isValid
  }

  const handleNext = () => {
    if (canProceed(currentStep) && currentStep < wizardSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      saveToLocalStorage(formData, nextStep)
      onSaveDraft({ ...formData, currentStep: nextStep })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      saveToLocalStorage(formData, prevStep)
    }
  }

  const handleSubmit = async () => {
    const validation = validateStep(currentStep)
    if (validation.isValid) {
      try {
        await onSubmit({ ...formData, currentStep, isComplete: true })
        clearDraft() // Clear draft after successful submission
      } catch (error) {
        console.error('Submission error:', error)
        // Error handling is managed by parent component
      }
    } else {
      setValidationErrors(prev => ({
        ...prev,
        [currentStep]: validation.errors
      }))
    }
  }

  // Memoized change handlers to prevent infinite re-renders
  const handlePersonalInfoChange = useCallback((data: Partial<AgentPersonalInfo>) => {
    updateFormData('personalInfo', data)
  }, [updateFormData])

  const handleAddressChange = useCallback((data: Partial<AgentAddress>) => {
    updateFormData('address', data)
  }, [updateFormData])

  const handleCompanyChange = useCallback((data: Partial<AgentCompany>) => {
    updateFormData('company', data)
  }, [updateFormData])

  const handleKYCChange = useCallback((data: Partial<AgentKYC>) => {
    updateFormData('kyc', data)
  }, [updateFormData])

  const handleMobileMoneyChange = useCallback((data: Partial<AgentMobileMoney>) => {
    updateFormData('mobileMoney', data)
  }, [updateFormData])

  const handleVerificationChange = useCallback((data: Partial<AgentVerification>) => {
    updateFormData('verification', data)
  }, [updateFormData])

  const handleStepEdit = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={formData.personalInfo} onChange={handlePersonalInfoChange} />
      case 1:
        return <AddressStep data={formData.address} onChange={handleAddressChange} />
      case 2:
        return <CompanyStep data={formData.company} onChange={handleCompanyChange} />
      case 3:
        return <KYCStep data={formData.kyc} onChange={handleKYCChange} />
      case 4:
        return <MobileMoneyStep data={formData.mobileMoney} personalName={formData.personalInfo.fullLegalName} onChange={handleMobileMoneyChange} />
      case 5:
        return <ReviewStep
          data={formData.verification}
          formData={formData}
          onChange={handleVerificationChange}
          onEdit={handleStepEdit}
        />
      default:
        return null
    }
  }

  const isLastStep = currentStep === wizardSteps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Agent Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional verification to join our trusted agent network
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator
            steps={wizardSteps}
            currentStepIndex={currentStep}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Step Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors[currentStep] && validationErrors[currentStep].length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                  {validationErrors[currentStep].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Draft Save Indicator */}
            {isDraftSaved && (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Progress saved automatically
                  </p>
                </div>
              </div>
            )}

            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              >
                Back
              </Button>

              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => onSaveDraft({ ...formData, currentStep })}
                  disabled={loading}
                >
                  Save Draft
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed(currentStep) || loading}
                    loading={loading}
                    leftIcon={<CheckBadgeIcon className="h-4 w-4" />}
                  >
                    Submit for Verification
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed(currentStep) || loading}
                    rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}