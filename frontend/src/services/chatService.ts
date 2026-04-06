import apiClient from './api'
import type {
  Conversation,
  Message,
  SendMessageData,
  CreateConversationData,
} from '@/types/chat'
import type { PaginatedResponse } from '@/types/property'

export const chatService = {
  // Conversations
  listConversations: () =>
    apiClient.get<PaginatedResponse<Conversation>>('/chat/conversations/'),

  getConversation: (conversationId: string) =>
    apiClient.get<Conversation>(`/chat/conversations/${conversationId}/`),

  createConversation: (data: CreateConversationData) =>
    apiClient.post<Conversation>('/chat/conversations/create/', data),

  archiveConversation: (conversationId: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/archive/`),

  // Messages
  getMessages: (conversationId: string, page?: number) =>
    apiClient.get<PaginatedResponse<Message>>(
      `/chat/conversations/${conversationId}/messages/${page ? `?page=${page}` : ''}`
    ),

  sendMessage: (conversationId: string, data: SendMessageData) => {
    if (data.attachment) {
      const formData = new FormData()
      formData.append('message_type', data.message_type)
      formData.append('content', data.content)
      formData.append('attachment', data.attachment)
      return apiClient.upload<Message>(`/chat/conversations/${conversationId}/messages/`, formData)
    }
    return apiClient.post<Message>(`/chat/conversations/${conversationId}/messages/`, {
      message_type: data.message_type,
      content: data.content,
    })
  },

  markConversationRead: (conversationId: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/read/`),

  editMessage: (messageId: number, content: string) =>
    apiClient.patch(`/chat/messages/${messageId}/edit/`, { content }),

  deleteMessage: (messageId: number) =>
    apiClient.delete(`/chat/messages/${messageId}/delete/`),

  getUnreadCount: () =>
    apiClient.get<{ unread_count: number }>('/chat/unread-count/'),

  getQuickActions: () =>
    apiClient.get('/chat/quick-actions/'),
}
