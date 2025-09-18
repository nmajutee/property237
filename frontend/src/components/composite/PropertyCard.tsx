'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../primitives/Icon'
import { Avatar } from '../primitives/Avatar'
import { PropertyListing, PropertyViewMode } from '../../types/property'
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Shield,
  Waves,
  Heart,
  Phone,
  Mail,
  Calendar,
  Eye,
  Verified,
  Share2,
  Image as ImageIcon,
  Star,
  Home
} from 'lucide-react'

export interface PropertyCardProps {
  property: PropertyListing
  viewMode?: PropertyViewMode
  showAgent?: boolean
  onFavorite?: (propertyId: string | number) => void
  onContact?: (propertyId: string | number) => void
  onShare?: (propertyId: string | number) => void
  onView?: (propertyId: string | number) => void
  isFavorited?: boolean
  className?: string
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  viewMode = 'grid',
  showAgent = true,
  onFavorite,
  onContact,
  onShare,
  onView,
  isFavorited = false,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(price) + ` ${currency}`
  }

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  // Get listing type label
  const getListingTypeLabel = (listingType: string) => {
    switch (listingType) {
      case 'rent': return 'For Rent'
      case 'sale': return 'For Sale'
      case 'guest_house': return 'Guest House'
      default: return listingType
    }
  }

  // Get listing type color
  const getListingTypeColor = (listingType: string) => {
    switch (listingType) {
      case 'rent': return 'bg-blue-100 text-blue-800'
      case 'sale': return 'bg-green-100 text-green-800'
      case 'guest_house': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle card click
  const handleCardClick = () => {
    if (onView) {
      onView(property.id)
    }
  }

  // Handle favorite click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onFavorite) {
      onFavorite(property.id)
    }
  }

  // Handle contact click
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onContact) {
      onContact(property.id)
    }
  }

  // Handle share click
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onShare) {
      onShare(property.id)
    }
  }

  // Base card styles
  const baseCardClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md
    transition-all duration-200 cursor-pointer group overflow-hidden
    ${className}
  `

  // Grid layout
  if (viewMode === 'grid') {
    return (
      <div className={baseCardClasses} onClick={handleCardClick}>
        {/* Property Image */}
        <div className="relative h-48 bg-gray-100">
          {!imageError ? (
            <img
              src={`/api/properties/${property.id}/image`}
              alt={property.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Icon icon={ImageIcon} className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Property Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getListingTypeColor(property.listing_type)}`}>
              {getListingTypeLabel(property.listing_type)}
            </span>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 right-12">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                <Icon icon={Star} className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3">
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-white/80 hover:bg-white"
              onClick={handleFavoriteClick}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-green-600">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.listing_type === 'rent' && (
                <span className="text-sm text-gray-500">/month</span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">
              {property.area.name}, {property.area.city.name}
            </span>
          </div>

          {/* Property Features */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            {property.no_of_bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.no_of_bedrooms}</span>
              </div>
            )}
            {property.no_of_bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.no_of_bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icon icon={Home} className="w-4 h-4" />
              <span className="text-xs">{property.property_type.name}</span>
            </div>
          </div>

          {/* Agent Info */}
          {showAgent && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Avatar
                  src={property.agent.profile_picture}
                  alt={`${property.agent.user.first_name} ${property.agent.user.last_name}`}
                  size="sm"
                  initials={property.agent.user.first_name[0] + property.agent.user.last_name[0]}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {property.agent.user.first_name} {property.agent.user.last_name}
                    </span>
                    {property.agent.is_verified && (
                      <Verified className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(property.created_at)}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={handleShareClick}
                  aria-label="Share property"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleContactClick}
                >
                  Contact
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // List layout
  return (
    <div className={`${baseCardClasses} flex`} onClick={handleCardClick}>
      {/* Property Image */}
      <div className="relative w-64 h-40 bg-gray-100 flex-shrink-0">
        {!imageError ? (
          <img
            src={`/api/properties/${property.id}/image`}
            alt={property.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Icon icon={ImageIcon} className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <Icon icon={Star} className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Header with status and favorite */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getListingTypeColor(property.listing_type)}`}>
                {getListingTypeLabel(property.listing_type)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleFavoriteClick}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          </div>

          {/* Title and Price */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-green-600">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.listing_type === 'rent' && (
              <span className="text-sm text-gray-500">/month</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {property.area.name}, {property.area.city.name}
            </span>
          </div>

          {/* Property Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {property.no_of_bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.no_of_bedrooms} bed{property.no_of_bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.no_of_bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.no_of_bathrooms} bath{property.no_of_bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icon icon={Home} className="w-4 h-4" />
              <span>{property.property_type.name}</span>
            </div>
          </div>
        </div>

        {/* Agent and Actions */}
        {showAgent && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={property.agent.profile_picture}
                alt={`${property.agent.user.first_name} ${property.agent.user.last_name}`}
                size="sm"
                initials={property.agent.user.first_name[0] + property.agent.user.last_name[0]}
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-900">
                    {property.agent.user.first_name} {property.agent.user.last_name}
                  </span>
                  {property.agent.is_verified && (
                    <Verified className="w-3 h-3 text-blue-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{formatDate(property.created_at)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={handleShareClick}
                aria-label="Share property"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleContactClick}
              >
                Contact Agent
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyCard