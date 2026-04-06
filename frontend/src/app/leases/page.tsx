'use client'

import { useState } from 'react'
import Link from 'next/link'
import { leaseService } from '@/services/leaseService'
import { useQuery } from '@tanstack/react-query'

export default function LeasesPage() {
  const [tab, setTab] = useState<'leases' | 'schedule'>('leases')

  const { data: leasesData, isLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: () => leaseService.list(),
  })
  const { data: scheduleData } = useQuery({
    queryKey: ['rent-schedule'],
    queryFn: () => leaseService.getRentSchedule(),
  })

  const leases = (leasesData as any)?.results || leasesData || []
  const schedule = (scheduleData as any)?.results || scheduleData || []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-700 bg-green-100',
      pending: 'text-yellow-700 bg-yellow-100',
      expired: 'text-red-700 bg-red-100',
      terminated: 'text-gray-700 bg-gray-100',
      draft: 'text-blue-700 bg-blue-100',
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Lease Management</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('leases')}
            className={`px-4 py-2 rounded text-sm ${tab === 'leases' ? 'bg-green-600 text-white' : 'bg-white border'}`}
          >
            My Leases
          </button>
          <button
            onClick={() => setTab('schedule')}
            className={`px-4 py-2 rounded text-sm ${tab === 'schedule' ? 'bg-green-600 text-white' : 'bg-white border'}`}
          >
            Rent Schedule
          </button>
        </div>

        {tab === 'leases' && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : leases.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                No leases found
              </div>
            ) : (
              (leases as any[]).map((lease: any) => (
                <div key={lease.id} className="bg-white rounded shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{lease.property_title || `Lease #${lease.id}`}</h3>
                      <p className="text-sm text-gray-500">
                        {lease.start_date} → {lease.end_date}
                      </p>
                      <p className="text-sm mt-1">
                        Monthly Rent: <span className="font-medium">{lease.monthly_rent} {lease.currency || 'XAF'}</span>
                      </p>
                      {lease.security_deposit && (
                        <p className="text-sm">Deposit: {lease.security_deposit} {lease.currency || 'XAF'}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lease.status)}`}>
                        {lease.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Lease Type: {lease.lease_type?.replace('_', ' ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {lease.terms_summary && (
                    <p className="text-sm text-gray-600 mt-2 border-t pt-2">{lease.terms_summary}</p>
                  )}
                  <div className="mt-2 pt-2 border-t">
                    <Link href={`/leases/${lease.id}`} className="text-green-600 hover:underline text-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'schedule' && (
          <div className="bg-white rounded shadow">
            {schedule.length === 0 ? (
              <p className="p-8 text-center text-gray-500">No rent schedule entries</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left bg-gray-50">
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(schedule as any[]).map((entry: any) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-3">{entry.due_date}</td>
                      <td className="p-3 font-medium">{entry.amount} XAF</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          entry.is_paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {entry.is_paid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{entry.paid_date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
