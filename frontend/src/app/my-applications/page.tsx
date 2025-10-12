'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { getApiBaseUrl } from '@/services/api'
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

interface Application {
  id: number
  property: {
    id: number
    title: string
    location: string
    price: number
    images: string[]
  }
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  move_in_date: string
  notes: string
  created_at: string
  updated_at: string
}

export default function MyApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (!token || !userData) {
      router.push('/sign-in')
      return
    }

    fetchApplications(token)
  }, [router])

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/applications/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const withdrawApplication = async (applicationId: number) => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    if (!confirm('Are you sure you want to withdraw this application?')) return

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/applications/${applicationId}/withdraw/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setApplications(
          applications.map((app) =>
            app.id === applicationId ? { ...app, status: 'withdrawn' } : app
          )
        )
      }
    } catch (error) {
      console.error('Error withdrawing application:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
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

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.status === filter
  })

  if (loading) {
    return (
      <DashboardLayout
        pageTitle="My Applications"
        pageDescription="Track your rental applications"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pageTitle="My Applications"
      pageDescription="Track your rental applications"
    >

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected', 'withdrawn'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-property237-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <DocumentTextIcon className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all'
                ? "You haven't submitted any applications yet"
                : `No ${filter} applications`}
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
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
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <MapPinIcon className="w-5 h-5 mr-2" />
                          <span>{application.property.location}</span>
                        </div>
                        <p className="text-lg font-semibold text-property237-primary">
                          {application.property.price.toLocaleString()} XAF / month
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Move-in Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(application.move_in_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Applied On</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(application.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                        <p className="text-gray-900 dark:text-white">{application.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/properties/${application.property.id}`)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        View Property
                      </button>

                      {application.status === 'pending' && (
                        <button
                          onClick={() => withdrawApplication(application.id)}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Withdraw Application
                        </button>
                      )}

                      {application.status === 'approved' && (
                        <button
                          onClick={() => router.push(`/applications/${application.id}/contract`)}
                          className="px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
                        >
                          View Contract
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  )
}
