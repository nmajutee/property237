'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { getApiBaseUrl } from '@/services/api'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

interface PropertyType {
  id: number
  name: string
  category: string
}

interface PropertyStatus {
  id: number
  name: string
}

interface PropertyArea {
  id: number
  name: string
  city: {
    id: number
    name: string
    region: {
      id: number
      name: string
      code: string
    }
  }
}

interface PropertyImage {
  id: number
  image: string
  image_url: string
  is_primary: boolean
  order: number
}

interface Property {
  id: number
  slug: string
  title: string
  property_type: PropertyType
  status: PropertyStatus
  listing_type: string
  price: string
  currency: string
  area: PropertyArea
  no_of_bedrooms: number
  no_of_bathrooms: number
  featured: boolean
  is_active: boolean
  views_count: number
  created_at: string
  images: PropertyImage[]
  primary_image: string | null
}

export default function MyPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean, propertySlug: string, propertyTitle: string }>({ show: false, propertySlug: '', propertyTitle: '' })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (!token || !userData) {
      router.push('/sign-in')
      return
    }

    const user = JSON.parse(userData)
    if (user.user_type !== 'agent') {
      router.push('/dashboard/tenant')
      return
    }

    fetchProperties(token)
  }, [router])

  const fetchProperties = async (token: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/properties/my-properties/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        console.log('First property:', data.results?.[0])
        console.log('First property images:', data.results?.[0]?.images)
        console.log('First property primary_image:', data.results?.[0]?.primary_image)
        setProperties(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const confirmDelete = (propertySlug: string, propertyTitle: string) => {
    setDeleteModal({ show: true, propertySlug, propertyTitle })
  }

  const cancelDelete = () => {
    setDeleteModal({ show: false, propertySlug: '', propertyTitle: '' })
  }

  const deleteProperty = async () => {
    const { propertySlug, propertyTitle } = deleteModal

    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      console.error('No token found')
      showNotification('error', 'Please log in to delete properties')
      router.push('/signin')
      return
    }

    setDeleting(true)

    try {
      const apiBaseUrl = getApiBaseUrl()
      console.log(`Deleting property: ${propertySlug}`)
      console.log(`API URL: ${apiBaseUrl}/properties/${propertySlug}/`)

      const response = await fetch(`${apiBaseUrl}/properties/${propertySlug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log(`Delete response status: ${response.status}`)
      console.log(`Delete response ok: ${response.ok}`)

      // Get response text for debugging
      const responseText = await response.text()
      console.log(`Delete response body: ${responseText}`)

      if (response.ok || response.status === 204) {
        // Remove property from state immediately for instant UI update
        setProperties(prev => prev.filter(p => p.slug !== propertySlug))

        // Close modal
        setDeleteModal({ show: false, propertySlug: '', propertyTitle: '' })

        // Show success notification
        showNotification('success', `"${propertyTitle}" has been deleted successfully`)

        // Re-fetch to ensure sync with backend
        await fetchProperties(token)
      } else {
        // Try to parse error response
        let errorData: any = {}
        try {
          errorData = responseText ? JSON.parse(responseText) : {}
        } catch (e) {
          errorData = { detail: responseText || 'Unknown error' }
        }

        console.error('Delete failed - Status:', response.status)
        console.error('Delete failed - Error data:', errorData)
        console.error('Delete failed - Headers:', Object.fromEntries(response.headers.entries()))

        // Get better error message
        let errorMessage = 'Unknown error'
        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to delete this property'
        } else if (response.status === 404) {
          errorMessage = 'Property not found'
        } else if (response.status === 401) {
          errorMessage = 'Please log in again'
        } else {
          errorMessage = `Server error (${response.status})`
        }

        showNotification('error', `Failed to delete property: ${errorMessage}`)
        setDeleteModal({ show: false, propertySlug: '', propertyTitle: '' })
      }
    } catch (error: any) {
      console.error('Error deleting property:', error)
      showNotification('error', `Error: ${error.message || 'Please check your connection and try again'}`)
      setDeleteModal({ show: false, propertySlug: '', propertyTitle: '' })
    } finally {
      setDeleting(false)
    }
  }

  const toggleAvailability = async (propertySlug: string, currentStatus: boolean) => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      console.error('No token found')
      showNotification('error', 'Please log in to update properties')
      router.push('/signin')
      return
    }

    try {
      const apiBaseUrl = getApiBaseUrl()
      console.log(`Toggling availability for: ${propertySlug} from ${currentStatus} to ${!currentStatus}`)

      // Update is_active status via PATCH
      const response = await fetch(
        `${apiBaseUrl}/properties/${propertySlug}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_active: !currentStatus })
        }
      )

      console.log(`Toggle response status: ${response.status}`)

      if (response.ok) {
        // Update property in state immediately
        setProperties(prev => prev.map(p =>
          p.slug === propertySlug ? { ...p, is_active: !currentStatus } : p
        ))

        showNotification('success', `Property marked as ${!currentStatus ? 'available' : 'unavailable'}`)

        // Re-fetch to ensure sync with backend
        await fetchProperties(token)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Toggle failed:', errorData)
        showNotification('error', `Failed to update property: ${errorData.error || errorData.detail || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Error toggling availability:', error)
      showNotification('error', `Error: ${error.message || 'Please check your connection and try again'}`)
    }
  }

  const filteredProperties = properties.filter((prop) => {
    if (filter === 'all') return true
    if (filter === 'available') return prop.is_active
    if (filter === 'unavailable') return !prop.is_active
    if (filter === 'featured') return prop.featured
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className={`rounded-lg shadow-lg p-4 max-w-md ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={cancelDelete}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Property
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-semibold">"{deleteModal.propertyTitle}"</span>? This action cannot be undone and will permanently remove this property from your listings and the database.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={deleteProperty}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-property237-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Properties
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your property listings
            </p>
          </div>
          <button
            onClick={() => router.push('/add-property')}
            className="flex items-center px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Property
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Available</p>
            <p className="text-3xl font-bold text-green-600">
              {properties.filter((p) => p.is_active).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Unavailable</p>
            <p className="text-3xl font-bold text-red-600">
              {properties.filter((p) => !p.is_active).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Featured</p>
            <p className="text-3xl font-bold text-yellow-600">
              {properties.filter((p) => p.featured).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'available', 'unavailable', 'featured'].map((status) => (
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

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <HomeIcon className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all'
                ? "You haven't added any properties yet"
                : `No ${filter} properties`}
            </p>
            <button
              onClick={() => router.push('/add-property')}
              className="px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Property Image */}
                <div className="relative h-56">
                  <img
                    src={(() => {
                      const imageUrl = property.primary_image || property.images[0]?.image_url || '/placeholder-property.jpg'
                      console.log(`Property "${property.title}" - Image URL:`, imageUrl)
                      console.log(`  primary_image:`, property.primary_image)
                      console.log(`  images[0]:`, property.images[0])
                      return imageUrl
                    })()}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.featured && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      property.is_active
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {property.is_active ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                      {property.area.name}, {property.area.city.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{property.no_of_bedrooms} bed</span>
                      <span>{property.no_of_bathrooms} bath</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {property.property_type.name}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      <span>{property.views_count || 0} views</span>
                    </div>
                    <div>
                      <span>{property.listing_type}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-property237-primary mb-4">
                      {parseFloat(property.price).toLocaleString()} {property.currency}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          console.log(`Navigating to property detail: ${property.slug}`)
                          router.push(`/properties/${property.slug}`)
                        }}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Navigating to edit property: ${property.slug}`)
                          router.push(`/edit-property/${property.slug}`)
                        }}
                        className="flex-1 px-3 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors flex items-center justify-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Delete button clicked for: ${property.slug}`)
                          confirmDelete(property.slug, property.title)
                        }}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleAvailability(property.slug, property.is_active)}
                      className={`w-full mt-2 px-3 py-2 rounded-lg transition-colors ${
                        property.is_active
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                      }`}
                    >
                      Mark as {property.is_active ? 'Unavailable' : 'Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
