'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/navigation/Navbar'
import { creditsAPI, authAPI } from '../../../services/api'
import { CreditBalance, User } from '../../../types/api'
import { Button } from '../../../components/ui/Button'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  PlusCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  HeartIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function AgentDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState<CreditBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [profileData, balanceData] = await Promise.all([
        authAPI.getProfile(),
        creditsAPI.getBalance()
      ])

      setUser((profileData as any).user)
      setBalance(balanceData)
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/sign-in'
      } else {
        setError('Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      window.location.href = '/sign-in'
    } catch (err) {
      window.location.href = '/sign-in'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Listings', value: '0', icon: HomeIcon, color: 'text-blue-500', change: '+0%' },
    { label: 'Total Views', value: '0', icon: EyeIcon, color: 'text-green-500', change: '+0%' },
    { label: 'Saved by Users', value: '0', icon: HeartIcon, color: 'text-red-500', change: '+0%' },
    { label: 'Revenue (XAF)', value: '0', icon: CurrencyDollarIcon, color: 'text-yellow-500', change: '+0%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.full_name}! 🏢
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your properties today
          </p>
        </div>

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-property237-primary to-property237-dark rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">List a New Property</h3>
              <p className="text-green-100 mb-4">
                Reach thousands of potential tenants across Cameroon
              </p>
              <Button variant="outline" className="bg-white text-property237-primary hover:bg-gray-100">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Property
              </Button>
            </div>
            <HomeIcon className="h-24 w-24 opacity-20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Listings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Listings</h3>
                <a href="#" className="text-sm text-property237-primary hover:text-property237-dark font-medium">
                  View All
                </a>
              </div>
              <div className="text-center py-12">
                <HomeIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">No properties listed yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Start by adding your first property listing
                </p>
                <Button>
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Your First Property
                </Button>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Performance Overview</h3>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                      <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Property Views</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total impressions</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                      <UsersIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Inquiries</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Messages received</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
                      <HeartIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Favorites</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Times saved</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Account Status</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-property237-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">✓ Verified Agent</span>
                </div>
              </div>
            </div>

            {/* Credit Balance */}
            <div className="bg-gradient-to-br from-property237-primary to-property237-dark rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm opacity-90">Credit Balance</p>
                <CreditCardIcon className="h-6 w-6 opacity-90" />
              </div>
              <p className="text-4xl font-bold mb-2">{balance?.balance || '0'}</p>
              <p className="text-sm opacity-75 mb-4">credits available</p>
              <Button variant="outline" className="w-full bg-white text-property237-primary hover:bg-gray-100">
                Buy More Credits
              </Button>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs opacity-75 mb-1">
                  <span>Total Spent</span>
                  <span>{balance?.total_spent || '0'}</span>
                </div>
                <div className="flex justify-between text-xs opacity-75">
                  <span>Total Earned</span>
                  <span>{balance?.total_earned || '0'}</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Quick Tip</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Properties with high-quality photos get 3x more views. Add professional photos to your listings!
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </div>

            {/* Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our team is here to support you
              </p>
              <Button variant="outline" size="sm" className="w-full mb-2">
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" className="w-full">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
