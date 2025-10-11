'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { Button } from '../../components/ui/Button'
import { getApiBaseUrl } from '@/services/api'
import {
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

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
  const [balance, setBalance] = useState<number>(0)
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCreditsData()
  }, [])

  const fetchCreditsData = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')
      if (!token) {
        router.push('/sign-in')
        return
      }

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
    } catch (error) {
      console.error('Error fetching credits data:', error)
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
        fetchCreditsData()
      } else {
        alert('Purchase failed. Please try again.')
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const defaultPackages: CreditPackage[] = [
    { id: 1, name: 'Starter', credits: 10, price: 5000 },
    { id: 2, name: 'Basic', credits: 25, price: 10000, popular: true },
    { id: 3, name: 'Premium', credits: 50, price: 18000 },
    { id: 4, name: 'Pro', credits: 100, price: 30000 }
  ]

  const displayPackages = packages.length > 0 ? packages : defaultPackages

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Credits & Packages
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Purchase credits to unlock premium features and contact property agents
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-gradient-to-r from-property237-primary to-property237-dark rounded-xl shadow-md p-8 mb-12 text-center">
          <h2 className="text-white text-lg mb-2">Your Current Balance</h2>
          <div className="text-5xl font-bold text-white mb-2">{balance.toFixed(2)}</div>
          <p className="text-white/80">Credits Available</p>
        </div>

        {/* Credit Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Choose Your Package
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${
                  pkg.popular ? 'ring-2 ring-property237-primary' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-property237-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-property237-primary">
                    {pkg.credits}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Credits</div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pkg.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">FCFA</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Contact {pkg.credits} agents</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Access property details</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-property237-primary flex-shrink-0" />
                    <span>Priority support</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  Purchase Package
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How Credits Work */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How Credits Work
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-property237-light dark:bg-property237-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="h-8 w-8 text-property237-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Purchase Credits
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a package that suits your needs and complete the payment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-property237-light dark:bg-property237-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="h-8 w-8 text-property237-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Use Credits
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Spend 1 credit per agent contact or premium property view
              </p>
            </div>

            <div className="text-center">
              <div className="bg-property237-light dark:bg-property237-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-property237-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Never Expire
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your credits never expire - use them whenever you're ready
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Transaction History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Credits
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        +{transaction.credits}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {transaction.amount.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
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
      </div>
    </div>
  )
}
