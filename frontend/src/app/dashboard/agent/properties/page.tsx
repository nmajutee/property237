'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'
import DashboardLayout from '../../../../components/layouts/DashboardLayout'

interface Property {
  id: number
  slug: string
  title: string
  property_type: { name: string }
  status: { name: string }
  listing_type: string
  price: string
  currency: string
  area: {
    name: string
    city: { name: string }
  }
  no_of_bedrooms: number
  no_of_bathrooms: number
  featured: boolean
  is_active: boolean
  views_count: number
  created_at: string
  images: Array<{ image_url: string; is_primary: boolean }>
  primary_image: string | null
}

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; slug: string; title: string }>({
    show: false,
    slug: '',
    title: ''
  })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')
      if (token) {
        const response = await fetch(`${getApiBaseUrl()}/properties/my-properties/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProperties(data.results || data)
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

  const handleDelete = async () => {
    const token = localStorage.getItem('property237_access_token')
    if (!token) return

    setDeleting(true)
    try {
      const response = await fetch(`${getApiBaseUrl()}/properties/${deleteModal.slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok || response.status === 204) {
        setProperties(prev => prev.filter(p => p.slug !== deleteModal.slug))
        setDeleteModal({ show: false, slug: '', title: '' })
        alert('Property deleted successfully')
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && property.is_active) ||
      (filter === 'inactive' && !property.is_active) ||
      (filter === 'featured' && property.featured)

    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.is_active).length,
    featured: properties.filter(p => p.featured).length,
    totalViews: properties.reduce((sum, p) => sum + p.views_count, 0),
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pageTitle="My Properties"
      pageDescription={
        <>
          Manage your property listings • <Link href="/properties" className="text-property237-primary hover:underline">Preview how your properties appear to the public</Link>
        </>
      }
    >

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <HomeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <HeartIcon className="h-5 w-5 text-property237-accent" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
            </div>
            <p className="text-3xl font-bold text-property237-accent">{stats.featured}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <EyeIcon className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.totalViews}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {['all', 'active', 'inactive', 'featured'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === filterOption
                      ? 'bg-property237-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
            <HomeIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search' : "You haven't added any properties yet"}
            </p>
            <Link href="/add-property">
              <button className="px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium">
                Add Your First Property
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={property.primary_image || property.images[0]?.image_url || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.featured && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-property237-accent text-white text-xs font-semibold rounded">
                      Featured
                    </span>
                  )}
                  <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${
                    property.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {property.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {property.area?.name}, {property.area?.city?.name}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-property237-primary">
                      {parseFloat(property.price).toLocaleString()} {property.currency}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {property.listing_type}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{property.views_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="h-4 w-4" />
                      <span>{property.no_of_bedrooms} bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{property.no_of_bathrooms} bath</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/properties/${property.slug}`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium text-sm flex items-center justify-center gap-2">
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                    </Link>
                    <Link href={`/edit-property/${property.slug}`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium text-sm flex items-center justify-center gap-2">
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ show: true, slug: property.slug, title: property.title })}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium text-sm"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Property</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "<strong>{deleteModal.title}</strong>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, slug: '', title: '' })}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
