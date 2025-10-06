'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

interface Property {
  id: number
  title: string
  property_type: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  is_featured: boolean
  is_available: boolean
  views_count: number
  applications_count: number
  created_at: string
}

export default function MyPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

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
      const response = await fetch('http://localhost:8000/api/properties/my-properties/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    try {
      const response = await fetch(`http://localhost:8000/api/properties/${propertyId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProperties(properties.filter((prop) => prop.id !== propertyId))
        alert('Property deleted successfully')
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const toggleAvailability = async (propertyId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    try {
      const response = await fetch(
        `http://localhost:8000/api/properties/${propertyId}/toggle-availability/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setProperties(
          properties.map((prop) =>
            prop.id === propertyId ? { ...prop, is_available: !currentStatus } : prop
          )
        )
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const filteredProperties = properties.filter((prop) => {
    if (filter === 'all') return true
    if (filter === 'available') return prop.is_available
    if (filter === 'unavailable') return !prop.is_available
    if (filter === 'featured') return prop.is_featured
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
              {properties.filter((p) => p.is_available).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Unavailable</p>
            <p className="text-3xl font-bold text-red-600">
              {properties.filter((p) => !p.is_available).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Featured</p>
            <p className="text-3xl font-bold text-yellow-600">
              {properties.filter((p) => p.is_featured).length}
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
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.is_featured && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      property.is_available
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {property.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.area} m²</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      <span>{property.views_count || 0} views</span>
                    </div>
                    <div>
                      <span>{property.applications_count || 0} applications</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-property237-primary mb-4">
                      {property.price.toLocaleString()} XAF
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/properties/${property.id}`)}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/edit-property/${property.id}`)}
                        className="flex-1 px-3 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors flex items-center justify-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleAvailability(property.id, property.is_available)}
                      className={`w-full mt-2 px-3 py-2 rounded-lg transition-colors ${
                        property.is_available
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                      }`}
                    >
                      Mark as {property.is_available ? 'Unavailable' : 'Available'}
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
