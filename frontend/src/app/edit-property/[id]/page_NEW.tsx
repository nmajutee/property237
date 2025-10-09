'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '../../../components/navigation/Navbar'
import { PhotoIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getApiBaseUrl } from '@/services/api'

// Interfaces matching backend models (same as add-property)
interface PropertyType {
  id: number
  name: string
  category: string
  subtype?: string
}

interface PropertyStatus {
  id: number
  name: string
}

interface Region {
  id: number
  name: string
  code: string
}

interface City {
  id: number
  name: string
  region: Region
}

interface Area {
  id: number
  name: string
  city: City
}

interface PropertyImage {
  id: number
  image: string
  image_url: string
  is_primary: boolean
  order: number
}

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertySlug = params.id as string

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Metadata from backend
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatus[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  // Selected location states
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  // Existing images from server
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])

  // Form state - ALL backend Property model fields
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    property_type: '',
    status: '',
    listing_type: 'rent',

    // Location
    area: '',
    distance_from_main_road: '',
    road_is_tarred: false,
    vehicle_access: '',

    // Property Details
    no_of_bedrooms: 0,
    no_of_living_rooms: 0,
    no_of_bathrooms: 1,
    no_of_kitchens: 1,
    kitchen_type: '',
    no_of_balconies: 0,
    no_of_floors: 1,
    floor_number: '',
    room_size: '',
    has_dressing_cupboard: false,

    // Utilities
    electricity_type: '',
    electricity_payment: '',
    water_type: '',
    has_ac_preinstalled: false,
    has_hot_water: false,
    has_generator: false,

    // Amenities
    has_parking: false,
    has_security: false,
    has_pool: false,
    has_gym: false,
    has_elevator: false,

    // Furniture & Appliances
    furnished: '',
    has_tv: false,
    has_fridge: false,
    has_gas_cooker: false,
    has_microwave: false,
    has_washing_machine: false,

    // Financial
    price: '',
    currency: 'XAF',
    deposit: '',
    service_charge: '',
    lease_terms: '',

    // Additional
    square_footage: '',
    year_built: '',
    pets_allowed: false,
    smoking_allowed: false,
    featured: false,
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Fetch property data and metadata on mount
  useEffect(() => {
    fetchMetadata()
    fetchPropertyData()
  }, [propertySlug])

  // Fetch metadata (same as add-property)
  const fetchMetadata = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl()

      const [typesRes, statusesRes, regionsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/properties/types/`),
        fetch(`${apiBaseUrl}/properties/statuses/`),
        fetch(`${apiBaseUrl}/locations/regions/`),
      ])

      if (typesRes.ok) setPropertyTypes(await typesRes.json())
      if (statusesRes.ok) setPropertyStatuses(await statusesRes.json())
      if (regionsRes.ok) setRegions(await regionsRes.json())
    } catch (err) {
      console.error('Error fetching metadata:', err)
    }
  }

  // Fetch existing property data
  const fetchPropertyData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('property237_access_token')

      if (!token) {
        router.push('/signin')
        return
      }

      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/properties/${propertySlug}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch property data')
      }

      const data = await response.json()
      console.log('Loaded property data:', data)

      // Map backend data to form fields
      setFormData({
        title: data.title || '',
        description: data.description || '',
        property_type: data.property_type?.id?.toString() || '',
        status: data.status?.id?.toString() || '',
        listing_type: data.listing_type || 'rent',
        area: data.area?.id?.toString() || '',
        distance_from_main_road: data.distance_from_main_road || '',
        road_is_tarred: data.road_is_tarred || false,
        vehicle_access: data.vehicle_access || '',
        no_of_bedrooms: data.no_of_bedrooms || 0,
        no_of_living_rooms: data.no_of_living_rooms || 0,
        no_of_bathrooms: data.no_of_bathrooms || 1,
        no_of_kitchens: data.no_of_kitchens || 1,
        kitchen_type: data.kitchen_type || '',
        no_of_balconies: data.no_of_balconies || 0,
        no_of_floors: data.no_of_floors || 1,
        floor_number: data.floor_number || '',
        room_size: data.room_size || '',
        has_dressing_cupboard: data.has_dressing_cupboard || false,
        electricity_type: data.electricity_type || '',
        electricity_payment: data.electricity_payment || '',
        water_type: data.water_type || '',
        has_ac_preinstalled: data.has_ac_preinstalled || false,
        has_hot_water: data.has_hot_water || false,
        has_generator: data.has_generator || false,
        has_parking: data.has_parking || false,
        has_security: data.has_security || false,
        has_pool: data.has_pool || false,
        has_gym: data.has_gym || false,
        has_elevator: data.has_elevator || false,
        furnished: data.furnished || '',
        has_tv: data.has_tv || false,
        has_fridge: data.has_fridge || false,
        has_gas_cooker: data.has_gas_cooker || false,
        has_microwave: data.has_microwave || false,
        has_washing_machine: data.has_washing_machine || false,
        price: data.price || '',
        currency: data.currency || 'XAF',
        deposit: data.deposit || '',
        service_charge: data.service_charge || '',
        lease_terms: data.lease_terms || '',
        square_footage: data.square_footage || '',
        year_built: data.year_built || '',
        pets_allowed: data.pets_allowed || false,
        smoking_allowed: data.smoking_allowed || false,
        featured: data.featured || false,
      })

      // Set location hierarchy
      if (data.area?.city?.region?.id) {
        setSelectedRegion(data.area.city.region.id.toString())
        await fetchCitiesByRegion(data.area.city.region.id.toString())
      }

      if (data.area?.city?.id) {
        setSelectedCity(data.area.city.id.toString())
        await fetchAreasByCity(data.area.city.id.toString())
      }

      // Set existing images
      if (data.images && data.images.length > 0) {
        setExistingImages(data.images)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching property:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Fetch cities when region changes
  const fetchCitiesByRegion = async (regionId: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/locations/cities/?region=${regionId}`)
      if (response.ok) {
        const data = await response.json()
        setCities(data)
      }
    } catch (err) {
      console.error('Error fetching cities:', err)
    }
  }

  // Fetch areas when city changes
  const fetchAreasByCity = async (cityId: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/locations/areas/?city=${cityId}`)
      if (response.ok) {
        const data = await response.json()
        setAreas(data)
      }
    } catch (err) {
      console.error('Error fetching areas:', err)
    }
  }

  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value
    setSelectedRegion(regionId)
    setSelectedCity('')
    setFormData({ ...formData, area: '' })
    setCities([])
    setAreas([])
    if (regionId) {
      fetchCitiesByRegion(regionId)
    }
  }

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    setSelectedCity(cityId)
    setFormData({ ...formData, area: '' })
    setAreas([])
    if (cityId) {
      fetchAreasByCity(cityId)
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData({ ...formData, [name]: target.checked })
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const totalImages = existingImages.length + images.length + files.length
    if (totalImages > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    setImages([...images, ...files])

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  // Remove new image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  // Mark existing image for deletion
  const removeExistingImage = (imageId: number) => {
    setImagesToDelete([...imagesToDelete, imageId])
    setExistingImages(existingImages.filter(img => img.id !== imageId))
  }

  // Validation functions (same as add-property)
  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError('Property title is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!formData.property_type) {
      setError('Property type is required')
      return false
    }
    setError(null)
    return true
  }

  const validateStep2 = () => {
    if (!selectedRegion) {
      setError('Region is required')
      return false
    }
    if (!selectedCity) {
      setError('City is required')
      return false
    }
    if (!formData.area) {
      setError('Area/Neighborhood is required')
      return false
    }
    setError(null)
    return true
  }

  const validateStep3 = () => {
    if (formData.no_of_bedrooms < 0 || formData.no_of_bathrooms < 0) {
      setError('Please enter valid room counts')
      return false
    }
    setError(null)
    return true
  }

  const validateStep4 = () => {
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required')
      return false
    }
    setError(null)
    return true
  }

  // Navigation
  const handleNext = () => {
    let isValid = false

    switch (step) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      case 4:
        isValid = validateStep4()
        break
      default:
        isValid = true
    }

    if (isValid && step < 5) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  // Submit updated property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep4()) return

    try {
      setSubmitting(true)
      setError(null)

      const token = localStorage.getItem('property237_access_token')
      if (!token) {
        router.push('/signin')
        return
      }

      // Check and refresh token if needed
      const tokenExpiry = localStorage.getItem('property237_token_expiry')
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        const refreshToken = localStorage.getItem('property237_refresh_token')
        if (refreshToken) {
          try {
            const apiBaseUrl = getApiBaseUrl()
            const refreshResponse = await fetch(`${apiBaseUrl}/users/token/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              localStorage.setItem('property237_access_token', refreshData.access)
              localStorage.setItem('property237_token_expiry', (Date.now() + 14 * 60 * 1000).toString())
            } else {
              router.push('/signin')
              return
            }
          } catch (refreshErr) {
            console.error('Token refresh failed:', refreshErr)
            router.push('/signin')
            return
          }
        } else {
          router.push('/signin')
          return
        }
      }

      const formDataToSend = new FormData()

      // Append all fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData]
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value.toString())
          } else {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      // Append new images
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      // Append images to delete
      if (imagesToDelete.length > 0) {
        formDataToSend.append('delete_images', JSON.stringify(imagesToDelete))
      }

      const apiBaseUrl = getApiBaseUrl()
      const newToken = localStorage.getItem('property237_access_token')
      const response = await fetch(`${apiBaseUrl}/properties/${propertySlug}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${newToken}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.error || 'Failed to update property')
      }

      const updatedProperty = await response.json()
      console.log('Property updated:', updatedProperty)

      // Show success message
      setSuccessMessage('Property updated successfully!')

      // Redirect after 2.5 seconds
      setTimeout(() => {
        router.push('/my-properties')
      }, 2500)

    } catch (err: any) {
      console.error('Error updating property:', err)
      setError(err.message || 'Failed to update property. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/my-properties')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-property237-primary mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to My Properties
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Update Property Listing
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your property details
          </p>
        </div>

        {/* Progress Steps - Same as add-property */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? 'bg-property237-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    {s === 1 && 'Basic Info'}
                    {s === 2 && 'Location'}
                    {s === 3 && 'Details'}
                    {s === 4 && 'Pricing'}
                    {s === 5 && 'Images'}
                  </span>
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s
                        ? 'bg-property237-primary'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex justify-between items-start">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            {/* COPY ALL STEP CONTENT FROM add-property/page.tsx */}
            {/* This is placeholder - we'll use the exact same JSX */}

            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Form steps will be identical to add-property form...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                (Implementation in progress - copying exact structure from add-property)
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Property...
                    </>
                  ) : (
                    'Update Property'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
