'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'
import DashboardLayout from '../../../../components/layouts/DashboardLayout'

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
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')
      if (token) {
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
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
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
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pageTitle="Analytics Dashboard"
      pageDescription="Track your property performance and metrics"
    >
      {/* Time Range Filter */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-property237-primary"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <button
          onClick={loadAnalytics}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-property237-primary" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  +{stats.new_properties_30d} this month
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Properties
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total_properties}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {stats.active_properties} active
              </p>
            </div>

            {/* Total Views */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Views
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.total_views)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Across all properties
              </p>
            </div>

            {/* Average Price */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Average Price
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.average_price)} XAF
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Per property
              </p>
            </div>

            {/* Total Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  +{stats.new_applications_30d} this month
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Applications
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total_applications}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {stats.pending_applications} pending
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Property Status Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Property Status Breakdown
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Active</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.active_properties}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(stats.active_properties / stats.total_properties) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Rented</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.rented_properties}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(stats.rented_properties / stats.total_properties) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Available</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.available_properties}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-property237-accent h-2 rounded-full"
                      style={{ width: `${(stats.available_properties / stats.total_properties) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Types */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Properties by Type
              </h3>
              <div className="space-y-4">
                {stats.properties_by_type.map((type, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">{type.property_type__name}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {type.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-property237-primary h-2 rounded-full"
                        style={{ width: `${(type.count / stats.total_properties) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Properties Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Properties
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recent_properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {property.title}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-semibold text-property237-primary">
                          {formatCurrency(property.price)} XAF
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <EyeIcon className="h-4 w-4" />
                          <span>{formatCurrency(property.views_count)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(property.created_at)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
