'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

// Simplified types
interface PersonalInfo {
  fullLegalName: string
  email: string
  phone: string
}

interface SimpleAgentData {
  personalInfo: PersonalInfo
}

interface SimpleAgentWizardProps {
  onSubmit: (data: SimpleAgentData) => Promise<void>
  onSaveDraft?: (data: SimpleAgentData) => void
  loading?: boolean
}

export const SimpleAgentWizard: React.FC<SimpleAgentWizardProps> = ({
  onSubmit,
  onSaveDraft,
  loading = false
}) => {
  const [formData, setFormData] = useState<SimpleAgentData>({
    personalInfo: {
      fullLegalName: '',
      email: '',
      phone: ''
    }
  })

  const updatePersonalInfo = useCallback((data: Partial<PersonalInfo>) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data }
    }))
  }, [])

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Agent Registration</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            value={formData.personalInfo.fullLegalName}
            onChange={(e) => updatePersonalInfo({ fullLegalName: e.target.value })}
            placeholder="Enter your full legal name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            value={formData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </div>
  )
}