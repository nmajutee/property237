'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '../../../services/api'
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
  ArrowTrendingDownIcon,
  UserPlusIcon,
  BellIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  ServerIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface User {
  firstName: string
  lastName: string
  email: string
  userRole: string
}

interface SystemStat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
}

interface RecentUser {
  id: number
  name: string
  email: string
  role: string
  joined: string
  status: 'active' | 'pending' | 'suspended'
}

interface PendingProperty {
  id: number
  title: string
  agent: string
  location: string
  price: string
  submitted: string
  status: 'pending' | 'approved' | 'rejected'
}

interface SystemMetric {
  name: string
  value: string
  status: 'healthy' | 'warning' | 'critical'
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedRevenuePeriod, setSelectedRevenuePeriod] = useState('12')
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getProfile() as User
        setUser(userData)
        
        // Redirect if not admin
        if (userData.userRole !== 'admin') {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // Mock data - replace with real API calls
  const systemStats: SystemStat[] = [
    {
      label: 'Total Users',
      value: '1,247',
      change: '+18%',
      trend: 'up',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      label: 'Total Properties',
      value: '342',
      change: '+23%',
      trend: 'up',
      icon: BuildingOfficeIcon,
      color: 'green'
    },
    {
      label: 'Platform Revenue',
      value: '48.5M XAF',
      change: '+15%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'amber'
    },
    {
      label: 'Active Transactions',
      value: '89',
      change: '-5%',
      trend: 'down',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ]

  const recentUsers: RecentUser[] = [
    {
      id: 1,
      name: 'Jean Kamdem',
      email: 'jean.kamdem@email.com',
      role: 'Tenant',
      joined: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Marie Ngoue',
      email: 'marie.ngoue@email.com',
      role: 'Agent',
      joined: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Paul Etonde',
      email: 'paul.etonde@email.com',
      role: 'Tenant',
      joined: '6 hours ago',
      status: 'active'
    },
    {
      id: 4,
      name: 'Sophie Mballa',
      email: 'sophie.mballa@email.com',
      role: 'Agent',
      joined: '1 day ago',
      status: 'active'
    }
  ]

  const pendingProperties: PendingProperty[] = [
    {
      id: 1,
      title: 'Modern 3BR Apartment',
      agent: 'Marie Ngoue',
      location: 'Bonapriso, Douala',
      price: '180,000 XAF/month',
      submitted: '1 hour ago',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      agent: 'Sophie Mballa',
      location: 'Bastos, Yaoundé',
      price: '450,000 XAF/month',
      submitted: '3 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Cozy Studio Near University',
      agent: 'Jacques Biya',
      location: 'Ngoa-Ekelle, Yaoundé',
      price: '75,000 XAF/month',
      submitted: '5 hours ago',
      status: 'pending'
    }
  ]

  const systemMetrics: SystemMetric[] = [
    { name: 'Server Uptime', value: '99.9%', status: 'healthy' },
    { name: 'API Response Time', value: '124ms', status: 'healthy' },
    { name: 'Database Load', value: '67%', status: 'warning' },
    { name: 'Storage Used', value: '43%', status: 'healthy' },
    { name: 'Active Sessions', value: '1,247', status: 'healthy' },
    { name: 'Error Rate', value: '0.2%', status: 'healthy' }
  ]

  // Monthly user growth data (mock)
  const userGrowthData = [
    { month: 'Jan', users: 820 },
    { month: 'Feb', users: 890 },
    { month: 'Mar', users: 950 },
    { month: 'Apr', users: 1020 },
    { month: 'May', users: 1100 },
    { month: 'Jun', users: 1180 },
    { month: 'Jul', users: 1247 }
  ]

  // Monthly revenue data (mock)
  const revenueData = [
    { month: 'Jan', revenue: 35.2 },
    { month: 'Feb', revenue: 38.5 },
    { month: 'Mar', revenue: 41.0 },
    { month: 'Apr', revenue: 43.5 },
    { month: 'May', revenue: 45.0 },
    { month: 'Jun', revenue: 46.8 },
    { month: 'Jul', revenue: 48.5 }
  ]

  const maxUserGrowth = Math.max(...userGrowthData.map(d => d.users))
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon, active: true },
    { name: 'Users Management', href: '/dashboard/admin/users', icon: UsersIcon, badge: '12' },
    { name: 'Properties', href: '/dashboard/admin/properties', icon: BuildingOfficeIcon, badge: '5' },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBarIcon },
    { name: 'Financials', href: '/dashboard/admin/financials', icon: BanknotesIcon },
    { name: 'Support Tickets', href: '/dashboard/admin/support', icon: ChatBubbleLeftRightIcon, badge: '8' },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: DocumentTextIcon },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Cog6ToothIcon },
    { name: 'System Logs', href: '/dashboard/admin/logs', icon: ClipboardDocumentListIcon }
  ]

  if (isLoading) {
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
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Growth
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total users over time
                </p>
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-property237-primary"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {userGrowthData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${(data.users / maxUserGrowth) * 200}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.users} users
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Platform Revenue
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Revenue in millions (XAF)
                </p>
              </div>
              <select
                value={selectedRevenuePeriod}
                onChange={(e) => setSelectedRevenuePeriod(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-property237-primary"
              >
                <option value="6">Last 6 months</option>
                <option value="12">Last 12 months</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-500 cursor-pointer"
                      style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.revenue}M XAF
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
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
              {recentUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : user.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.joined}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {user.role}
                    </span>
                    <button className="ml-auto text-xs text-property237-primary hover:text-property237-primary-dark font-medium">
                      Review
                    </button>
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
                    Property Approvals
                  </h3>
                </div>
                <Link
                  href={"/dashboard/admin/properties" as any}
                  className="text-sm font-medium text-property237-primary hover:text-property237-primary-dark"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingProperties.map((property) => (
                <div key={property.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        by {property.agent} • {property.location}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-property237-primary">
                        {property.price}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • {property.submitted}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <ServerIcon className="h-5 w-5 text-property237-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Health
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {systemMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {metric.name}
                    </p>
                    <div className={`h-2 w-2 rounded-full ${
                      metric.status === 'healthy' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="h-5 w-5 text-property237-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Link
                href={"/dashboard/admin/users/new" as any}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add New User
                </span>
              </Link>
              <Link
                href={"/dashboard/admin/properties" as any}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BuildingOfficeIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moderate Properties
                </span>
              </Link>
              <Link
                href={"/dashboard/admin/reports" as any}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 text-property237-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generate Report
                </span>
              </Link>
              <Link
                href={"/dashboard/admin/settings" as any}
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
