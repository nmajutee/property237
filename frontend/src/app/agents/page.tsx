'use client'

import { agentService } from '@/services/agentService'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function AgentsPage() {
  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentService.list(),
  })

  const agents = (agentsData as any)?.results || agentsData || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Real Estate Agents</h1>

        {isLoading ? (
          <p className="text-gray-500">Loading agents...</p>
        ) : agents.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            No verified agents found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(agents as any[]).map((agent: any) => (
              <div key={agent.id} className="bg-white rounded shadow p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                    {(agent.user?.full_name || agent.user?.email || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.user?.full_name || agent.user?.email}</h3>
                    {agent.agency_name && (
                      <p className="text-sm text-gray-500">{agent.agency_name}</p>
                    )}
                  </div>
                </div>

                {agent.specialization && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Specialization:</span> {agent.specialization}
                  </p>
                )}

                {agent.bio && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{agent.bio}</p>
                )}

                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span>⭐ {agent.client_rating || 'N/A'}</span>
                  <span>📝 {agent.total_reviews || 0} reviews</span>
                  <span>🏠 {agent.total_sales || 0} sales</span>
                </div>

                <div className="flex gap-2 text-xs">
                  {agent.is_verified && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✅ Verified</span>
                  )}
                  {agent.is_featured && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ Featured</span>
                  )}
                  {agent.years_experience && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{agent.years_experience} yrs exp</span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="flex-1 text-center bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/chat?agent=${agent.id}`}
                    className="flex-1 text-center border border-green-600 text-green-600 px-3 py-1.5 rounded text-sm hover:bg-green-50"
                  >
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
