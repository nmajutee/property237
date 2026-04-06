'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { creditService } from '@/services/creditService'
import { useTranslation } from '@/lib/i18n'

interface ReferralData {
  code: string
  referrer_bonus: string
  referee_bonus: string
}

interface ReferralStats {
  completed: number
  pending: number
  total_earned: string
  referrals: Array<{
    id: number
    code: string
    status: string
    referred_email: string | null
    referrer_bonus: string
    referee_bonus: string
    created_at: string
    completed_at: string | null
  }>
}

export default function ReferralPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [referral, setReferral] = useState<ReferralData | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      router.push('/sign-in')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [refRes, statsRes] = await Promise.all([
        creditService.getReferralCode(),
        creditService.getReferralStats(),
      ])
      setReferral(refRes as any)
      setStats(statsRes as any)
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (referral?.code) {
      navigator.clipboard.writeText(referral.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{t('common.loading')}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link href="/credits" className="text-green-600 hover:underline text-sm mb-4 inline-block">
          ← {t('common.back')} to {t('credits.title')}
        </Link>

        <h1 className="text-2xl font-bold mb-6">{t('credits.referral')}</h1>

        {/* Referral Code Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2">{t('credits.referralCode')}</h2>
          <p className="text-gray-500 text-sm mb-4">{t('credits.shareCode')}</p>

          <div className="flex items-center gap-3">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-xl font-mono font-bold tracking-widest text-green-700">
              {referral?.code || '---'}
            </div>
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-gray-600">
            <p>You earn: <span className="font-bold text-green-600">{referral?.referrer_bonus || '5.00'} credits</span></p>
            <p>Friend gets: <span className="font-bold text-blue-600">{referral?.referee_bonus || '3.00'} credits</span></p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
            <p className="text-sm text-gray-500">{t('credits.completed')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
            <p className="text-sm text-gray-500">{t('credits.pending')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.total_earned || '0'}</p>
            <p className="text-sm text-gray-500">{t('credits.totalEarned')}</p>
          </div>
        </div>

        {/* Referral History */}
        {stats?.referrals && stats.referrals.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Referral History</h2>
            <div className="space-y-3">
              {stats.referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{ref.referred_email || 'Pending signup'}</p>
                    <p className="text-xs text-gray-400">{new Date(ref.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ref.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
