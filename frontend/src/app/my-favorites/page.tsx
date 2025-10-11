'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { getApiBaseUrl } from '@/services/api'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid, MapPinIcon, HomeIcon } from '@heroicons/react/24/solid'

interface Property {
  id: number
  slug: string
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
}

export default function MyFavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (!token || !userData) {
      router.push('/sign-in')
      return
    }

    setUser(JSON.parse(userData))
    fetchFavorites(token)
  }, [router])

  const fetchFavorites = async (token: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/properties/favorites/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (propertySlug: string) => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/properties/${propertySlug}/favorite/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        // Re-fetch favorites to update list
        fetchFavorites(token)
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorite Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Properties you've saved for later
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <HeartOutline className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start saving properties you're interested in
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
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
                  {!property.is_available && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Unavailable
                    </span>
                  )}
                  <button
                    onClick={() => removeFavorite(property.slug || property.id.toString())}
                    className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <HeartSolid className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-property237-primary transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <HomeIcon className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div>
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-2xl font-bold text-property237-primary">
                        {property.price.toLocaleString()} XAF
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
                    </div>
                    <button
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
                    >
                      View Details
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
