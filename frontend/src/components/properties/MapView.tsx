'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, X, Star, User } from 'lucide-react'

// Fix Leaflet default icon issue with Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface PropertyAgent {
  id: number
  user: {
    id: number
    first_name: string
    last_name: string
    profile_picture?: string
  }
  average_rating?: number
  total_reviews?: number
  phone_number?: string
}

interface PropertyImage {
  id: number
  image_url: string
  is_primary: boolean
}

interface Property {
  id: number
  title: string
  slug: string
  price: string
  currency: string
  area: {
    name: string
    city: {
      name: string
    }
  }
  primary_image: string | null
  images: PropertyImage[]
  agent?: PropertyAgent
  no_of_bedrooms: number
  no_of_bathrooms: number
  property_type: {
    name: string
  }
}

interface MapViewProps {
  show: boolean
  height?: string
  properties?: Property[]
}

// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, [number, number]>()

// Known Cameroon city coordinates (fallback for common cities)
const cameroonCities: Record<string, [number, number]> = {
  'Douala': [4.0511, 9.7679],
  'Yaoundé': [3.8480, 11.5021],
  'Buea': [4.1560, 9.2323],
  'Bamenda': [5.9631, 10.1591],
  'Limbe': [4.0234, 9.1989],
  'Kribi': [2.9371, 9.9106],
  'Garoua': [9.3019, 13.3964],
  'Maroua': [10.5906, 14.3159],
  'Bafoussam': [5.4781, 10.4178],
  'Ngaoundéré': [7.3167, 13.5833],
}

// Geocode using Nominatim (OpenStreetMap)
async function geocodeAddress(city: string, area: string): Promise<[number, number] | null> {
  const address = `${area}, ${city}, Cameroon`

  // Check cache first
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address)!
  }

  // Check known cities for fallback
  if (cameroonCities[city]) {
    const coords = cameroonCities[city]
    geocodeCache.set(address, coords)
    return coords
  }

  try {
    // Rate limiting: wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Property237 Real Estate Platform'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        geocodeCache.set(address, coords)
        return coords
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }

  // Fallback to city center if available
  if (cameroonCities[city]) {
    return cameroonCities[city]
  }

  return null
}

export default function MapView({ show, height = 'h-96', properties = [] }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mounted, setMounted] = useState(false)
  const [propertyCoordinates, setPropertyCoordinates] = useState<Map<number, [number, number]>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Geocode all properties
  useEffect(() => {
    if (!mounted || properties.length === 0) {
      setLoading(false)
      return
    }

    async function geocodeProperties() {
      const coordsMap = new Map<number, [number, number]>()

      // Limit to first 20 properties to avoid rate limiting
      for (const property of properties.slice(0, 20)) {
        const coords = await geocodeAddress(property.area.city.name, property.area.name)
        if (coords) {
          coordsMap.set(property.id, coords)
        }
      }

      setPropertyCoordinates(coordsMap)
      setLoading(false)
    }

    geocodeProperties()
  }, [mounted, properties])

  useEffect(() => {
    if (!show || !mounted || loading || !mapRef.current || typeof window === 'undefined') return

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Default to Cameroon center (between Douala and Yaoundé)
      const defaultCenter: [number, number] = [4.0511, 9.7679]
      const defaultZoom = 8

      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        scrollWheelZoom: true,
      })

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add property markers
    if (properties.length > 0) {
      const bounds: [number, number][] = []

      properties.forEach(property => {
        const coords = propertyCoordinates.get(property.id)

        if (coords) {
          bounds.push(coords)

          // Create custom icon with price
          const priceIconHtml = `
            <div class="price-marker">
              <div class="price-tag">
                ${parseFloat(property.price).toLocaleString()} ${property.currency}
              </div>
              <div class="price-arrow"></div>
            </div>
          `

          const customIcon = L.divIcon({
            html: priceIconHtml,
            className: 'custom-price-marker',
            iconSize: [120, 40],
            iconAnchor: [60, 40],
          })

          const marker = L.marker(coords, { icon: customIcon })
            .addTo(mapInstanceRef.current!)

          // Handle marker click
          marker.on('click', () => {
            setSelectedProperty(property)
          })

          markersRef.current.push(marker)
        }
      })

      // Fit map to show all markers
      if (bounds.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
      }
    }

    return () => {
      // Cleanup markers only, not the map instance
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
    }
  }, [show, mounted, loading, properties, propertyCoordinates])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  if (!show || !mounted) return null

  if (loading) {
    return (
      <div className={`${height} bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center`}>
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-property237-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading property locations...</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Geocoding addresses...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <style jsx global>{`
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }

        .price-marker {
          position: relative;
          cursor: pointer;
        }

        .price-tag {
          background: #DC2626;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .price-marker:hover .price-tag {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .price-arrow {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #DC2626;
          margin: 0 auto;
        }

        .leaflet-container {
          font-family: inherit;
        }
      `}</style>

      <div ref={mapRef} className={`${height} w-full rounded-lg overflow-hidden`} />

      {/* Property Card Popup */}
      {selectedProperty && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[1000] overflow-hidden">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-3 right-3 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Property Image */}
          <div className="relative h-48">
            <img
              src={selectedProperty.primary_image || selectedProperty.images[0]?.image_url || '/placeholder-property.jpg'}
              alt={selectedProperty.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Details */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 pr-8">
              {selectedProperty.title}
            </h3>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="h-4 w-4 mr-1 text-gray-900 dark:text-gray-100" />
              <span>{selectedProperty.area.city.name}, {selectedProperty.area.name}</span>
            </div>

            {/* Property Stats */}
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <span>{selectedProperty.no_of_bedrooms} bed</span>
              <span>•</span>
              <span>{selectedProperty.no_of_bathrooms} bath</span>
              <span>•</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {selectedProperty.property_type.name}
              </span>
            </div>

            {/* Agent Info */}
            {selectedProperty.agent && (
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0">
                  {selectedProperty.agent.user.profile_picture ? (
                    <img
                      src={selectedProperty.agent.user.profile_picture}
                      alt={`${selectedProperty.agent.user.first_name} ${selectedProperty.agent.user.last_name}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {selectedProperty.agent.user.first_name} {selectedProperty.agent.user.last_name}
                  </p>
                  {selectedProperty.agent.average_rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {selectedProperty.agent.average_rating.toFixed(1)}
                        {selectedProperty.agent.total_reviews !== undefined && (
                          <span className="ml-1">({selectedProperty.agent.total_reviews})</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-property237-primary">
                  {parseFloat(selectedProperty.price).toLocaleString()} {selectedProperty.currency}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">per month</p>
              </div>
              <a
                href={`/properties/${selectedProperty.slug}`}
                className="px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-dark transition-colors text-sm font-medium"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      {propertyCoordinates.size > 0 && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] text-xs">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-property237-primary" />
            <span className="text-gray-700 dark:text-gray-300">
              {propertyCoordinates.size} {propertyCoordinates.size === 1 ? 'Property' : 'Properties'}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-[10px]">
            Click markers for details
          </p>
        </div>
      )}

      {/* No Properties Message */}
      {propertyCoordinates.size === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No properties to display on map
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Unable to geocode property addresses
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
