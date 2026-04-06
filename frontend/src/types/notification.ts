export type NotificationType = 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp'
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Notification {
  id: string | number
  user: string | number
  notification_type: NotificationType
  status: NotificationStatus
  priority: NotificationPriority
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface NotificationPreferences {
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  whatsapp_notifications: boolean
}
