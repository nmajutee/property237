'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { getApiBaseUrl } from '@/services/api'
import {
  HomeIcon,
  EyeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface AgentStats {
  total_properties: number
  active_properties: number
  rented_properties: number
  available_properties: number
  total_views: number
  average_price: number
  total_applications: number
  pending_applications: number
  approved_applications: number
  new_properties_30d: number
  new_applications_30d: number
  properties_by_type: Array<{ property_type__name: string; count: number }>
  recent_properties: Array<{
    id: number
    title: string
    price: number
    views_count: number
    created_at: string
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (!token || !userData) {
      router.push('/sign-in')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.user_type !== 'agent') {
      alert('Only agents can access analytics')
      router.push('/dashboard')
      return
    }

    fetchAnalytics(token)
  }, [router])

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/analytics/agent/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your property performance and application metrics
          </p>
        </div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Properties */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    +{stats.new_properties_30d} this month
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Properties
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_properties}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {stats.active_properties} active
                </p>
              </div>

              {/* Total Views */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Views
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(stats.total_views)}
                </p>
              </div>

              {/* Applications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    +{stats.new_applications_30d} this month
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Applications
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_applications}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {stats.pending_applications} pending
                </p>
              </div>

              {/* Average Price */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Average Price
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(stats.average_price)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  XAF
                </p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Property Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Property Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Available</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.available_properties}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Rented</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.rented_properties}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Inactive</span>
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                      {stats.total_properties - stats.active_properties}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Types */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  Properties by Type
                </h3>
                <div className="space-y-3">
                  {stats.properties_by_type.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.property_type__name || 'Unknown'}
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                          <div
                            className="h-full bg-property237-primary rounded-full"
                            style={{
                              width: `${(item.count / stats.total_properties) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Properties
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Property
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Views
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_properties.map((property) => (
                      <tr
                        key={property.id}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {property.title}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(property.price)} XAF
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {property.views_count}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(property.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
