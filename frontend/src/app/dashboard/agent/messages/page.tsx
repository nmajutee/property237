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
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { authAPI } from '../../../../services/api'

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)
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
          <Link href={"/dashboard/agent/analytics" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href={"/dashboard/agent/credits" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link href={"/dashboard/agent/messages" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          <Link href={"/dashboard/agent/settings" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Communication with tenants and other agents
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-property237-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <InboxIcon className="h-10 w-10 text-property237-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Messages Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your inbox is empty. When tenants or other users send you messages, they'll appear here.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>💡 Coming Soon:</strong>
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li>• Direct messaging with tenants</li>
                <li>• Real-time notifications</li>
                <li>• File attachments</li>
                <li>• Message search and filters</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
