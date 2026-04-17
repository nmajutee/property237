import type { MetadataRoute } from 'next'

import { listPropertySitemapEntries } from '@/lib/server/properties'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/properties'),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: absoluteUrl('/agents'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/pricing'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/about'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/contact'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/help'),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: absoluteUrl('/terms'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const propertyRoutes = (await listPropertySitemapEntries()).map((property) => ({
    url: absoluteUrl(`/properties/${property.slug}`),
    lastModified: property.updated_at || property.created_at,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...propertyRoutes]
}