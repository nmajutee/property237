'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { tenantService } from '@/services/tenantService'
import { useTranslation } from '@/lib/i18n'

interface ScoreData {
  total: number
  max: number
  grade: string
  components: {
    payment_history: number
    verification: number
    documents: number
    lease_compliance: number
    profile_completeness: number
  }
}

const componentConfig = [
  { key: 'payment_history', max: 340, labelKey: 'tenant.paymentHistory', color: 'bg-green-500' },
  { key: 'verification', max: 170, labelKey: 'tenant.verification', color: 'bg-blue-500' },
  { key: 'documents', max: 127, labelKey: 'tenant.documents', color: 'bg-purple-500' },
  { key: 'lease_compliance', max: 128, labelKey: 'tenant.leaseCompliance', color: 'bg-yellow-500' },
  { key: 'profile_completeness', max: 85, labelKey: 'tenant.profileCompleteness', color: 'bg-indigo-500' },
] as const

function getGradeColor(grade: string) {
  const colors: Record<string, string> = {
    'Excellent': 'text-green-600',
    'Good': 'text-blue-600',
    'Fair': 'text-yellow-600',
    'Poor': 'text-orange-600',
    'Very Poor': 'text-red-600',
  }
  return colors[grade] || 'text-gray-600'
}

function getScoreRingColor(total: number) {
  if (total >= 750) return 'stroke-green-500'
  if (total >= 650) return 'stroke-blue-500'
  if (total >= 550) return 'stroke-yellow-500'
  if (total >= 400) return 'stroke-orange-500'
  return 'stroke-red-500'
}

export default function CreditScorePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      router.push('/sign-in')
      return
    }
    tenantService.getCreditScore()
      .then((res) => setScore(res as any))
      .catch((err: any) => setError(err?.response?.data?.error || 'Failed to load credit score'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">{t('common.loading')}</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!score) return null

  const pct = ((score.total / score.max) * 100).toFixed(0)
  const circumference = 2 * Math.PI * 60
  const offset = circumference - (score.total / score.max) * circumference

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/dashboard/tenant" className="text-green-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6">{t('tenant.creditScore')}</h1>

        {/* Score Circle */}
        <div className="bg-white rounded-lg shadow p-8 mb-6 flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="60" fill="none"
                className={getScoreRingColor(score.total)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score.total}</span>
              <span className="text-sm text-gray-400">/ {score.max}</span>
            </div>
          </div>
          <p className={`text-xl font-semibold ${getGradeColor(score.grade)}`}>{score.grade}</p>
          <p className="text-sm text-gray-500 mt-1">{pct}% of maximum score</p>
        </div>

        {/* Component Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Score Breakdown</h2>
          <div className="space-y-4">
            {componentConfig.map(({ key, max, labelKey, color }) => {
              const value = score.components[key as keyof typeof score.components]
              const ratio = (value / max) * 100
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{t(labelKey)}</span>
                    <span className="font-medium">{value} / {max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
