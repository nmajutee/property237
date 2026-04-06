'use client'

import React, { useState } from 'react'
import Navbar from '../../components/navigation/Navbar'
import { useAgentDashboard, useAgentAnalytics } from '@/hooks/useAnalytics'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  HomeIcon,
  EyeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const { data: stats, isLoading: statsLoading } = useAgentDashboard()
  const { data: analytics, isLoading: analyticsLoading } = useAgentAnalytics(days)

  const loading = statsLoading || analyticsLoading

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const formatChartDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your property performance and inquiry metrics
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    +{stats.new_properties_30d} this month
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Properties</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_properties}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{stats.active_properties} active</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Views</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics ? formatCurrency(analytics.total_views) : formatCurrency(stats.total_views)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    +{stats.new_applications_30d} this month
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Inquiries</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics ? analytics.total_inquiries : stats.total_applications}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics ? `${analytics.conversion_rate}%` : '—'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Views to inquiries</p>
              </div>
            </div>

            {/* Charts Row */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Views Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Views Over Time
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.daily_views.map(d => ({ ...d, date: formatChartDate(d.date) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} name="Total Views" dot={false} />
                        <Line type="monotone" dataKey="unique" stroke="#06b6d4" strokeWidth={2} name="Unique Views" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Inquiries Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Inquiries Over Time
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.daily_inquiries.map(d => ({ ...d, date: formatChartDate(d.date) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" name="Inquiries" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Per-Property Performance Table */}
            {analytics && analytics.per_property.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Per-Property Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Property</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Views</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Unique</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Inquiries</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.per_property.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{p.title}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">{p.total_views}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">{p.unique_views}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">{p.total_inquiries}</td>
                          <td className="py-3 px-4 text-sm text-right">
                            <span className={`font-semibold ${p.conversion_rate > 5 ? 'text-green-600' : p.conversion_rate > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                              {p.conversion_rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Property Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Available</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">{stats.available_properties}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Rented</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.rented_properties}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Inactive</span>
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-400">{stats.total_properties - stats.active_properties}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  Properties by Type
                </h3>
                <div className="space-y-3">
                  {stats.properties_by_type.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{item.property_type__name || 'Unknown'}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                          <div className="h-full bg-property237-primary rounded-full" style={{ width: `${(item.count / stats.total_properties) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Properties</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Property</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Views</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_properties.map((property: any) => (
                      <tr key={property.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{property.title}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(property.price)} XAF</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{property.views_count}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(property.created_at)}</td>
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
