'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, X, Star, User } from 'lucide-react'

// Leaflet will be dynamically imported in useEffect to avoid SSR issues

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
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
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

    // Dynamically import Leaflet to avoid SSR issues
    let isMounted = true

    async function initializeMap() {
      const L = (await import('leaflet')).default

      if (!isMounted || !mapRef.current) return

      // Fix Leaflet default icon issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Initialize map only once
      if (!mapInstanceRef.current) {
        // Default to Cameroon center (between Douala and Yaoundé)
        const defaultCenter: [number, number] = [4.0511, 9.7679]
        const defaultZoom = 8

        const map = L.map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          scrollWheelZoom: true,
          zoomControl: true,
        })

        // Add professional CartoDB Positron tiles (clean, minimal, business-focused)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
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

            // Create professional custom icon with price
            const formattedPrice = parseFloat(property.price).toLocaleString()
            const priceIconHtml = `
              <div class="property-marker">
                <div class="marker-pin">
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#2563EB"/>
                    <circle cx="16" cy="15" r="6" fill="white"/>
                    <path d="M19 13h-2v-2c0-.55-.45-1-1-1s-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1z" fill="#2563EB"/>
                  </svg>
                </div>
                <div class="price-badge">
                  <span class="price-amount">${formattedPrice}</span>
                  <span class="price-currency">${property.currency}</span>
                </div>
              </div>
            `

            const customIcon = L.divIcon({
              html: priceIconHtml,
              className: 'property-map-marker',
              iconSize: [32, 40],
              iconAnchor: [16, 40],
              popupAnchor: [0, -40],
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
    }

    initializeMap()

    return () => {
      isMounted = false
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
        /* Professional map marker styling */
        .property-map-marker {
          background: transparent !important;
          border: none !important;
        }

        .property-marker {
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
        }

        .property-marker:hover {
          transform: translateY(-4px);
          filter: drop-shadow(0 8px 16px rgba(30, 64, 175, 0.3));
        }

        .marker-pin {
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .property-marker:hover .marker-pin {
          transform: scale(1.1);
        }

        .price-badge {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%);
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          border: 2px solid white;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .property-marker:hover .price-badge {
          transform: translateX(-50%) scale(1.05);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
        }

        .price-amount {
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .price-currency {
          font-size: 9px;
          opacity: 0.9;
          font-weight: 600;
        }

        /* Leaflet map container styling */
        .leaflet-container {
          background: #F3F4F6 !important;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* Custom zoom control styling */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .leaflet-control-zoom a {
          background: white !important;
          color: #2563EB !important;
          border: none !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-control-zoom a:hover {
          background: #2563EB !important;
          color: white !important;
        }

        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9) !important;
          padding: 4px 8px !important;
          font-size: 10px !important;
          border-radius: 4px !important;
        }

        .leaflet-control-attribution a {
          color: #2563EB !important;
          font-weight: 600 !important;
        }

      `}</style>

      <div className="relative">
        <div ref={mapRef} className={`${height} w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg`} />

        {/* Map Info Badge */}
        {!loading && properties.length > 0 && (
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[500]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-property237-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {propertyCoordinates.size} {propertyCoordinates.size === 1 ? 'Property' : 'Properties'} on map
              </span>
            </div>
          </div>
        )}
      </div>

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
