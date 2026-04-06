'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLease } from '@/hooks/useLeases'

export default function LeaseDetailPage() {
  const params = useParams()
  const leaseId = params.id as string
  const { data, isLoading, error } = useLease(leaseId)
  const lease = data as any

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading lease...</div>
  if (error || !lease) return <div className="p-8 text-center text-gray-500">Lease not found</div>

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      terminated: 'bg-gray-100 text-gray-600',
      draft: 'bg-blue-100 text-blue-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Link href="/leases" className="text-green-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Leases
        </Link>

        {/* Header */}
        <div className="bg-white rounded shadow p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Lease Agreement</h1>
              {lease.lease_number && <p className="text-gray-500">#{lease.lease_number}</p>}
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(lease.status)}`}>
              {lease.status}
            </span>
          </div>
        </div>

        {/* Property & Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Property</h2>
            <div className="text-sm space-y-2">
              <p><span className="text-gray-500">Property:</span> {lease.property?.title || lease.property_name || 'N/A'}</p>
              <p><span className="text-gray-500">Address:</span> {lease.property?.address || lease.address || 'N/A'}</p>
              {lease.property?.id && (
                <Link href={`/properties/${lease.property.id}`} className="text-green-600 hover:underline text-sm">
                  View Property →
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Parties</h2>
            <div className="text-sm space-y-2">
              <p><span className="text-gray-500">Landlord/Agent:</span> {lease.landlord?.full_name || lease.agent?.user?.full_name || 'N/A'}</p>
              <p><span className="text-gray-500">Tenant:</span> {lease.tenant?.full_name || lease.tenant_name || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="font-semibold mb-3">Lease Terms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">{lease.lease_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Monthly Rent</p>
              <p className="font-medium text-green-600">{lease.monthly_rent ? `${parseInt(lease.monthly_rent).toLocaleString()} XAF` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Security Deposit</p>
              <p className="font-medium">{lease.security_deposit ? `${parseInt(lease.security_deposit).toLocaleString()} XAF` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Day</p>
              <p className="font-medium">{lease.payment_day ? `${lease.payment_day}th of month` : 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-medium">{lease.start_date ? new Date(lease.start_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-medium">{lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">{lease.duration_months ? `${lease.duration_months} months` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Auto-Renew</p>
              <p className="font-medium">{lease.auto_renew ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Signature Status */}
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="font-semibold mb-3">Signatures</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">Landlord</p>
              {lease.landlord_signed || lease.landlord_signature ? (
                <div>
                  <span className="text-green-600 text-lg">✅</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Signed {lease.landlord_signed_at ? new Date(lease.landlord_signed_at).toLocaleDateString() : ''}
                  </p>
                </div>
              ) : (
                <span className="text-yellow-600">⏳ Pending</span>
              )}
            </div>
            <div className="border rounded p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">Tenant</p>
              {lease.tenant_signed || lease.tenant_signature ? (
                <div>
                  <span className="text-green-600 text-lg">✅</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Signed {lease.tenant_signed_at ? new Date(lease.tenant_signed_at).toLocaleDateString() : ''}
                  </p>
                </div>
              ) : (
                <span className="text-yellow-600">⏳ Pending</span>
              )}
            </div>
          </div>
        </div>

        {/* Special Terms / Notes */}
        {(lease.special_terms || lease.notes || lease.terms_conditions) && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-semibold mb-3">Special Terms & Conditions</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {lease.special_terms || lease.terms_conditions || lease.notes}
            </p>
          </div>
        )}

        {/* Documents */}
        {lease.documents && lease.documents.length > 0 && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-semibold mb-3">Documents</h2>
            <div className="space-y-2">
              {(lease.documents as any[]).map((doc: any, idx: number) => (
                <a
                  key={idx}
                  href={doc.file_url || doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline border rounded p-2"
                >
                  📄 {doc.title || doc.name || `Document ${idx + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Created / Updated */}
        <div className="text-xs text-gray-400 text-center mt-4">
          Created: {lease.created_at ? new Date(lease.created_at).toLocaleDateString() : 'N/A'}
          {lease.updated_at && ` • Updated: ${new Date(lease.updated_at).toLocaleDateString()}`}
        </div>
      </div>
    </div>
  )
}
