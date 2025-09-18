'use client'

import React from 'react'
import { Button } from '../ui/Button'

interface TestWizardProps {
  onSubmit: (data: any) => Promise<void>
  onSaveDraft?: (data: any) => void
  loading?: boolean
}

export const TestWizard: React.FC<TestWizardProps> = ({
  onSubmit,
  onSaveDraft,
  loading = false
}) => {
  const handleSubmit = async () => {
    await onSubmit({ test: 'data' })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Test Wizard</h1>
      <div className="space-y-4">
        <p>This is a minimal test wizard to isolate build issues.</p>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Test'}
        </Button>
      </div>
    </div>
  )
}