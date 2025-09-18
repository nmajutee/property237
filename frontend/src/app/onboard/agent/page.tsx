'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SimpleAgentWizard } from '../../../components/auth/SimpleAgentWizard'
import { AgentOnboardingSuccess } from '../../../components/auth/AgentOnboardingSuccess'
import { ArrowLeftIcon } from 'lucide-react'

export default function AgentOnboardingPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState<string>('')
  const [submittedEmail, setSubmittedEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (data: any) => {
    setLoading(true)

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate mock application ID
      const mockApplicationId = `AGT-${Date.now().toString().slice(-6)}`

      // In a real app, this would be an API call:
      // const response = await fetch('/api/agent-applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      //
      // if (!response.ok) throw new Error('Submission failed')
      // const result = await response.json()

      setApplicationId(mockApplicationId)
      setSubmittedEmail(data.personalInfo?.email || 'test@example.com')
      setIsSubmitted(true)

    } catch (err) {
      setError('Failed to submit application. Please try again.')
      console.error('Submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = (data: any) => {
    // In a real app, this would save to backend
    console.log('Saving draft:', data)
  }

  const handleBackToDashboard = () => {
    router.push('/')
  }

  const handleBackToSignup = () => {
    router.push('/signup')
  }

  if (isSubmitted) {
    return (
      <AgentOnboardingSuccess
        applicationId={applicationId}
        email={submittedEmail}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  return (
    <div>
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={handleBackToSignup}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Sign Up</span>
        </button>
      </div>

      <SimpleAgentWizard
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        loading={loading}
      />
    </div>
  )
}