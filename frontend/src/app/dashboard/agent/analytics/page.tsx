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
  EyeIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'

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
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)

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
          <Link href={"/dashboard/agent/analytics" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href={"/dashboard/agent/credits" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your property performance and metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
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
                    <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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

              {/* Applications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-property237-accent" />
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

              {/* Average Price */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Average Price
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.average_price)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  XAF
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Property Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  Property Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ready to rent</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.available_properties}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rented</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Currently occupied</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.rented_properties}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Inactive</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not listed</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {stats.total_properties - stats.active_properties}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Types */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  Properties by Type
                </h3>
                <div className="space-y-4">
                  {stats.properties_by_type.slice(0, 5).map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {item.property_type__name || 'Unknown'}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.count} ({Math.round((item.count / stats.total_properties) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-property237-primary rounded-full transition-all"
                          style={{
                            width: `${(item.count / stats.total_properties) * 100}%`,
                          }}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Properties</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your latest property listings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
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
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
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
      </main>
    </div>
  )
}
