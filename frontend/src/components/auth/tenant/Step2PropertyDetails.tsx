'use client'

import React from 'react'
import { useTenantForm } from './TenantFormContext'
import { Button } from '../../ui/Button'

// Property types based on Cameroon real estate database
const propertyCategories = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' }
]

const residentialSubtypes = [
  { value: 'chambre_modern', label: 'Chambre Modern/Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'villa_duplex', label: 'Villa/Duplex' },
  { value: 'guest_house', label: 'Guest House' }
]

const commercialSubtypes = [
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop/Store' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'industrial', label: 'Industrial Space' }
]

// Land subtypes (grouped from database land_plot and commercial_land)
const landSubtypes = [
  { value: 'land_plot', label: 'Residential Land Plot' },
  { value: 'commercial_land', label: 'Commercial Land' }
]

// Specific land types from database
const landTypes = [
  { value: 'family_land', label: 'Family Land' },
  { value: 'private_land', label: 'Private Land' },
  { value: 'community_land', label: 'Community Land' },
  { value: 'reclaimed_land', label: 'Reclaimed Land' }
]

// Cameroon regions for location preferences
const cameroonRegions = [
  { value: 'centre', label: 'Centre' },
  { value: 'littoral', label: 'Littoral' },
  { value: 'northwest', label: 'Northwest' },
  { value: 'southwest', label: 'Southwest' },
  { value: 'west', label: 'West' },
  { value: 'adamawa', label: 'Adamawa' },
  { value: 'east', label: 'East' },
  { value: 'far_north', label: 'Far North' },
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' }
]

// Category-specific amenities based on Cameroon real estate context
const residentialAmenities = [
  { value: 'has_parking', label: 'In-fence Parking' },
  { value: 'has_ac_preinstalled', label: 'AC Pre-installed' },
  { value: 'has_hot_water', label: 'Hot Water' },
  { value: 'has_generator', label: 'Generator' },
  { value: 'has_security', label: 'Security Guard' },
  { value: 'electricity_private_meter', label: 'Private Electricity Meter' },
  { value: 'water_camwater', label: 'Camwater Connection' },
  { value: 'water_forage', label: 'Forage/Borehole' },
  { value: 'road_tarred', label: 'Tarred Road Access' },
  { value: 'has_balcony', label: 'Balcony/Terrace' },
  { value: 'furnished', label: 'Furnished' }
]

const commercialAmenities = [
  { value: 'has_parking', label: 'Customer Parking' },
  { value: 'has_security', label: 'Security System' },
  { value: 'electricity_private_meter', label: 'Private Electricity Meter' },
  { value: 'water_camwater', label: 'Camwater Connection' },
  { value: 'road_tarred', label: 'Tarred Road Access' },
  { value: 'has_generator', label: 'Backup Generator' },
  { value: 'loading_bay', label: 'Loading Bay' },
  { value: 'office_space', label: 'Office Space Included' },
  { value: 'high_ceiling', label: 'High Ceiling' }
]

const landAmenities = [
  { value: 'road_tarred', label: 'Tarred Road Access' },
  { value: 'electricity_nearby', label: 'Electricity Line Nearby' },
  { value: 'water_source_nearby', label: 'Water Source Nearby' },
  { value: 'has_land_title', label: 'Land Title Available' },
  { value: 'surveyed_plot', label: 'Surveyed Plot' },
  { value: 'flat_terrain', label: 'Flat Terrain' },
  { value: 'corner_plot', label: 'Corner Plot' },
  { value: 'gated_community', label: 'Within Gated Community' }
]

export const Step2PropertyDetails: React.FC = () => {
  const { state, updatePropertyDetails } = useTenantForm()
  const d = state.propertyDetails

  const setField = <K extends keyof typeof d>(field: K, value: (typeof d)[K]) => {
    updatePropertyDetails({ [field]: value })
  }

  const toggleAmenity = (amenity: string) => {
    const set = new Set(d.amenities)
    if (set.has(amenity)) {
      set.delete(amenity)
    } else {
      set.add(amenity)
    }
    setField('amenities', Array.from(set))
  }

  const getSubtypes = () => {
    if (d.property_category === 'residential') return residentialSubtypes
    if (d.property_category === 'commercial') return commercialSubtypes
    if (d.property_category === 'land') return landSubtypes
    return []
  }

  const getAmenitiesForCategory = () => {
    if (d.property_category === 'residential') return residentialAmenities
    if (d.property_category === 'commercial') return commercialAmenities
    if (d.property_category === 'land') return landAmenities
    return []
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h2 font-display">Property Preferences</h2>
        <p className="text-body font-display">Help us find the perfect property in Cameroon for you.</p>
      </div>

      {/* Preferred Region */}
      <div>
        <label className="block text-sm font-bold text-black dark:text-white mb-3 font-display">Preferred Region</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cameroonRegions.map((region) => (
            <Button
              key={region.value}
              variant={d.preferred_location === region.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setField('preferred_location', region.value)}
              className="text-sm justify-start"
            >
              {region.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-2 font-display">
            Budget Min (XAF)
          </label>
          <input
            type="number"
            value={d.budget_min}
            onChange={(e) => setField('budget_min', Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-property237-primary font-display"
            min={0}
            step={50000}
            placeholder="e.g., 50,000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-2 font-display">
            Budget Max (XAF)
          </label>
          <input
            type="number"
            value={d.budget_max}
            onChange={(e) => setField('budget_max', Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-property237-primary font-display"
            min={d.budget_min}
            step={50000}
            placeholder="e.g., 500,000"
          />
        </div>
      </div>

      {/* Property Category */}
      <div>
        <label className="block text-sm font-bold text-black dark:text-white mb-3 font-display">Property Category</label>
        <div className="grid grid-cols-2 gap-3">
          {propertyCategories.map((category) => (
            <Button
              key={category.value}
              variant={d.property_category === category.value ? 'default' : 'outline'}
              size="default"
              onClick={() => {
                setField('property_category', category.value)
                setField('property_type', '') // Reset subtype when category changes
                setField('land_type', '') // Reset land type when category changes
                setField('amenities', []) // Clear amenities when category changes
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Property Subtype - Only show if category is selected */}
      {d.property_category && (
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-3 font-display">
            {d.property_category === 'residential' && 'Residential Type'}
            {d.property_category === 'commercial' && 'Commercial Type'}
            {d.property_category === 'land' && 'Land Type'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getSubtypes().map((subtype) => (
              <Button
                key={subtype.value}
                variant={d.property_type === subtype.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setField('property_type', subtype.value)}
                className="text-sm"
              >
                {subtype.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Land Specific Types - Only show if land category and subtype is selected */}
      {d.property_category === 'land' && d.property_type && (
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-3 font-display">
            Land Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {landTypes.map((landType) => (
              <Button
                key={landType.value}
                variant={d.land_type === landType.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setField('land_type', landType.value)}
                className="text-sm"
              >
                {landType.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Category-Specific Amenities - Only show when category is selected */}
      {d.property_category && (
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-3 font-display">
            Desired Features & Amenities
            {d.property_category === 'land' && ' (Land Features)'}
            {d.property_category === 'commercial' && ' (Business Features)'}
            {d.property_category === 'residential' && ' (Living Features)'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getAmenitiesForCategory().map((amenity) => (
              <label key={amenity.value} className="inline-flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer font-display">
                <input
                  type="checkbox"
                  checked={d.amenities.includes(amenity.value)}
                  onChange={() => toggleAmenity(amenity.value)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-property237-primary focus:ring-property237-primary"
                />
                <span className="text-sm text-black dark:text-white font-medium">
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Step2PropertyDetails
