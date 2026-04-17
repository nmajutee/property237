import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { buildPropertyMetadata, buildPropertyStructuredData } from '@/lib/seo'
import { getPropertyBySlug } from '@/lib/server/properties'

type PropertyLayoutProps = {
  children: ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyBySlug(id)

  if (!property) {
    return {
      title: 'Property Not Found | Property237',
      description: 'The property listing you requested is no longer available.',
    }
  }

  return buildPropertyMetadata(property)
}

export default async function PropertyDetailLayout({ children, params }: PropertyLayoutProps) {
  const { id } = await params
  const property = await getPropertyBySlug(id)

  if (!property) {
    notFound()
  }

  return (
    <>
      <JsonLd data={buildPropertyStructuredData(property)} />
      {children}
    </>
  )
}