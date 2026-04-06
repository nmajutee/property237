'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showPreferences, setShowPreferences] = useState(false)

  const { data: notificationsData, isLoading } = useNotifications({ status: statusFilter || undefined })
  const { data: unreadCountData } = useUnreadNotificationCount()
  const { data: prefsData } = useNotificationPreferences()
  const markRead = useMarkNotificationAsRead()
  const markAllRead = useMarkAllNotificationsAsRead()
  const updatePrefs = useUpdateNotificationPreferences()

  const notifications = (notificationsData as any)?.results || notificationsData || []
  const unreadCount = (unreadCountData as any)?.unread_count || 0
  const preferences = prefsData || {}

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      email: '📧', sms: '📱', push: '🔔', in_app: '💬', whatsapp: '💚'
    }
    return icons[type] || '📋'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      normal: 'border-gray-200',
      low: 'border-gray-100 bg-gray-50',
    }
    return colors[priority] || 'border-gray-200'
  }

  const getNotifLink = (notif: any): string | null => {
    // Check extra_data for explicit link
    if (notif.extra_data?.link) return notif.extra_data.link
    if (notif.extra_data?.url) return notif.extra_data.url
    // Build link from content_type + object_id
    if (notif.content_type_name && notif.object_id) {
      const routes: Record<string, string> = {
        propertylisting: `/properties/${notif.object_id}`,
        property: `/properties/${notif.object_id}`,
        leaseagreement: `/leases/${notif.object_id}`,
        lease: `/leases/${notif.object_id}`,
        maintenancerequest: '/maintenance',
        transaction: '/payments',
        conversation: '/chat',
        message: '/chat',
        tenantapplication: '/my-applications',
        agentprofile: `/agents/${notif.object_id}`,
      }
      return routes[notif.content_type_name] || null
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || unreadCount === 0}
              className="text-sm bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Mark All Read
            </button>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
            >
              ⚙ Preferences
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {['', 'pending', 'sent', 'delivered', 'read'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-sm ${
                statusFilter === s ? 'bg-green-600 text-white' : 'bg-white border'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Preferences panel */}
        {showPreferences && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Notification Preferences</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(preferences as Record<string, any>)
                .filter(([key]) => key.startsWith('email_') || key.startsWith('sms_') || key.startsWith('push_'))
                .map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => updatePrefs.mutate({ [key]: e.target.checked })}
                      className="rounded"
                    />
                    <span>{key.replace(/_/g, ' ')}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Notifications list */}
        {isLoading ? (
          <div className="text-gray-500 p-8 text-center">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500 p-8 text-center bg-white rounded shadow">
            No notifications
          </div>
        ) : (
          <div className="space-y-2">
            {(notifications as any[]).map((notif: any) => {
              const notifLink = getNotifLink(notif)
              return (
              <div
                key={notif.id}
                className={`bg-white p-4 rounded shadow border-l-4 ${getPriorityColor(notif.priority)} ${
                  notif.status !== 'read' ? 'font-medium' : 'opacity-75'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(notif.notification_type)}</span>
                      <h3 className="font-semibold">{notif.subject}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        notif.status === 'read' ? 'bg-gray-100' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <span>From: {notif.sender_name || 'System'} •{' '}
                      {new Date(notif.created_at).toLocaleString()}</span>
                      {notifLink && (
                        <Link href={notifLink} className="text-green-600 hover:underline">
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                  {notif.status !== 'read' && (
                    <button
                      onClick={() => markRead.mutate(notif.id)}
                      className="text-xs text-blue-600 hover:underline ml-2"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
