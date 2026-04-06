'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  BellIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  EyeIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'
import { authAPI } from '../../../services/api'
import { useAgentDashboard } from '@/hooks/useAnalytics'
import { useMyProperties } from '@/hooks/useProperties'
import { useChatUnreadCount } from '@/hooks/useChat'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalViews: number
  totalFavorites: number
  totalApplications: number
  avgRating: number
  totalEarnings: number
  monthlyEarnings: number
}

interface Property {
  id: number
  title: string
  slug: string
  price: string
  currency: string
  views: number
  favorites: number
  applications: number
  status: { name: string }
  created_at: string
  images: Array<{ image_url: string }>
}

export default function AgentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const { data: dashboardData, isLoading: statsLoading } = useAgentDashboard()
  const { data: propertiesData } = useMyProperties()
  const { data: chatUnread } = useChatUnreadCount()
  const { data: notifUnread } = useUnreadNotificationCount()

  const apiStats = dashboardData as any
  const allProperties = (propertiesData as any)?.results ?? (propertiesData as any) ?? []
  const recentProperties = apiStats?.recent_properties ?? allProperties.slice(0, 3)
  const unreadMessages = (chatUnread as any)?.unread_count ?? 0
  const unreadNotifications = (notifUnread as any)?.unread_count ?? 0

  const stats: DashboardStats = {
    totalProperties: apiStats?.total_properties ?? allProperties.length,
    activeProperties: apiStats?.active_properties ?? allProperties.filter((p: any) => p.is_active).length,
    totalViews: apiStats?.total_views ?? 0,
    totalFavorites: 0,
    totalApplications: apiStats?.total_applications ?? 0,
    avgRating: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await authAPI.getProfile()
        setUser((profileData as any).user || profileData)
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/sign-in')
        }
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [router])

  const loading = profileLoading || statsLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.totalProperties.toString(),
      subtext: `${stats.activeProperties} active`,
      icon: HomeIcon,
      change: `+${apiStats?.new_properties_30d ?? 0} this month`,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-property237-primary',
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      subtext: 'All time',
      icon: EyeIcon,
      change: '',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    },
    {
      label: 'Applications',
      value: stats.totalApplications.toString(),
      subtext: `${apiStats?.pending_applications ?? 0} pending`,
      icon: UsersIcon,
      change: `+${apiStats?.new_applications_30d ?? 0} this month`,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    },
    {
      label: 'Messages',
      value: unreadMessages.toString(),
      subtext: 'Unread',
      icon: ChatBubbleLeftIcon,
      change: '',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-property237-accent',
    },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agent Portal</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <Link href="/dashboard/agent" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <ChartBarIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href={"/dashboard/agent/properties" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            My Properties
          </Link>
          <Link href="/my-applications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <UsersIcon className="h-5 w-5" />
            Applications
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href={"/credits" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link href={"/chat" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          <Link href={"/payments" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Payments
          </Link>
          <Link href={"/notifications" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <BellIcon className="h-5 w-5" />
            Notifications
          </Link>
          <Link href={"/settings" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your properties today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
            <Link href="/add-property">
              <button className="flex items-center gap-2 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium">
                <PlusCircleIcon className="h-5 w-5" />
                Add Property
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.subtext}
                  </p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Property Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Properties by Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Properties by Type</h3>
            <div className="space-y-4">
              {(apiStats?.properties_by_type ?? []).length === 0 ? (
                <p className="text-sm text-gray-500">No property data yet</p>
              ) : (
                (apiStats?.properties_by_type ?? []).map((item: any, index: number) => {
                  const total = stats.totalProperties || 1
                  const pct = Math.round((item.count / total) * 100)
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.property_type__name || 'Unknown'}</span>
                        <span className="text-sm text-gray-500">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-property237-primary rounded-full h-2 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Application Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Applications Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-blue-600">{apiStats?.total_applications ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{apiStats?.pending_applications ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600">{apiStats?.approved_applications ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-purple-600">{apiStats?.new_applications_30d ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Properties</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your most recent listings
                </p>
              </div>
              <Link href={"/dashboard/agent/properties" as any} className="text-sm font-medium text-property237-primary hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentProperties.length > 0 ? (
              recentProperties.map((property: any) => (
                <div key={property.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={property.primary_image || property.images?.[0]?.image_url || '/placeholder-property.jpg'}
                        alt={property.title}
                        className="h-24 w-32 object-cover rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {property.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {property.area?.name}, {property.area?.city?.name} • {property.no_of_bedrooms} beds • {property.no_of_bathrooms} baths
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {property.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <EyeIcon className="h-4 w-4" />
                          <span>{property.views_count || 0} views</span>
                        </div>
                        <div className="flex-1"></div>
                        <p className="text-lg font-bold text-property237-primary">
                          {parseFloat(property.price).toLocaleString()} {property.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <HomeIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No properties yet</p>
                <Link href="/add-property">
                  <button className="mt-4 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark">
                    Add Your First Property
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/add-property" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <PlusCircleIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add New Property</span>
              </Link>
              <Link href="/dashboard/agent/properties" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <HomeIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View All Properties</span>
              </Link>
              <Link href="/dashboard/agent/applications" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <UsersIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Applications</span>
              </Link>
              <Link href="/dashboard/agent/analytics" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <ChartBarIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
