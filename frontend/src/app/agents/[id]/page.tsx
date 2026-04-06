'use client'

import { agentService } from '@/services/agentService'
import { propertyService } from '@/services/propertyService'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => agentService.getPublicEnhanced(agentId),
    enabled: !!agentId,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['agent-reviews', agentId],
    queryFn: () => agentService.getReviews(agentId),
    enabled: !!agentId,
  })

  const { data: listingsData } = useQuery({
    queryKey: ['agent-listings', agentId],
    queryFn: () => propertyService.list({ agent: agentId }),
    enabled: !!agentId,
  })

  const agentData = agent as any
  const reviews = (reviewsData as any)?.results || reviewsData || []
  const agentListings = (listingsData as any)?.results || listingsData || []

  if (isLoading) return <div className="p-8 text-gray-500">Loading agent profile...</div>
  if (!agentData) return <div className="p-8 text-gray-500">Agent not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Link href="/agents" className="text-green-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Agents
        </Link>

        <div className="bg-white rounded shadow p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl">
              {(agentData.user?.full_name || '?')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agentData.user?.full_name}</h1>
              {agentData.agency_name && <p className="text-gray-500">{agentData.agency_name}</p>}
              <div className="flex gap-2 mt-1">
                {agentData.is_verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>}
                {agentData.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Featured</span>}
              </div>
            </div>
          </div>

          {agentData.bio && <p className="text-gray-600 mb-4">{agentData.bio}</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t pt-4">
            <div>
              <p className="text-2xl font-bold">{agentData.client_rating || 'N/A'}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{agentData.total_reviews || 0}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{agentData.total_sales || 0}</p>
              <p className="text-xs text-gray-500">Sales</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{agentData.total_rentals || 0}</p>
              <p className="text-xs text-gray-500">Rentals</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="font-semibold mb-3">Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {agentData.specialization && <div><span className="text-gray-500">Specialization:</span> {agentData.specialization}</div>}
            {agentData.years_experience && <div><span className="text-gray-500">Experience:</span> {agentData.years_experience} years</div>}
            {agentData.license_number && <div><span className="text-gray-500">License:</span> {agentData.license_number}</div>}
            {agentData.languages_spoken && <div><span className="text-gray-500">Languages:</span> {agentData.languages_spoken}</div>}
            {agentData.office_phone && <div><span className="text-gray-500">Phone:</span> {agentData.office_phone}</div>}
            {agentData.website && <div><span className="text-gray-500">Website:</span> <a href={agentData.website} className="text-blue-600">{agentData.website}</a></div>}
          </div>
        </div>

        {/* Listings */}
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="font-semibold mb-3">Properties ({agentListings.length})</h2>
          {agentListings.length === 0 ? (
            <p className="text-gray-500">No properties listed</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(agentListings as any[]).map((prop: any) => (
                <Link key={prop.id} href={`/properties/${prop.id}`} className="border rounded p-3 hover:shadow transition-shadow flex gap-3">
                  <div className="w-24 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {(prop.primary_image || prop.images?.[0]?.image_url) ? (
                      <img src={prop.primary_image || prop.images[0].image_url} alt={prop.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{prop.title}</p>
                    <p className="text-xs text-gray-500">{prop.area?.name}, {prop.area?.city?.name}</p>
                    <p className="text-green-600 font-semibold text-sm mt-1">{parseInt(prop.price).toLocaleString()} {prop.currency || 'XAF'}</p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      {prop.no_of_bedrooms > 0 && <span>{prop.no_of_bedrooms} bed</span>}
                      {prop.no_of_bathrooms > 0 && <span>{prop.no_of_bathrooms} bath</span>}
                      <span className={`px-1 rounded ${prop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {prop.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {(reviews as any[]).map((review: any) => (
                <div key={review.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{review.reviewer?.full_name || 'Anonymous'}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating || 0)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            href={`/chat?agent=${agentId}`}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 inline-block"
          >
            Contact Agent
          </Link>
        </div>
      </div>
    </div>
  )
}
