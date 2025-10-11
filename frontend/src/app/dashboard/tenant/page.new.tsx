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
} from '@heroicons/react/24/outline'
import { authAPI } from '../../../services/api'

interface TenantStats {
  savedProperties: number
  activeApplications: number
  scheduledViewings: number
  messagesUnread: number
}

export default function TenantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<TenantStats>({
    savedProperties: 0,
    activeApplications: 0,
    scheduledViewings: 0,
    messagesUnread: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)
      
      // TODO: Fetch real data from API
      setStats({
        savedProperties: 8,
        activeApplications: 3,
        scheduledViewings: 2,
        messagesUnread: 5,
      })
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Saved Properties',
      value: stats.savedProperties.toString(),
      subtext: 'Favorites',
      icon: HeartIcon,
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600',
      link: '/my-favorites',
    },
    {
      label: 'Applications',
      value: stats.activeApplications.toString(),
      subtext: 'In progress',
      icon: DocumentTextIcon,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-property237-primary',
      link: '/my-applications',
    },
    {
      label: 'Scheduled Visits',
      value: stats.scheduledViewings.toString(),
      subtext: 'Upcoming',
      icon: CalendarIcon,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      link: '/my-applications',
    },
    {
      label: 'Messages',
      value: stats.messagesUnread.toString(),
      subtext: 'Unread',
      icon: ChatBubbleLeftIcon,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
      link: '/chat',
    },
  ]

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
            {stats.savedProperties > 0 && (
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats.savedProperties}
              </span>
            )}
          </Link>
          <Link href="/my-applications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <DocumentTextIcon className="h-5 w-5" />
            My Applications
            {stats.activeApplications > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats.activeApplications}
              </span>
            )}
          </Link>
          <Link href="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
            {stats.messagesUnread > 0 && (
              <span className="ml-auto bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats.messagesUnread}
              </span>
            )}
          </Link>
          <Link href={"/settings" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
              Hi {user?.first_name}, find your dream home! 🏡
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your applications and discover new properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              {stats.messagesUnread > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>
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
          {/* Active Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Applications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your application progress</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { property: '3BR Apartment, Bonamoussadi', status: 'Under Review', color: 'yellow', icon: ClockIcon },
                { property: '2BR House, Akwa', status: 'Approved', color: 'green', icon: CheckCircleIcon },
                { property: 'Studio, Bonapriso', status: 'Interview Scheduled', color: 'blue', icon: CalendarIcon },
              ].map((app, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{app.property}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <app.icon className={`h-4 w-4 text-${app.color}-500`} />
                        <span className={`text-xs font-medium text-${app.color}-600 dark:text-${app.color}-400`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    <button className="text-sm text-property237-primary hover:underline">View</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              <Link href="/my-applications" className="text-sm font-medium text-property237-primary hover:underline">
                View all applications →
              </Link>
            </div>
          </div>

          {/* Upcoming Viewings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Viewings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your scheduled property visits</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { property: 'Luxury Villa, Bastos', date: 'Tomorrow', time: '10:00 AM', agent: 'John Doe' },
                { property: 'Modern Apartment, Bonapriso', date: 'Oct 15', time: '2:00 PM', agent: 'Jane Smith' },
              ].map((viewing, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{viewing.property}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{viewing.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{viewing.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Agent: {viewing.agent}</p>
                    </div>
                    <button className="text-sm text-property237-primary hover:underline">Details</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              <button className="text-sm font-medium text-property237-primary hover:underline">
                View calendar →
              </button>
            </div>
          </div>
        </div>

        {/* Saved Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Properties</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your favorite listings</p>
              </div>
              <Link href="/my-favorites" className="text-sm font-medium text-property237-primary hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 group-hover:scale-105 transition-transform"></div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-property237-primary">
                    Modern 3BR Apartment
                  </h4>
                  <HeartIcon className="h-5 w-5 text-red-500 fill-red-500 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Bonamoussadi, Douala</span>
                </div>
                <p className="text-lg font-bold text-property237-primary">
                  150,000 XAF<span className="text-sm font-normal text-gray-500">/month</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-property237-primary to-property237-primary-dark rounded-xl p-8 text-white">
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
