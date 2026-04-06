'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/services/api'
import { useReports, useResolveReport, useDismissReport, useModerationLog, useDuplicates } from '@/hooks/useModeration'

type Tab = 'properties' | 'agents' | 'reports' | 'duplicates' | 'log'

export default function ModerationPage() {
  const [tab, setTab] = useState<Tab>('properties')
  const queryClient = useQueryClient()

  const { data: pendingProps, isLoading: propsLoading } = useQuery({
    queryKey: ['moderation-properties'],
    queryFn: () => apiClient.get('/properties/moderation/pending/'),
  })

  const { data: pendingAgents, isLoading: agentsLoading } = useQuery({
    queryKey: ['moderation-agents'],
    queryFn: () => apiClient.get('/agents/moderation/pending/'),
  })

  const approveProperty = useMutation({
    mutationFn: (id: number) => apiClient.post(`/properties/moderation/${id}/approve/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-properties'] }),
  })

  const rejectProperty = useMutation({
    mutationFn: (id: number) => apiClient.post(`/properties/moderation/${id}/reject/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-properties'] }),
  })

  const verifyAgent = useMutation({
    mutationFn: (id: number) => apiClient.post(`/agents/moderation/${id}/verify/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-agents'] }),
  })

  const rejectAgent = useMutation({
    mutationFn: (id: number) => apiClient.post(`/agents/moderation/${id}/reject/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-agents'] }),
  })

  const properties: any[] = (pendingProps as any) || []
  const agents: any[] = (pendingAgents as any) || []

  const { data: reportsData } = useReports('pending')
  const reports: any[] = (reportsData as any) || []
  const resolveReport = useResolveReport()
  const dismissReport = useDismissReport()
  const { data: logData } = useModerationLog()
  const logEntries: any[] = (logData as any)?.results || []
  const { data: dupsData } = useDuplicates()
  const duplicates: any[] = (dupsData as any)?.duplicates || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Moderation Dashboard</h1>
            <p className="text-sm text-gray-500">Review and approve pending content</p>
          </div>
          <Link href="/dashboard/admin" className="text-green-600 hover:underline text-sm">
            ← Back to Admin
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('properties')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'properties' ? 'bg-green-600 text-white' : 'bg-white border'
            }`}
          >
            Pending Properties ({properties.length})
          </button>
          <button
            onClick={() => setTab('agents')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'agents' ? 'bg-green-600 text-white' : 'bg-white border'
            }`}
          >
            Agent Verification ({agents.length})
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'reports' ? 'bg-green-600 text-white' : 'bg-white border'
            }`}
          >
            Reports ({reports.length})
          </button>
          <button
            onClick={() => setTab('duplicates')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'duplicates' ? 'bg-green-600 text-white' : 'bg-white border'
            }`}
          >
            Duplicates ({duplicates.length})
          </button>
          <button
            onClick={() => setTab('log')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'log' ? 'bg-green-600 text-white' : 'bg-white border'
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Pending Properties */}
        {tab === 'properties' && (
          <div className="space-y-4">
            {propsLoading ? (
              <p className="text-gray-500 p-8 text-center">Loading...</p>
            ) : properties.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                No properties pending review
              </div>
            ) : (
              properties.map((prop: any) => (
                <div key={prop.id} className="bg-white rounded shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      <div className="w-24 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {(prop.primary_image || prop.images?.[0]?.image_url) ? (
                          <img src={prop.primary_image || prop.images[0].image_url} alt={prop.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg">{prop.title}</h3>
                        <p className="text-sm text-gray-500">{prop.area?.name}, {prop.area?.city?.name}</p>
                        <p className="text-green-600 font-semibold">{parseInt(prop.price).toLocaleString()} {prop.currency || 'XAF'}</p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span>{prop.property_type?.name}</span>
                          {prop.no_of_bedrooms > 0 && <span>• {prop.no_of_bedrooms} bed</span>}
                          {prop.no_of_bathrooms > 0 && <span>• {prop.no_of_bathrooms} bath</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          By: {prop.agent?.user?.first_name} {prop.agent?.user?.last_name} • {new Date(prop.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveProperty.mutate(prop.id)}
                        disabled={approveProperty.isPending}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Reject and remove this property?')) {
                            rejectProperty.mutate(prop.id)
                          }
                        }}
                        disabled={rejectProperty.isPending}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <Link
                        href={`/properties/${prop.slug || prop.id}`}
                        className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Agent Verification */}
        {tab === 'agents' && (
          <div className="space-y-4">
            {agentsLoading ? (
              <p className="text-gray-500 p-8 text-center">Loading...</p>
            ) : agents.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                No agents pending verification
              </div>
            ) : (
              agents.map((agent: any) => (
                <div key={agent.id} className="bg-white rounded shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl flex-shrink-0">
                        {(agent.user?.full_name || agent.user?.first_name || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg">
                          {agent.user?.full_name || `${agent.user?.first_name} ${agent.user?.last_name}`}
                        </h3>
                        {agent.agency_name && <p className="text-sm text-gray-500">{agent.agency_name}</p>}
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          {agent.specialization && <span>Specialization: {agent.specialization}</span>}
                          {agent.years_experience && <span>Exp: {agent.years_experience} years</span>}
                          {agent.license_number && <span>License: {agent.license_number}</span>}
                        </div>
                        {agent.bio && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{agent.bio}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          Email: {agent.user?.email} • Phone: {agent.office_phone || agent.user?.phone_number || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => verifyAgent.mutate(agent.id)}
                        disabled={verifyAgent.isPending}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => rejectAgent.mutate(agent.id)}
                        disabled={rejectAgent.isPending}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <Link
                        href={`/agents/${agent.id}`}
                        className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reports */}
        {tab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                No pending reports
              </div>
            ) : (
              reports.map((report: any) => (
                <div key={report.id} className="bg-white rounded shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          report.report_type === 'fraud' || report.report_type === 'fake_agent'
                            ? 'bg-red-100 text-red-700'
                            : report.report_type === 'spam'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.report_type?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Target: {report.target_type} #{report.object_id}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{report.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Reported by {report.reporter_name} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => {
                          const resolution = prompt('Resolution action: no_action, warning_issued, content_removed, user_suspended, listing_removed, agent_unverified')
                          if (resolution) {
                            resolveReport.mutate({ id: report.id, data: { resolution } })
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => dismissReport.mutate({ id: report.id })}
                        className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Duplicates */}
        {tab === 'duplicates' && (
          <div className="space-y-4">
            {duplicates.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                No potential duplicates found
              </div>
            ) : (
              duplicates.map((dup: any, i: number) => (
                <div key={i} className="bg-white rounded shadow p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      {Math.round(dup.similarity_score * 100)}% match
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[dup.property_1, dup.property_2].map((p: any) => (
                      <div key={p.id} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{p.title}</h4>
                        <p className="text-xs text-gray-500">{p.area}</p>
                        <p className="text-green-600 text-sm font-semibold">{parseInt(p.price).toLocaleString()} XAF</p>
                        <Link href={`/properties/${p.slug}`} className="text-xs text-green-600 hover:underline">
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Audit Log */}
        {tab === 'log' && (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Moderator</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Target</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Reason</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logEntries.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No moderation actions recorded</td></tr>
                ) : (
                  logEntries.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          entry.action_type.includes('approved') || entry.action_type.includes('verified')
                            ? 'bg-green-100 text-green-700'
                            : entry.action_type.includes('rejected') || entry.action_type.includes('suspended') || entry.action_type.includes('removed')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.action_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">{entry.moderator_name}</td>
                      <td className="px-4 py-3 text-gray-500">{entry.target_type} #{entry.object_id}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{entry.reason || '—'}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
