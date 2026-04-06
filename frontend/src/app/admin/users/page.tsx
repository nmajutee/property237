'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/services/api'

export default function UserManagementPage() {
  const [search, setSearch] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, userTypeFilter, activeFilter, page],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (userTypeFilter) params.append('user_type', userTypeFilter)
      if (activeFilter) params.append('is_active', activeFilter)
      params.append('page', page.toString())
      return apiClient.get(`/users/admin/list/?${params.toString()}`)
    },
  })

  const toggleStatus = useMutation({
    mutationFn: (userId: number) => apiClient.post(`/users/admin/${userId}/toggle-status/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const users = (data as any)?.results || []
  const totalCount = (data as any)?.count || 0
  const totalPages = (data as any)?.pages || 1

  const getUserTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tenant: 'bg-blue-100 text-blue-700',
      agent: 'bg-green-100 text-green-700',
      admin: 'bg-purple-100 text-purple-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-gray-500">{totalCount} total users</p>
          </div>
          <Link href="/dashboard/admin" className="text-green-600 hover:underline text-sm">
            ← Back to Admin
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded shadow p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 mb-1 block">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">User Type</label>
            <select
              value={userTypeFilter}
              onChange={(e) => { setUserTypeFilter(e.target.value); setPage(1) }}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="tenant">Tenant</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setPage(1) }}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          {isLoading ? (
            <p className="p-8 text-center text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No users found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users as any[]).map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3 text-gray-600">{user.phone_number || '-'}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${getUserTypeColor(user.user_type)}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          if (confirm(`${user.is_active ? 'Deactivate' : 'Activate'} ${user.first_name} ${user.last_name}?`)) {
                            toggleStatus.mutate(user.id)
                          }
                        }}
                        disabled={toggleStatus.isPending}
                        className={`text-xs px-2 py-1 rounded ${
                          user.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        } disabled:opacity-50`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages} ({totalCount} users)
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
