'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { FileUpload } from '../ui/FileUpload'
import { UploadedFile } from '../ui/FileUpload'
import { ProgressIndicator, WizardStep } from '../ui/ProgressIndicator'
import {
  CheckBadgeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  MapPinIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  EyeIcon,
  DocumentTextIcon
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
}

export interface AgentKYC {
  idType: 'passport' | 'drivers_license' | 'national_id';
  idNumber: string;
  idDocument: UploadedFile[]; // ID card, passport, or driver's license
  addressVerification: UploadedFile[]; // Utility bill or bank statement
  taxpayerCard: UploadedFile[]; // Taxpayer card photo
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
  verification_status: 'pending' | 'verified' | 'rejected';
  termsAccepted: boolean;
  dataConsentAccepted: boolean;
  marketingConsent: boolean;
}

export interface AgentLeaseAgreement {
  leaseAgreementDoc: UploadedFile[];
  leaseTermsAccepted: boolean;
  propertyManagementAccepted: boolean;
  lease_agreement_acceptance: boolean;
}

export interface AgentOnboardingData {
  personalInfo: AgentPersonalInfo
  address: AgentAddress
  kyc: AgentKYC
  mobileMoney: AgentMobileMoney
  verification: AgentVerification
  leaseAgreement: AgentLeaseAgreement
  currentStep: number
  isComplete: boolean
}

// Wizard Steps Configuration
const wizardSteps: WizardStep[] = [
  { id: 'personal', title: 'Personal', description: 'Basic information' },
  { id: 'address', title: 'Address', description: 'Location details' },
  { id: 'documents', title: 'Documents', description: 'ID verification' },
  { id: 'mobile-money', title: 'Payment', description: 'Mobile money' },
  { id: 'verification', title: 'Verification', description: 'Document verification' },
  { id: 'agreement', title: 'Agreement', description: 'Terms & conditions' }
]

interface AgentOnboardingWizardProps {
  onSubmit: (data: AgentOnboardingData) => void
  onSaveDraft: (data: AgentOnboardingData) => void
  initialData?: Partial<AgentOnboardingData>
  loading?: boolean
  error?: string
  onBackToSignup?: () => void
}

const STORAGE_KEY = 'agent_onboarding_draft'

