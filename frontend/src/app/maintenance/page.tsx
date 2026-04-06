'use client'

import { useState } from 'react'
import { maintenanceService } from '@/services/maintenanceService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function MaintenancePage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  })
  const queryClient = useQueryClient()

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: () => maintenanceService.list(),
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['maintenance-categories'],
    queryFn: () => maintenanceService.getCategories(),
  })

  const createRequest = useMutation({
    mutationFn: (data: any) => maintenanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] })
      setShowForm(false)
      setForm({ title: '', description: '', priority: 'medium', category: '' })
    },
  })

  const requests = (requestsData as any)?.results || requestsData || []
  const categories = (categoriesData as any)?.results || categoriesData || []

  const getPriorityColor = (p: string) => {
    const colors: Record<string, string> = {
      emergency: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    }
    return colors[p] || 'bg-gray-100'
  }

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
    }
    return colors[s] || 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Requests</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Request
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Submit Maintenance Request</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="emergency">Emergency</option>
                </select>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {(categories as any[]).map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => createRequest.mutate(form)}
                disabled={createRequest.isPending || !form.title}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            No maintenance requests
          </div>
        ) : (
          <div className="space-y-3">
            {(requests as any[]).map((req: any) => (
              <div key={req.id} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{req.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(req.status)}`}>
                        {req.status?.replace('_', ' ')}
                      </span>
                      {req.category_name && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-100">{req.category_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{new Date(req.created_at).toLocaleDateString()}</p>
                    {req.assigned_to && <p className="mt-1">Assigned: {req.assigned_to}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
