import apiClient from './api'
import type { Notification, NotificationPreferences } from '@/types/notification'
import type { PaginatedResponse } from '@/types/property'

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(
    ([, v]: [string, any]) => v !== undefined && v !== null && v !== ''
  )
  if (filtered.length === 0) return ''
  return '?' + new URLSearchParams(filtered.map(([k, v]: [string, any]) => [k, String(v)])).toString()
}

export const notificationService = {
  list: (filters?: { status?: string; priority?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<Notification>>(
      `/notifications/${buildQuery(filters || {})}`
    ),

  getById: (id: string | number) =>
    apiClient.get<Notification>(`/notifications/${id}/`),

  markAsRead: (id: string | number) =>
    apiClient.post(`/notifications/${id}/read/`),

  markAllAsRead: () =>
    apiClient.post<{ marked_read: number }>('/notifications/mark-all-read/'),

  getUnreadCount: () =>
    apiClient.get<{ unread_count: number }>('/notifications/unread-count/'),

  delete: (id: string | number) =>
    apiClient.delete(`/notifications/${id}/delete/`),

  // Preferences
  getPreferences: () =>
    apiClient.get<NotificationPreferences>('/notifications/preferences/'),

  updatePreferences: (data: Partial<NotificationPreferences>) =>
    apiClient.patch<NotificationPreferences>('/notifications/preferences/', data),

  // FCM Push Notifications
  registerDevice: (token: string, deviceType: 'web' | 'android' | 'ios' = 'web') =>
    apiClient.post<{ id: number; device_type: string; created: boolean }>(
      '/notifications/fcm/register/',
      { token, device_type: deviceType },
    ),

  unregisterDevice: (token: string) =>
    apiClient.post('/notifications/fcm/unregister/', { token }),
}
