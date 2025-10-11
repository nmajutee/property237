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
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalFavorites: 0,
    totalApplications: 0,
    avgRating: 4.8,
    totalEarnings: 0,
    monthlyEarnings: 0,
  })
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)
      
      // TODO: Fetch real stats and properties from API
      // For now using mock data
      setStats({
        totalProperties: 12,
        activeProperties: 8,
        totalViews: 2847,
        totalFavorites: 156,
        totalApplications: 34,
        avgRating: 4.8,
        totalEarnings: 15650000,
        monthlyEarnings: 2850000,
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
      label: 'Total Properties',
      value: stats.totalProperties.toString(),
      subtext: `${stats.activeProperties} active`,
      icon: HomeIcon,
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-property237-primary',
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      subtext: 'Last 30 days',
      icon: EyeIcon,
      change: '+23%',
      trend: 'up',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    },
    {
      label: 'Applications',
      value: stats.totalApplications.toString(),
      subtext: `${stats.totalFavorites} favorites`,
      icon: UsersIcon,
      change: '+8%',
      trend: 'up',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    },
    {
      label: 'Monthly Earnings',
      value: `${(stats.monthlyEarnings / 1000).toFixed(0)}K`,
      subtext: 'XAF',
      icon: CurrencyDollarIcon,
      change: '+15%',
      trend: 'up',
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
          <Link href="/my-properties" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
          {/* @ts-expect-error - Next.js routing */}
          <Link href="/credits" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          {/* @ts-expect-error - Next.js routing */}
          <Link href="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          {/* @ts-expect-error - Next.js routing */}
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
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your properties today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
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
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Views</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
              </div>
              <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[...Array(30)].map((_, i) => {
                const height = Math.random() * 100
                return (
                  <div
                    key={i}
                    className="flex-1 bg-property237-primary/20 hover:bg-property237-primary/40 rounded-t transition-all cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}: ${Math.floor(height * 10)} views`}
                  />
                )
              })}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Revenue</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">XAF</p>
              </div>
              <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = Math.random() * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-property237-accent/80 hover:bg-property237-accent rounded-t transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${month}: ${Math.floor(height * 50000)} XAF`}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{month}</span>
                  </div>
                )
              })}
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
              <Link href="/my-properties" className="text-sm font-medium text-property237-primary hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          Modern 3BR Apartment in Douala
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Bonamoussadi, Douala • 3 beds • 2 baths
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <EyeIcon className="h-4 w-4" />
                        <span>245 views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HeartIcon className="h-4 w-4" />
                        <span>12 saves</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <UsersIcon className="h-4 w-4" />
                        <span>5 applications</span>
                      </div>
                      <div className="flex-1"></div>
                      <p className="text-lg font-bold text-property237-primary">
                        150,000 XAF
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Rating</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats.avgRating}</div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(stats.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on 47 reviews</p>
              </div>
            </div>
            <Link href="/profile" className="text-sm font-medium text-property237-primary hover:underline">
              View all reviews →
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/add-property" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <PlusCircleIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add New Property</span>
              </Link>
              <Link href="/my-applications" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <UsersIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Applications</span>
              </Link>
              <Link href="/analytics" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <ChartBarIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { text: 'New application received', time: '2 hours ago', icon: UsersIcon, color: 'text-blue-500' },
                { text: 'Property view milestone', time: '5 hours ago', icon: EyeIcon, color: 'text-green-500' },
                { text: 'New message from tenant', time: '1 day ago', icon: ChatBubbleLeftIcon, color: 'text-purple-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
