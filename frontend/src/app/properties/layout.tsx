import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Browse Properties in Cameroon',
  description:
    'Search verified apartments, houses, and commercial properties across Cameroon with filters for price, location, and amenities.',
  alternates: {
    canonical: absoluteUrl('/properties'),
  },
  openGraph: {
    title: 'Browse Properties in Cameroon | Property237',
    description:
      'Explore verified property listings across Cameroon with fast filters, maps, and agent contact options.',
    url: absoluteUrl('/properties'),
    type: 'website',
  },
}

export default function PropertiesLayout({ children }: { children: ReactNode }) {
  return children
}