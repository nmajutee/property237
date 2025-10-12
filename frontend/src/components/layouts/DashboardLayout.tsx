'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import { authAPI } from '../../services/api'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle?: string
  pageDescription?: ReactNode
}

export default function DashboardLayout({ children, pageTitle, pageDescription }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)
      // In a real app, fetch unread notifications count
      setNotifications(3)
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/agent', icon: ChartBarIcon },
    { name: 'My Properties', href: '/dashboard/agent/properties', icon: HomeIcon },
    { name: 'Applications', href: '/dashboard/agent/applications', icon: UsersIcon },
    { name: 'Analytics', href: '/dashboard/agent/analytics', icon: ArrowTrendingUpIcon },
    { name: 'Credits', href: '/dashboard/agent/credits', icon: CreditCardIcon },
    { name: 'Messages', href: '/dashboard/agent/messages', icon: ChatBubbleLeftIcon },
    { name: 'Settings', href: '/dashboard/agent/settings', icon: Cog6ToothIcon },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex flex-col">
        <div className="p-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agent Portal</p>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-property237-primary/10 text-property237-primary font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Link href={"/dashboard/agent/settings" as any} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <div className="h-10 w-10 rounded-full bg-property237-primary/10 flex items-center justify-center flex-shrink-0">
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
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pageTitle || `${getGreeting()}, ${user?.first_name}!`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {pageDescription || "Here's what's happening with your properties today"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Add Property Button */}
              <Link href="/add-property">
                <button className="flex items-center gap-2 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium transition-colors">
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Property
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
