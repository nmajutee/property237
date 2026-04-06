'use client'

import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adService } from '@/services/tariffService'
import Link from 'next/link'

interface PromotedCardsProps {
  type?: string
  limit?: number
}

export function PromotedPropertyCards({ type = 'featured', limit = 4 }: PromotedCardsProps) {
  const { data } = useQuery({
    queryKey: ['promoted-properties', type],
    queryFn: () => adService.getPromotedProperties(type),
    staleTime: 60_000,
  })

  const items = ((data as any)?.results || data || []) as any[]
  if (!items.length) return null

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        {type === 'featured' ? 'Featured Properties' : type === 'hot_deal' ? 'Hot Deals' : 'Promoted'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, limit).map((item: any) => {
          const prop = item.property_listing || item
          return (
            <Link
              key={item.id}
              href={`/properties/${prop.slug || prop.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-400/50"
            >
              <div className="relative">
                <div className="h-40 bg-gray-200 dark:bg-gray-700">
                  {prop.cover_image && (
                    <img src={prop.cover_image} alt={prop.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white"
                  style={{ backgroundColor: item.highlight_color || '#FF6B35' }}
                >
                  {item.badge_text || item.promotion_type?.replace('_', ' ').toUpperCase() || 'PROMOTED'}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{prop.title}</h3>
                <p className="text-green-600 font-bold text-sm mt-1">
                  {Number(prop.price).toLocaleString()} XAF
                </p>
                {prop.area_name && (
                  <p className="text-xs text-gray-500 mt-1">{prop.area_name}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

interface AdBannerProps {
  placement?: string
  className?: string
}

export function AdBanner({ placement = 'sidebar', className = '' }: AdBannerProps) {
  const trackedRef = useRef<Set<number>>(new Set())

  const { data } = useQuery({
    queryKey: ['ad-banners', placement],
    queryFn: () => adService.getActiveBanners(placement),
    staleTime: 60_000,
  })

  const banners = ((data as any)?.results || data || []) as any[]
  const banner = banners[0]

  useEffect(() => {
    if (banner && !trackedRef.current.has(banner.id)) {
      trackedRef.current.add(banner.id)
      adService.recordImpression(banner.id).catch(() => {})
    }
  }, [banner])

  if (!banner) return null

  const handleClick = () => {
    adService.recordClick(banner.id).catch(() => {})
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <a
        href={banner.target_url || '#'}
        target={banner.target_url ? '_blank' : undefined}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        {banner.image_url ? (
          <img src={banner.image_url} alt={banner.title || 'Ad'} className="w-full h-auto" />
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white text-center">
            <p className="font-bold text-sm">{banner.title || 'Advertisement'}</p>
            {banner.description && <p className="text-xs mt-1 opacity-90">{banner.description}</p>}
          </div>
        )}
      </a>
      <p className="text-[10px] text-gray-400 text-center mt-0.5">Ad</p>
    </div>
  )
}
