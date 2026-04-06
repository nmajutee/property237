'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '../../../services/api'
import { useAdminDashboard } from '@/hooks/useAnalytics'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  BellIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

interface User {
  firstName: string
  lastName: string
  email: string
  userRole: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { data: adminStats, isLoading: statsLoading } = useAdminDashboard()
  const { data: notifUnread } = useUnreadNotificationCount()
  const unreadNotifications = (notifUnread as any)?.unread_count ?? 0
  const stats = adminStats as any

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getProfile() as any
        const u = userData.user || userData
        setUser({
          firstName: u.first_name || u.firstName || '',
          lastName: u.last_name || u.lastName || '',
          email: u.email || '',
          userRole: u.user_type || u.userRole || '',
        })

        if ((u.user_type || u.userRole) !== 'admin' && !u.is_staff) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/sign-in')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const systemStats = [
    {
      label: 'Total Users',
      value: stats?.total_users?.toLocaleString() ?? '—',
      change: `+${stats?.new_users_30d ?? 0} this month`,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      label: 'Total Properties',
      value: stats?.total_properties?.toLocaleString() ?? '—',
      change: `+${stats?.new_properties_30d ?? 0} this month`,
      icon: BuildingOfficeIcon,
      color: 'green'
    },
    {
      label: 'Revenue',
      value: stats ? `${(stats.total_revenue / 1000000).toFixed(1)}M XAF` : '—',
      change: `${(stats?.revenue_30d / 1000000)?.toFixed(1) ?? 0}M this month`,
      icon: CurrencyDollarIcon,
      color: 'amber'
    },
    {
      label: 'Applications',
      value: stats?.total_applications?.toLocaleString() ?? '—',
      change: `${stats?.pending_applications ?? 0} pending`,
      icon: ChartBarIcon,
      color: 'purple'
    }
  ]

  const recentUsers = stats?.recent_users ?? []
  const pendingProperties = stats?.pending_properties ?? []

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon, active: true },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Properties', href: '/properties', icon: BuildingOfficeIcon },
    { name: 'Agents', href: '/agents', icon: UsersIcon },
    { name: 'Moderation', href: '/moderation', icon: ShieldCheckIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Payments', href: '/payments', icon: BanknotesIcon },
    { name: 'Leases', href: '/leases', icon: DocumentTextIcon },
    { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, badge: unreadNotifications > 0 ? unreadNotifications.toString() : undefined },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-property237-primary">Property237</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="px-3 pb-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              className={`flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-property237-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  item.active
                    ? 'bg-white text-property237-primary'
                    : 'bg-property237-primary text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                System Overview
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Welcome back, {user?.firstName}. Here's your platform status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-3">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                  'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users by Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Users by Type
            </h3>
            <div className="space-y-4">
              {(stats?.users_by_type ?? []).map((item: any, index: number) => {
                const total = stats?.total_users || 1
                const pct = Math.round((item.count / total) * 100)
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{item.user_type}</span>
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
              })}
            </div>
          </div>

          {/* Platform Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Platform Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Agents</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.total_agents ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Active Properties</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.total_properties ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats ? `${(stats.total_revenue / 1000000).toFixed(1)}M` : '0'}</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending Apps</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.pending_applications ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlusIcon className="h-5 w-5 text-property237-primary" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Registrations
                  </h3>
                </div>
                <Link
                  href={"/dashboard/admin/users" as any}
                  className="text-sm font-medium text-property237-primary hover:text-property237-primary-dark"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No recent users</div>
              ) : recentUsers.map((u: any) => (
                <div key={u.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {(u.first_name || 'U').charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {u.first_name} {u.last_name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {u.is_active ? 'active' : 'inactive'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(u.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {u.user_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Properties */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pending Properties
                  </h3>
                </div>
                <Link
                  href="/properties"
                  className="text-sm font-medium text-property237-primary hover:text-property237-primary-dark"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingProperties.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No pending properties</div>
              ) : pendingProperties.map((property: any) => (
                <div key={property.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(property.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-property237-primary">
                      {Number(property.price).toLocaleString()} XAF
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="h-5 w-5 text-property237-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/properties"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BuildingOfficeIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manage Properties
                </span>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BellIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notifications
                </span>
              </Link>
              <Link
                href="/payments"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BanknotesIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  View Payments
                </span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Platform Settings
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
