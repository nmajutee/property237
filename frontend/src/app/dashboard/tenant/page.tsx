'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  HeartIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  StarIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { authAPI } from '../../../services/api'
import { useTenantDashboard } from '@/hooks/useAnalytics'
import { useTenantApplications } from '@/hooks/useTenants'
import { useFavorites } from '@/hooks/useProperties'
import { useChatUnreadCount } from '@/hooks/useChat'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'

export default function TenantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const { data: dashboardStats, isLoading: statsLoading } = useTenantDashboard()
  const { data: applicationsData, isLoading: appsLoading } = useTenantApplications()
  const { data: favoritesData, isLoading: favsLoading } = useFavorites()
  const { data: chatUnread } = useChatUnreadCount()
  const { data: notifUnread } = useUnreadNotificationCount()

  const applications = (applicationsData as any)?.results ?? (applicationsData as any) ?? []
  const favorites = (favoritesData as any)?.results ?? (favoritesData as any) ?? []
  const unreadMessages = (chatUnread as any)?.unread_count ?? 0
  const unreadNotifications = (notifUnread as any)?.unread_count ?? 0

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

  const stats = dashboardStats as any
  const favoriteCount = stats?.favorite_properties ?? favorites.length
  const totalApplications = stats?.total_applications ?? applications.length
  const pendingApplications = stats?.pending_applications ?? 0

  const statCards = [
    {
      label: 'Saved Properties',
      value: favoriteCount.toString(),
      subtext: 'Favorites',
      icon: HeartIcon,
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600',
      link: '/my-favorites',
    },
    {
      label: 'Applications',
      value: totalApplications.toString(),
      subtext: `${pendingApplications} pending`,
      icon: DocumentTextIcon,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-property237-primary',
      link: '/my-applications',
    },
    {
      label: 'Approved',
      value: (stats?.approved_applications ?? 0).toString(),
      subtext: `${stats?.rejected_applications ?? 0} rejected`,
      icon: CheckCircleIcon,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      link: '/my-applications',
    },
    {
      label: 'Messages',
      value: unreadMessages.toString(),
      subtext: 'Unread',
      icon: ChatBubbleLeftIcon,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
      link: '/chat',
    },
  ]

  const recentApplications = stats?.recent_applications ?? applications.slice(0, 5)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'submitted': return { color: 'yellow', label: 'Under Review', Icon: ClockIcon }
      case 'approved': return { color: 'green', label: 'Approved', Icon: CheckCircleIcon }
      case 'rejected': return { color: 'red', label: 'Rejected', Icon: DocumentTextIcon }
      case 'withdrawn': return { color: 'gray', label: 'Withdrawn', Icon: DocumentDuplicateIcon }
      default: return { color: 'blue', label: status, Icon: ClockIcon }
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tenant Portal</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <Link href="/dashboard/tenant" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search Properties
          </Link>
          <Link href="/my-favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HeartIcon className="h-5 w-5" />
            My Favorites
            {favoriteCount > 0 && (
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {favoriteCount}
              </span>
            )}
          </Link>
          <Link href="/my-applications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <DocumentTextIcon className="h-5 w-5" />
            My Applications
            {pendingApplications > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingApplications}
              </span>
            )}
          </Link>
          <Link href="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
            {unreadMessages > 0 && (
              <span className="ml-auto bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link href="/leases" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <DocumentDuplicateIcon className="h-5 w-5" />
            Leases
          </Link>
          <Link href="/maintenance" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <WrenchScrewdriverIcon className="h-5 w-5" />
            Maintenance
          </Link>
          <Link href="/payments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Payments
          </Link>
          <Link href="/credit-score" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <StarIcon className="h-5 w-5" />
            Credit Score
          </Link>
          <Link href="/referrals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ShareIcon className="h-5 w-5" />
            Referrals
          </Link>
          <Link href="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <BellIcon className="h-5 w-5" />
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hi {user?.first_name}, find your dream home!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your applications and discover new properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
            <Link href="/properties">
              <button className="flex items-center gap-2 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium">
                <MagnifyingGlassIcon className="h-5 w-5" />
                Browse Properties
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.link as any}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer">
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
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Application Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your application progress</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {appsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : recentApplications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No applications yet. Start browsing properties!
                </div>
              ) : (
                recentApplications.slice(0, 5).map((app: any, i: number) => {
                  const { color, label, Icon } = getStatusStyle(app.status)
                  return (
                    <div key={app.id ?? i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.property__title || app.property?.title || 'Property Application'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Icon className={`h-4 w-4 text-${color}-500`} />
                            <span className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>
                              {label}
                            </span>
                          </div>
                        </div>
                        <Link href="/my-applications" className="text-sm text-property237-primary hover:underline">View</Link>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              <Link href="/my-applications" className="text-sm font-medium text-property237-primary hover:underline">
                View all applications →
              </Link>
            </div>
          </div>

          {/* Saved Properties Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Properties</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your favorite listings</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {favsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : favorites.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No favorites yet. Browse properties and save your picks!
                </div>
              ) : (
                favorites.slice(0, 4).map((prop: any, i: number) => (
                  <div key={prop.id ?? prop.slug ?? i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{prop.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{prop.location || prop.city || prop.area || 'Cameroon'}</span>
                        </div>
                        <p className="text-sm font-bold text-property237-primary mt-1">
                          {Number(prop.price).toLocaleString()} XAF
                        </p>
                      </div>
                      <HeartIcon className="h-5 w-5 text-red-500 fill-red-500 flex-shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              <Link href="/my-favorites" className="text-sm font-medium text-property237-primary hover:underline">
                View all favorites →
              </Link>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-property237-primary to-property237-primary-dark rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Discover Your Perfect Home</h3>
              <p className="text-blue-100 mb-4">
                Browse thousands of properties tailored to your preferences
              </p>
              <Link href="/properties">
                <button className="px-6 py-3 bg-white text-property237-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Searching
                </button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
