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
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'

interface Application {
  id: number
  property: {
    id: number
    title: string
    location: string
    price: number
    images: string[]
  }
  tenant: {
    id: number
    full_name: string
    email: string
    phone_number: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  move_in_date: string
  notes: string
  created_at: string
  updated_at: string
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setUser((profileData as any).user)

      const token = localStorage.getItem('property237_access_token')
      if (token) {
        const response = await fetch(`${getApiBaseUrl()}/applications/agent/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setApplications(data.results || data)
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

  const updateApplicationStatus = async (applicationId: number, status: 'approved' | 'rejected') => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/applications/${applicationId}/update-status/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      if (response.ok) {
        setApplications(
          applications.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        )
      }
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'rejected':
      case 'withdrawn':
        return <XCircleIcon className="w-5 h-5" />
      default:
        return <ClockIcon className="w-5 h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
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
          <Link href={"/dashboard/agent/applications" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tenant applications for your properties
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-property237-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
            <UsersIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all'
                ? "You don't have any applications yet"
                : `No ${filter} applications`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Property Image */}
                    <div className="lg:w-64 flex-shrink-0">
                      <img
                        src={application.property.images[0] || '/placeholder-property.jpg'}
                        alt={application.property.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    {/* Application Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {application.property.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{application.property.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CurrencyDollarIcon className="h-4 w-4" />
                              <span>{application.property.price.toLocaleString()} XAF</span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </div>

                      {/* Tenant Info */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Applicant Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">{application.tenant.full_name}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{application.tenant.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{application.tenant.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Move-in:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{formatDate(application.move_in_date)}</span>
                          </div>
                        </div>
                        {application.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Notes:</span> {application.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {application.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Applied Date */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Applied on {formatDate(application.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
