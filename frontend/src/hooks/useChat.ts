'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/chatService'
import type { SendMessageData, CreateConversationData } from '@/types/chat'

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
  unreadCount: () => [...chatKeys.all, 'unreadCount'] as const,
}

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatService.listConversations(),
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: chatKeys.conversation(id),
    queryFn: () => chatService.getConversation(id),
    enabled: !!id,
  })
}

export function useMessages(conversationId: string, page?: number) {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), page],
    queryFn: () => chatService.getMessages(conversationId, page),
    enabled: !!conversationId,
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateConversationData) => chatService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, data }: { conversationId: string; data: SendMessageData }) =>
      chatService.sendMessage(conversationId, data),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) => chatService.markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },
  })
}

export function useArchiveConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) => chatService.archiveConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

export function useChatUnreadCount() {
  return useQuery({
    queryKey: chatKeys.unreadCount(),
    queryFn: () => chatService.getUnreadCount(),
    refetchInterval: 30000,
  })
}
