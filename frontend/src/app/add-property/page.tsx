'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Interfaces matching backend models
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

export default function AddPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Metadata from backend
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatus[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)

  // Selected location states
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

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

    // Pricing
    price: '',
    currency: 'XAF',

    // For Rent specific
    initial_months_payable: '',
    caution_months: '',
    visit_fee: '',
    requires_contract_registration: false,

    // For Sale specific
    land_size_sqm: '',
    has_land_title: false,
    land_title_type: '',
    cadastral_id: '',
    other_documentation: '',

    // Land specific
    land_type: '',
    area_characteristics: '',

    // Warehouse specific
    warehouse_height: '',
    has_forklift: false,
    allows_truck_entry: false,
    has_inventory_manager: false,
    requires_goods_documentation: false,

    // Guest House specific
    price_per_day: '',
    price_negotiable: false,
    has_refundable_caution: false,

    // Agent Commission
    agent_commission_percentage: '',
    agent_commission_months: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [titleDocument, setTitleDocument] = useState<File | null>(null)

  useEffect(() => {
    fetchMetadata()
  }, [])

  const fetchMetadata = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')

      if (!token) {
        router.push('/sign-in')
        return
      }

      // Fetch all metadata in parallel
      const [typesRes, statusesRes, regionsRes] = await Promise.all([
        fetch('http://localhost:8000/api/properties/types/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/properties/statuses/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/locations/regions/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      // Check if all responses are OK
      if (!typesRes.ok || !statusesRes.ok || !regionsRes.ok) {
        console.error('API Error:', {
          types: typesRes.status,
          statuses: statusesRes.status,
          regions: regionsRes.status
        })

        // Check for authentication issues
        if (typesRes.status === 401 || statusesRes.status === 401 || regionsRes.status === 401) {
          setError('Session expired. Please sign in again.')
          setTimeout(() => router.push('/sign-in'), 2000)
          return
        }

        setError('Failed to load property metadata. Please refresh the page.')
        setLoading(false)
        return
      }

      // Only parse JSON if responses are OK
      const typesData = await typesRes.json()
      const statusesData = await statusesRes.json()
      const regionsData = await regionsRes.json()

      const types = typesData.results || typesData
      const statuses = statusesData.results || statusesData
      const regionsList = regionsData.results || regionsData

      setPropertyTypes(types)
      setPropertyStatuses(statuses)
      setRegions(regionsList)

      // Set default values
      if (types.length > 0) {
        setFormData(prev => ({ ...prev, property_type: types[0].id.toString() }))
      }
      if (statuses.length > 0) {
        const availableStatus = statuses.find((s: PropertyStatus) => s.name === 'available')
        if (availableStatus) {
          setFormData(prev => ({ ...prev, status: availableStatus.id.toString() }))
        } else {
          setFormData(prev => ({ ...prev, status: statuses[0].id.toString() }))
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching metadata:', err)
      setError('Failed to load form data. Please refresh.')
      setLoading(false)
    }
  }

  const handleRegionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value
    setSelectedRegion(regionId)
    setSelectedCity('')
    setFormData(prev => ({ ...prev, area: '' }))
    setCities([])
    setAreas([])

    if (regionId) {
      const token = localStorage.getItem('property237_access_token')
      try {
        const response = await fetch(`http://localhost:8000/api/locations/cities/?region=${regionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            setCities(data.results || data)
          } else {
            console.error('Received non-JSON response for cities')
          }
        } else {
          console.error('Failed to fetch cities:', response.status)
        }
      } catch (err) {
        console.error('Error fetching cities:', err)
      }
    }
  }

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    setSelectedCity(cityId)
    setFormData(prev => ({ ...prev, area: '' }))
    setAreas([])

    if (cityId) {
      const token = localStorage.getItem('property237_access_token')
      try {
        const response = await fetch(`http://localhost:8000/api/locations/areas/?city=${cityId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            setAreas(data.results || data)
          } else {
            console.error('Received non-JSON response for areas')
          }
        } else {
          console.error('Failed to fetch areas:', response.status)
        }
      } catch (err) {
        console.error('Error fetching areas:', err)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      // Keep as string for proper form submission, backend will handle conversion
      setFormData(prev => ({ ...prev, [name]: value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImages(prev => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTitleDocument(file)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateStep = () => {
    if (step === 1) {
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
    } else if (step === 2) {
      if (!formData.area) {
        setError('Location is required')
        return false
      }
    } else if (step === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Valid price is required')
        return false
      }
    }
    // Step 4 and 5 don't need validation before proceeding
    setError(null)
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('property237_access_token')
    if (!token) {
      router.push('/sign-in')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const formDataToSend = new FormData()

      // Append all form fields, excluding empty optional fields
      Object.entries(formData).forEach(([key, value]) => {
        // Include boolean false values and 0, but exclude empty strings
        if (value === false || value === 0 || (value !== '' && value !== null && value !== undefined)) {
          formDataToSend.append(key, value.toString())
        }
      })

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image, image.name)
      })

      // Append title document if provided
      if (titleDocument) {
        formDataToSend.append('title_document', titleDocument, titleDocument.name)
      }

      console.log('Submitting property...')

      const response = await fetch('http://localhost:8000/api/properties/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Success! Property created:', data)
        console.log('Property ID:', data.id)
        console.log('Property Slug:', data.slug)
        console.log('Images uploaded:', images.length)

        // Show detailed success message
        const imageText = images.length > 0 ? ` with ${images.length} image${images.length > 1 ? 's' : ''}` : ''
        alert(`✅ Property "${data.title}" has been successfully published${imageText}!\n\nIt is now visible to all users and can be found in your listings.`)

        // Redirect to my properties page
        router.push('/my-properties')
      } else {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.error('Error response:', data)

          // Better error message formatting
          let errorMsg = 'Failed to add property. '
          if (data.detail) {
            errorMsg += data.detail
          } else if (typeof data === 'object') {
            const errors = Object.entries(data)
              .map(([field, messages]) => {
                const msgArray = Array.isArray(messages) ? messages : [messages]
                return `${field}: ${msgArray.join(', ')}`
              })
              .join('; ')
            errorMsg += errors
          } else {
            errorMsg += 'Please check all fields and try again.'
          }
          setError(errorMsg)
        } else {
          // Non-JSON error response
          const text = await response.text()
          console.error('Non-JSON error response:', text)
          setError(`Server error (${response.status}): ${text.substring(0, 200)}`)
        }
      }
    } catch (err: any) {
      console.error('Error adding property:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      setError(`Network error: ${err.message || 'Please check your connection and try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Property
          </h1>
          <p className="text-gray-600">
            Complete all fields to list your property
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Location & Details</span>
            <span>Pricing & Terms</span>
            <span>Features & Utilities</span>
            <span>Images</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-md p-8">

            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1 of 5: Basic Information</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Property Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Modern 2-Bedroom Apartment in Douala"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Describe your property in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Property Type *</label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Listing Type *</label>
                    <select
                      name="listing_type"
                      value={formData.listing_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="guest_house">Guest House</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      {propertyStatuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location & Property Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 2 of 5: Location & Property Details</h2>

                {/* Cascading Location Dropdowns */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Location *</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Region</label>
                      <select
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">City</label>
                      <select
                        value={selectedCity}
                        onChange={handleCityChange}
                        required
                        disabled={!selectedRegion}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Neighborhood/Area</label>
                      <select
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        disabled={!selectedCity}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Area</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Distance from Main Road (m)</label>
                    <input
                      type="number"
                      name="distance_from_main_road"
                      value={formData.distance_from_main_road}
                      onChange={handleInputChange}
                      min="0"
                      max="50000"
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Vehicle Access</label>
                    <select
                      name="vehicle_access"
                      value={formData.vehicle_access}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      <option value="bike">Reachable by Bike</option>
                      <option value="low_car">Reachable by Low Car/Sedan</option>
                      <option value="suv">Reachable by SUV</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="road_is_tarred"
                    checked={formData.road_is_tarred}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-2 text-gray-700">Road is Tarred</label>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bedrooms</label>
                    <input
                      type="number"
                      name="no_of_bedrooms"
                      value={formData.no_of_bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bathrooms</label>
                    <input
                      type="number"
                      name="no_of_bathrooms"
                      value={formData.no_of_bathrooms}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Living Rooms</label>
                    <input
                      type="number"
                      name="no_of_living_rooms"
                      value={formData.no_of_living_rooms}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Kitchens</label>
                    <input
                      type="number"
                      name="no_of_kitchens"
                      value={formData.no_of_kitchens}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Kitchen Type</label>
                    <select
                      name="kitchen_type"
                      value={formData.kitchen_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      <option value="full_size">Full Size Kitchen</option>
                      <option value="partial">Partial/Corner Kitchen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Balconies</label>
                    <input
                      type="number"
                      name="no_of_balconies"
                      value={formData.no_of_balconies}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Floors</label>
                    <input
                      type="number"
                      name="no_of_floors"
                      value={formData.no_of_floors}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Floor Number (for apartments)</label>
                    <input
                      type="number"
                      name="floor_number"
                      value={formData.floor_number}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      placeholder="Which floor?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Room Size</label>
                    <input
                      type="text"
                      name="room_size"
                      value={formData.room_size}
                      onChange={handleInputChange}
                      placeholder="e.g., 3m x 4m"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_dressing_cupboard"
                    checked={formData.has_dressing_cupboard}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-2 text-gray-700">Has Dressing Cupboard</label>
                </div>
              </div>
            )}

            {/* STEP 3: Pricing & Terms */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 3 of 5: Pricing & Terms</h2>

                {/* Pricing Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Pricing *</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Price (XAF) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1000"
                        placeholder="150000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="XAF">XAF (CFA Franc)</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  {/* Rent-specific fields */}
                  {formData.listing_type === 'rent' && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Rental Terms</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm mb-2">Initial Months Payable</label>
                          <input
                            type="number"
                            name="initial_months_payable"
                            value={formData.initial_months_payable}
                            onChange={handleInputChange}
                            min="1"
                            max="24"
                            placeholder="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm mb-2">Caution (Months)</label>
                          <input
                            type="number"
                            name="caution_months"
                            value={formData.caution_months}
                            onChange={handleInputChange}
                            min="0"
                            max="12"
                            placeholder="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm mb-2">Visit Fee (XAF)</label>
                          <input
                            type="number"
                            name="visit_fee"
                            value={formData.visit_fee}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="5000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Features & Utilities */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 4 of 5: Features & Utilities</h2>

                {/* Utilities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Utilities</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Electricity Type</label>
                      <select
                        name="electricity_type"
                        value={formData.electricity_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select</option>
                        <option value="private_meter">Private Meter</option>
                        <option value="shared_meter">Shared Meter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Electricity Payment</label>
                      <select
                        name="electricity_payment"
                        value={formData.electricity_payment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select</option>
                        <option value="prepaid">Prepaid</option>
                        <option value="postpaid">Postpaid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Water Type</label>
                      <select
                        name="water_type"
                        value={formData.water_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select</option>
                        <option value="camwater">Camwater</option>
                        <option value="forage">Forage/Borehole</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities & Features</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'has_parking', label: 'In-Fence Parking' },
                      { key: 'has_security', label: 'Security' },
                      { key: 'has_ac_preinstalled', label: 'AC Pre-installed' },
                      { key: 'has_hot_water', label: 'Hot Water' },
                      { key: 'has_generator', label: 'Generator' },
                      { key: 'has_pool', label: 'Swimming Pool' },
                      { key: 'has_gym', label: 'Gym' },
                      { key: 'has_elevator', label: 'Elevator' },
                    ].map((amenity) => (
                      <label key={amenity.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={amenity.key}
                          checked={formData[amenity.key as keyof typeof formData] as boolean}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Agent Commission */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Agent Commission (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Commission Percentage (%)</label>
                      <input
                        type="number"
                        name="agent_commission_percentage"
                        value={formData.agent_commission_percentage}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Commission (Months of Rent)</label>
                      <input
                        type="number"
                        name="agent_commission_months"
                        value={formData.agent_commission_months}
                        onChange={handleInputChange}
                        min="0"
                        max="12"
                        placeholder="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Specify either percentage or months, not both</p>
                </div>

                {/* Sale-specific fields - keeping this for other property details */}
                {formData.listing_type === 'sale' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sale Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Land Size (sq m)</label>
                        <input
                          type="number"
                          name="land_size_sqm"
                          value={formData.land_size_sqm}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="500"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Land Title Type</label>
                        <select
                          name="land_title_type"
                          value={formData.land_title_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select</option>
                          <option value="global">Global Land Title</option>
                          <option value="extract">Personal/Extract Land Title</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Cadastral ID</label>
                        <input
                          type="text"
                          name="cadastral_id"
                          value={formData.cadastral_id}
                          onChange={handleInputChange}
                          placeholder="Official registry ID"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="flex items-center pt-8">
                        <input
                          type="checkbox"
                          name="has_land_title"
                          checked={formData.has_land_title}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label className="ml-2 text-gray-700">Has Land Title</label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 mb-2">Land Title Document</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      {titleDocument && (
                        <p className="text-sm text-green-600 mt-1">✓ {titleDocument.name}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 mb-2">Other Documentation</label>
                      <textarea
                        name="other_documentation"
                        value={formData.other_documentation}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="List other documents or notes"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}

                {/* Guest House specific */}
                {formData.listing_type === 'guest_house' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Guest House Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Price per Day (XAF)</label>
                        <input
                          type="number"
                          name="price_per_day"
                          value={formData.price_per_day}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="25000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="flex flex-col justify-center space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="price_negotiable"
                            checked={formData.price_negotiable}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">Price Negotiable</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="has_refundable_caution"
                            checked={formData.has_refundable_caution}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">Has Refundable Caution</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* STEP 5: Images */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 5 of 5: Property Images</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Upload Images</label>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload at least 3 high-quality images of your property
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-green-600 hover:text-green-700">
                          Click to upload images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Uploaded Images ({imagePreviews.length})
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}

              <div className="ml-auto">
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Publishing...' : '✅ Publish Property'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
