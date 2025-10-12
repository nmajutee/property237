'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'

interface CreditPackage {
  id: number
  name: string
  credits: number
  price: number
  popular?: boolean
}

interface Transaction {
  id: number
  amount: number
  credits: number
  status: string
  created_at: string
}

export default function CreditsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState<number>(0)
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCreditsData()
  }, [])

  const loadCreditsData = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)

      const token = localStorage.getItem('property237_access_token')
      if (token) {
        // Fetch balance
        const balanceRes = await fetch(`${getApiBaseUrl()}/credits/balance/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const balanceData = await balanceRes.json()
        setBalance(parseFloat(balanceData.balance))

        // Fetch packages
        const packagesRes = await fetch(`${getApiBaseUrl()}/credits/packages/`)
        const packagesData = await packagesRes.json()
        setPackages(packagesData.results || [])

        // Fetch transactions
        const transactionsRes = await fetch(`${getApiBaseUrl()}/credits/transactions/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.results || [])
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (packageId: number) => {
    try {
      const token = localStorage.getItem('property237_access_token')
      const response = await fetch(`${getApiBaseUrl()}/credits/purchase/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ package_id: packageId })
      })

      if (response.ok) {
        alert('Purchase successful!')
        loadCreditsData()
      } else {
        alert('Purchase failed. Please try again.')
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const defaultPackages: CreditPackage[] = [
    { id: 1, name: 'Starter', credits: 10, price: 5000 },
    { id: 2, name: 'Basic', credits: 25, price: 10000, popular: true },
    { id: 3, name: 'Premium', credits: 50, price: 18000 },
    { id: 4, name: 'Pro', credits: 100, price: 30000 }
  ]

  const displayPackages = packages.length > 0 ? packages : defaultPackages

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agent Portal</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <Link href="/dashboard/agent" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChartBarIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href={"/dashboard/agent/properties" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            My Properties
          </Link>
          <Link href={"/dashboard/agent/applications" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <UsersIcon className="h-5 w-5" />
            Applications
          </Link>
          <Link href={"/dashboard/agent/analytics" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href={"/dashboard/agent/credits" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link href={"/dashboard/agent/messages" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          <Link href={"/dashboard/agent/settings" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <Link href={"/dashboard/agent/settings" as any} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <div className="h-10 w-10 rounded-full bg-property237-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-property237-primary">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Credits & Packages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Purchase credits to unlock premium features
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-gradient-to-r from-property237-primary to-property237-primary-dark rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-2">Your Current Balance</p>
              <p className="text-5xl font-bold mb-1">{balance.toFixed(2)}</p>
              <p className="text-white/80">Credits Available</p>
            </div>
            <SparklesIcon className="h-24 w-24 text-white/20" />
          </div>
        </div>

        {/* Packages Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Package
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                  pkg.popular
                    ? 'border-property237-primary'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {pkg.popular && (
                  <div className="bg-property237-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {pkg.name}
                </h3>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-property237-primary">
                    {pkg.credits}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Credits</div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pkg.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">XAF</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Contact {pkg.credits} agents</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Access property details</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Priority support</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    pkg.popular
                      ? 'bg-property237-primary text-white hover:bg-property237-primary-dark'
                      : 'border-2 border-property237-primary text-property237-primary hover:bg-property237-primary hover:text-white'
                  }`}
                >
                  Purchase Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How Credits Work */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How Credits Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-property237-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="h-8 w-8 text-property237-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Purchase Credits
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a package that suits your needs and complete the payment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-property237-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="h-8 w-8 text-property237-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Use Credits
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Spend 1 credit per agent contact or premium property view
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track Usage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your credit balance and transaction history anytime
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recent credit transactions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Date</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Credits</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-property237-primary">
                        +{transaction.credits}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                        {transaction.amount.toLocaleString()} XAF
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {transaction.status === 'completed' ? <CheckCircleIcon className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