export const AgentOnboardingWizard: React.FC<AgentOnboardingWizardProps> = ({
  onSubmit,
  onSaveDraft,
  initialData,
  loading = false,
  error,
  onBackToSignup
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
      residenceProofFileName: ''
    },
    kyc: {
      idType: 'national_id',
      idNumber: '',
      idDocument: [],
      addressVerification: [],
      taxpayerCard: []
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
      verification_status: 'pending',
      termsAccepted: false,
      dataConsentAccepted: false,
      marketingConsent: false
    },
    leaseAgreement: {
      leaseAgreementDoc: [],
      leaseTermsAccepted: false,
      propertyManagementAccepted: false,
      lease_agreement_acceptance: false
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
  const validateStep = useCallback((step: number): { isValid: boolean; errors: string[] } => {
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
        break

      case 2: // Documents
        if (!formData.kyc) {
          errors.push('KYC data is missing')
          break
        }
        if (!formData.kyc.idType) errors.push('ID document type is required')
        if (!formData.kyc.idNumber) errors.push('ID number is required')
        if (!formData.kyc.idDocument || formData.kyc.idDocument.length === 0) errors.push('ID document is required')
        if (!formData.kyc.addressVerification || formData.kyc.addressVerification.length === 0) errors.push('Address verification document is required')
        if (!formData.kyc.taxpayerCard || formData.kyc.taxpayerCard.length === 0) errors.push('Taxpayer card is required')
        break

      case 3: // Mobile Money
        if (!formData.mobileMoney) {
          errors.push('Mobile money data is missing')
          break
        }
        if (!formData.mobileMoney.phoneNumber) errors.push('Mobile money phone number is required')
        if (!formData.mobileMoney.accountName) errors.push('Account name is required')
        if (!formData.mobileMoney.isVerified) errors.push('Mobile money account must be verified')
        break

      case 4: // Verification
        if (!formData.verification) {
          errors.push('Verification data is missing')
          break
        }
        if (!formData.verification.termsAccepted) errors.push('You must accept the terms of service')
        if (!formData.verification.dataConsentAccepted) errors.push('You must consent to data processing')
        if (!formData.verification.selfieDoc || formData.verification.selfieDoc.length === 0) errors.push('Verification selfie is required')
        break

      case 5: // Agreement
        if (!formData.leaseAgreement) {
          errors.push('Lease agreement data is missing')
          break
        }
        if (!formData.leaseAgreement.leaseAgreementDoc || formData.leaseAgreement.leaseAgreementDoc.length === 0) errors.push('Please upload your lease agreement document')
        if (!formData.leaseAgreement.leaseTermsAccepted) errors.push('You must confirm you have a valid lease agreement')
        if (!formData.leaseAgreement.propertyManagementAccepted) errors.push('You must accept property management responsibilities')
        break

      default:
        break
    }

    return { isValid: errors.length === 0, errors }
  }, [formData])

  const canProceed = useCallback((step: number): boolean => {
    const validation = validateStep(step)
    return validation.isValid
  }, [validateStep])

  // Update validation errors separately to avoid infinite loops
  useEffect(() => {
    const validation = validateStep(currentStep)
    setValidationErrors(prev => ({
      ...prev,
      [currentStep]: validation.errors
    }))
  }, [currentStep, formData, validateStep])

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

  const handleKYCChange = useCallback((data: Partial<AgentKYC>) => {
    updateFormData('kyc', data)
  }, [updateFormData])

  const handleMobileMoneyChange = useCallback((data: Partial<AgentMobileMoney>) => {
    updateFormData('mobileMoney', data)
  }, [updateFormData])

  const handleVerificationChange = useCallback((data: Partial<AgentVerification>) => {
    updateFormData('verification', data)
  }, [updateFormData])

  const handleLeaseAgreementChange = useCallback((data: Partial<AgentLeaseAgreement>) => {
    updateFormData('leaseAgreement', data)
  }, [updateFormData])

  const handleStepEdit = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Personal Info Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Personal Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's start with your basic personal details
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  type="text"
                  value={formData.personalInfo.fullLegalName}
                  onChange={(e) => handlePersonalInfoChange({ fullLegalName: e.target.value })}
                  placeholder="As it appears on official documents"
                  required
                />

                <Input
                  label="Display Name"
                  type="text"
                  value={formData.personalInfo.displayName}
                  onChange={(e) => handlePersonalInfoChange({ displayName: e.target.value })}
                  placeholder="How you'd like to be addressed"
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange({ email: e.target.value })}
                placeholder="your@email.com"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Country Code"
                  options={[
                    { value: '+237', label: '+237 (Cameroon)' },
                    { value: '+33', label: '+33 (France)' },
                    { value: '+1', label: '+1 (USA/Canada)' },
                  ]}
                  value={formData.personalInfo.countryCode}
                  onChange={(e) => handlePersonalInfoChange({ countryCode: e.target.value })}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange({ phone: e.target.value })}
                    placeholder="698765432"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handlePersonalInfoChange({ dateOfBirth: e.target.value })}
                  required
                />

                <Select
                  label="Preferred Language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'Français' },
                  ]}
                  value={formData.personalInfo.language}
                  onChange={(e) => handlePersonalInfoChange({ language: e.target.value as 'en' | 'fr' })}
                  required
                />
              </div>
            </div>
          </div>
        )
      case 1:
        // Address Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Address Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Where are you located? This helps us serve you better
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Street Address"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange({ street: e.target.value })}
                placeholder="Enter your street address"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange({ city: e.target.value })}
                  placeholder="City"
                  required
                />

                <Select
                  label="Region"
                  options={[
                    { value: 'Adamawa', label: 'Adamawa' },
                    { value: 'Centre', label: 'Centre' },
                    { value: 'East', label: 'East' },
                    { value: 'Far North', label: 'Far North' },
                    { value: 'Littoral', label: 'Littoral' },
                    { value: 'North', label: 'North' },
                    { value: 'Northwest', label: 'Northwest' },
                    { value: 'South', label: 'South' },
                    { value: 'Southwest', label: 'Southwest' },
                    { value: 'West', label: 'West' }
                  ]}
                  value={formData.address.region}
                  onChange={(e) => handleAddressChange({ region: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleAddressChange({ postalCode: e.target.value })}
                  placeholder="Postal Code"
                />

                <Select
                  label="Country"
                  options={[{ value: 'CM', label: 'Cameroon' }]}
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange({ country: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Proof of Residence <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  onFilesChange={(files) => {
                    const file = files.length > 0 ? files[0].file : null;
                    const fileName = file ? file.name : '';
                    handleAddressChange({
                      residenceProof: file,
                      residenceProofFileName: fileName
                    });
                  }}
                  files={formData.address.residenceProof ? [{
                    id: 'residence-proof',
                    file: formData.address.residenceProof,
                    status: 'success' as const
                  }] : []}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5242880}
                  multiple={false}
                  description="Upload a utility bill or bank statement as proof of residence"
                />
              </div>
            </div>
          </div>
        )
      case 2:
        // KYC Documents Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentCheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Identity Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your identification documents for verification
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="ID Document Type"
                  options={[
                    { value: 'national_id', label: 'National ID' },
                    { value: 'passport', label: 'Passport' },
                    { value: 'drivers_license', label: 'Driver\'s License' }
                  ]}
                  value={formData.kyc.idType}
                  onChange={(e) => handleKYCChange({ idType: e.target.value as any })}
                  required
                />

                <Input
                  label="ID Number"
                  type="text"
                  value={formData.kyc.idNumber}
                  onChange={(e) => handleKYCChange({ idNumber: e.target.value })}
                  placeholder="Enter your ID number"
                  required
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID Document <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    onFilesChange={(files) => handleKYCChange({ idDocument: files })}
                    files={formData.kyc?.idDocument || []}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={5242880}
                    multiple={false}
                    description="Upload clear photos of your ID (front and back if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address Verification <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    onFilesChange={(files) => handleKYCChange({ addressVerification: files })}
                    files={formData.kyc?.addressVerification || []}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={5242880}
                    multiple={false}
                    description="Utility bill or bank statement (not older than 3 months)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taxpayer Card <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    onFilesChange={(files) => handleKYCChange({ taxpayerCard: files })}
                    files={formData.kyc?.taxpayerCard || []}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={5242880}
                    multiple={false}
                    description="Photo of your taxpayer identification card"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Document Requirements
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Documents must be clear and readable</li>
                  <li>• Maximum file size: 5MB per document</li>
                  <li>• Accepted formats: PDF, JPG, PNG</li>
                  <li>• Address verification must be less than 3 months old</li>
                  <li>• Taxpayer card must be current and valid</li>
                </ul>
              </div>
            </div>
          </div>
        )
      case 3:
        // Mobile Money Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Payment Setup
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your mobile money account for transactions
              </p>
            </div>

            <div className="space-y-4">
              <Select
                label="Mobile Money Provider"
                options={[
                  { value: 'mtn', label: 'MTN Mobile Money' },
                  { value: 'orange', label: 'Orange Money' },
                  { value: 'other', label: 'Other' }
                ]}
                value={formData.mobileMoney?.provider || 'mtn'}
                onChange={(e) => handleMobileMoneyChange({ provider: e.target.value as any })}
                required
              />

              <Input
                label="Mobile Money Phone Number"
                type="tel"
                value={formData.mobileMoney?.phoneNumber || ''}
                onChange={(e) => handleMobileMoneyChange({ phoneNumber: e.target.value })}
                placeholder="+237698765432"
                required
              />

              <Input
                label="Account Name"
                type="text"
                value={formData.mobileMoney?.accountName || ''}
                onChange={(e) => handleMobileMoneyChange({ accountName: e.target.value })}
                placeholder="Name on mobile money account"
                required
              />

              {/* Name Match Status */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Name Verification Status
                </h4>
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  formData.mobileMoney?.nameMatchStatus === 'match'
                    ? 'bg-green-100 text-green-800'
                    : formData.mobileMoney?.nameMatchStatus === 'close'
                    ? 'bg-yellow-100 text-yellow-800'
                    : formData.mobileMoney?.nameMatchStatus === 'mismatch'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.mobileMoney?.nameMatchStatus === 'match' && 'Perfect Match'}
                  {formData.mobileMoney?.nameMatchStatus === 'close' && 'Close Match'}
                  {formData.mobileMoney?.nameMatchStatus === 'mismatch' && 'Name Mismatch'}
                  {(formData.mobileMoney?.nameMatchStatus === 'pending' || !formData.mobileMoney?.nameMatchStatus) && 'Pending Verification'}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  We'll verify that the account name matches your legal name: <strong>{formData.personalInfo?.fullLegalName || 'N/A'}</strong>
                </p>
              </div>

              {/* Verification Button/Status */}
              <div className="space-y-4">
                {!formData.mobileMoney?.isVerified ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        // Simulate verification process
                        const accountName = formData.mobileMoney?.accountName || ''
                        const legalName = formData.personalInfo?.fullLegalName || ''

                        if (!accountName || !legalName) {
                          alert('Please fill in both account name and legal name first.')
                          return
                        }

                        // Simple name matching logic
                        const matchStatus = accountName.toLowerCase().includes(legalName.toLowerCase()) ||
                                          legalName.toLowerCase().includes(accountName.toLowerCase())
                                          ? 'match' : 'close'

                        handleMobileMoneyChange({
                          isVerified: true,
                          nameMatchStatus: matchStatus as any
                        })
                      }}
                      className="w-full"
                      disabled={!formData.mobileMoney?.phoneNumber || !formData.mobileMoney?.accountName}
                    >
                      Verify Mobile Money Account
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Click to verify your mobile money account details
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Mobile Money Account Verified
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      Your account has been successfully verified and is ready for transactions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 4:
        // Verification Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Identity Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Complete identity verification and accept terms
              </p>
            </div>

            <div className="space-y-6">
              {/* Selfie Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selfie Verification <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  onFilesChange={(files) => handleVerificationChange({ selfieDoc: files })}
                  files={formData.verification?.selfieDoc || []}
                  accept=".jpg,.jpeg,.png"
                  maxSize={5242880}
                  multiple={false}
                  description="Take a clear selfie holding your ID document"
                />
              </div>

              {/* Terms and Consents */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.verification?.termsAccepted || false}
                    onChange={(e) => handleVerificationChange({ termsAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                    I accept the <span className="text-green-600 font-medium">Terms of Service</span> and <span className="text-green-600 font-medium">Privacy Policy</span>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="dataConsent"
                    checked={formData.verification?.dataConsentAccepted || false}
                    onChange={(e) => handleVerificationChange({ dataConsentAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="dataConsent" className="text-sm text-gray-700 dark:text-gray-300">
                    I consent to the processing of my personal data for verification and platform services
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={formData.verification?.marketingConsent || false}
                    onChange={(e) => handleVerificationChange({ marketingConsent: e.target.checked })}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="marketing" className="text-sm text-gray-700 dark:text-gray-300">
                    I would like to receive marketing communications and updates (optional)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      case 5:
        // Lease Agreement Step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Lease Agreement
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your property lease agreement and complete final terms
              </p>
            </div>

            <div className="space-y-6">
              {/* Lease Agreement Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lease Agreement Document <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  onFilesChange={(files) => handleLeaseAgreementChange({ leaseAgreementDoc: files })}
                  files={formData.leaseAgreement?.leaseAgreementDoc || []}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={10485760}
                  multiple={false}
                  description="Upload your property lease agreement (PDF or image, max 10MB)"
                />
              </div>

              {/* Agreement Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="leaseTerms"
                    checked={formData.leaseAgreement?.leaseTermsAccepted || false}
                    onChange={(e) => handleLeaseAgreementChange({ leaseTermsAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="leaseTerms" className="text-sm text-gray-700 dark:text-gray-300">
                    I confirm that I have a valid lease agreement for the property I will be managing
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="propertyManagement"
                    checked={formData.leaseAgreement?.propertyManagementAccepted || false}
                    onChange={(e) => handleLeaseAgreementChange({ propertyManagementAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="propertyManagement" className="text-sm text-gray-700 dark:text-gray-300">
                    I understand my responsibilities as a property management agent on this platform
                  </label>
                </div>
              </div>

              {/* Summary Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Final Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {formData.personalInfo.fullLegalName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {formData.personalInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {formData.personalInfo.countryCode} {formData.personalInfo.phone}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {formData.address.city}, {formData.address.region}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const isLastStep = currentStep === wizardSteps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
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