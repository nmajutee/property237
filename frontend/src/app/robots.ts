import type { MetadataRoute } from 'next'

import { absoluteUrl, getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/properties', '/agents'],
      disallow: ['/api/', '/dashboard/', '/admin/', '/chat/', '/settings/', '/profile/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  }
}