'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../../components/navigation/Navbar'
import { getApiBaseUrl } from '@/services/api'
import {
  HeartIcon as HeartOutline,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface Property {
  id: number
  title: string
  description: string
  property_type: string
  location: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  year_built: number
  images: string[]
  videos: string[]
  amenities: string[]
  is_featured: boolean
  is_available: boolean
  agent: {
    id: number
    full_name: string
    email: string
    phone_number: string
    profile_picture: string
    is_verified: boolean
  }
  created_at: string
  updated_at: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [moveInDate, setMoveInDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/properties/${id}/`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        checkFavoriteStatus(id)
      } else {
        router.push('/properties')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async (id: string) => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(
        `${apiBaseUrl}/properties/${id}/is_favorite/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.is_favorite)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      router.push('/sign-in')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/properties/${property?.id}/favorite/`,
        {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('property237_access_token')

    if (!token) {
      router.push('/sign-in')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('http://localhost:8000/api/applications/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: property?.id,
          move_in_date: moveInDate,
          notes: notes,
        }),
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        setShowApplicationModal(false)
        router.push('/my-applications')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            <img
              src={property.images[selectedImage] || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.is_featured && (
              <span className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold">
                Featured
              </span>
            )}
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              {isFavorite ? (
                <HeartSolid className="w-6 h-6 text-red-500" />
              ) : (
                <HeartOutline className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? 'ring-4 ring-property237-primary'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>{property.address || property.location}</span>
              </div>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <HomeIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {property.bedrooms} Bedrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {property.bathrooms} Bathrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {property.area} m²
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Property Type</p>
                    <p className="text-gray-900 dark:text-white font-semibold capitalize">
                      {property.property_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Year Built</p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {property.year_built || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <p className={`font-semibold ${property.is_available ? 'text-green-600' : 'text-red-600'}`}>
                      {property.is_available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-property237-primary mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 sticky top-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-property237-primary mb-2">
                  {property.price.toLocaleString()} XAF
                </p>
                <p className="text-gray-600 dark:text-gray-400">per month</p>
              </div>

              {property.is_available && (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="w-full px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors font-semibold mb-4"
                >
                  Apply Now
                </button>
              )}

              <button
                onClick={() => router.push(`/contact?property=${property.id}`)}
                className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                Contact Agent
              </button>
            </div>

            {/* Agent Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Listed By
              </h3>
              <div className="flex items-center mb-4">
                <img
                  src={property.agent.profile_picture || '/default-avatar.png'}
                  alt={property.agent.full_name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                    {property.agent.full_name}
                    {property.agent.is_verified && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-500 ml-2" />
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real Estate Agent</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {property.agent.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Phone:</strong> {property.agent.phone_number}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Apply for Property
              </h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Desired Move-in Date
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Tell the agent about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
