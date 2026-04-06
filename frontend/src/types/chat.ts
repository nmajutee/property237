export type ConversationType =
  | 'property_inquiry'
  | 'viewing_arrangement'
  | 'lease_discussion'
  | 'maintenance_support'
  | 'general_support'

export type MessageType = 'text' | 'image' | 'document' | 'location' | 'payment_proof' | 'system'

export interface Conversation {
  id: string | number
  conversation_type: ConversationType
  participants: ConversationParticipant[]
  property?: string | number
  is_active: boolean
  is_archived: boolean
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface ConversationParticipant {
  id: string | number
  first_name: string
  last_name: string
  email: string
  profile_picture?: string
}

export interface Message {
  id: string | number
  conversation: string | number
  sender: ConversationParticipant
  message_type: MessageType
  content: string
  attachment?: string
  attachment_filename?: string
  is_read: boolean
  is_edited: boolean
  is_deleted: boolean
  quick_actions?: Record<string, any>
  sent_at: string
  edited_at?: string
  deleted_at?: string
}

export interface SendMessageData {
  conversation: string | number
  message_type: MessageType
  content: string
  attachment?: File
}

export interface CreateConversationData {
  conversation_type: ConversationType
  participant_ids: (string | number)[]
  property_id?: string | number
  initial_message?: string
}
