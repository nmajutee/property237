'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { UploadedFile } from '../../ui/FileUpload'

// Form Data Types
export interface PersonalInfo {
  username: string
  full_name: string
  email: string
  phone_number: string
  password: string
  confirm_password: string
}

export interface PropertyDetails {
  preferred_location: string
  budget_min: number
  budget_max: number
  property_category: string
  property_type: string
  land_type: string
  amenities: string[]
}

export interface DocumentVerification {
  idType: string
  idNumber: string
  idDocument: UploadedFile[]
  addressVerification: UploadedFile[]
  taxpayerCard: UploadedFile[]
  verification_status: 'pending' | 'verified' | 'rejected'
}

export interface LeaseAgreement {
  lease_agreement_acceptance: boolean
  verification_status: 'pending' | 'verified' | 'rejected'
}

export interface TenantFormData {
  personalInfo: PersonalInfo
  propertyDetails: PropertyDetails
  documentVerification: DocumentVerification
  leaseAgreement: LeaseAgreement
  currentStep: number
}

// Initial State
const initialState: TenantFormData = {
  personalInfo: {
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  },
  propertyDetails: {
    preferred_location: '',
    budget_min: 0,
    budget_max: 1000000,
    property_category: '',
    property_type: '',
    land_type: '',
    amenities: []
  },
  documentVerification: {
    idType: '',
    idNumber: '',
    idDocument: [],
    addressVerification: [],
    taxpayerCard: [],
    verification_status: 'pending'
  },
  leaseAgreement: {
    lease_agreement_acceptance: false,
    verification_status: 'pending'
  },
  currentStep: 1
}

// Action Types
type FormAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_PROPERTY_DETAILS'; payload: Partial<PropertyDetails> }
  | { type: 'UPDATE_DOCUMENT_VERIFICATION'; payload: Partial<DocumentVerification> }
  | { type: 'UPDATE_LEASE_AGREEMENT'; payload: Partial<LeaseAgreement> }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_FORM' }

// Reducer
const formReducer = (state: TenantFormData, action: FormAction): TenantFormData => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      }

    case 'UPDATE_PROPERTY_DETAILS':
      return {
        ...state,
        propertyDetails: { ...state.propertyDetails, ...action.payload }
      }

    case 'UPDATE_DOCUMENT_VERIFICATION':
      return {
        ...state,
        documentVerification: { ...state.documentVerification, ...action.payload }
      }

    case 'UPDATE_LEASE_AGREEMENT':
      return {
        ...state,
        leaseAgreement: { ...state.leaseAgreement, ...action.payload }
      }

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(4, action.payload))
      }

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(4, state.currentStep + 1)
      }

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1)
      }

    case 'RESET_FORM':
      return initialState

    default:
      return state
  }
}

// Context
interface TenantFormContextType {
  state: TenantFormData
  dispatch: React.Dispatch<FormAction>
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updatePropertyDetails: (data: Partial<PropertyDetails>) => void
  updateDocumentVerification: (data: Partial<DocumentVerification>) => void
  updateLeaseAgreement: (data: Partial<LeaseAgreement>) => void
  nextStep: () => void
  previousStep: () => void
  setCurrentStep: (step: number) => void
  resetForm: () => void
}

const TenantFormContext = createContext<TenantFormContextType | undefined>(undefined)

// Provider Component
interface TenantFormProviderProps {
  children: ReactNode
}

export const TenantFormProvider: React.FC<TenantFormProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: data })
  }

  const updatePropertyDetails = (data: Partial<PropertyDetails>) => {
    dispatch({ type: 'UPDATE_PROPERTY_DETAILS', payload: data })
  }

  const updateDocumentVerification = (data: Partial<DocumentVerification>) => {
    dispatch({ type: 'UPDATE_DOCUMENT_VERIFICATION', payload: data })
  }

  const updateLeaseAgreement = (data: Partial<LeaseAgreement>) => {
    dispatch({ type: 'UPDATE_LEASE_AGREEMENT', payload: data })
  }

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' })
  }

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step })
  }

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' })
  }

  const value: TenantFormContextType = {
    state,
    dispatch,
    updatePersonalInfo,
    updatePropertyDetails,
    updateDocumentVerification,
    updateLeaseAgreement,
    nextStep,
    previousStep,
    setCurrentStep,
    resetForm
  }

  return (
    <TenantFormContext.Provider value={value}>
      {children}
    </TenantFormContext.Provider>
  )
}

// Hook to use the context
export const useTenantForm = () => {
  const context = useContext(TenantFormContext)
  if (context === undefined) {
    throw new Error('useTenantForm must be used within a TenantFormProvider')
  }
  return context
}

export default TenantFormContext