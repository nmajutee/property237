'use client'

import { useState, useRef, useEffect } from 'react'
import { useConversations, useMessages, useCreateConversation, useSendMessage, useMarkConversationRead } from '@/hooks/useChat'
import type { Conversation, Message } from '@/types/chat'

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatUserId, setNewChatUserId] = useState('')
  const [newChatMessage, setNewChatMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversationsData, isLoading: loadingConversations } = useConversations()
  const { data: messagesData, isLoading: loadingMessages } = useMessages(selectedConversation || '')
  const createConversation = useCreateConversation()
  const sendMessage = useSendMessage()
  const markRead = useMarkConversationRead()

  const conversations = (conversationsData as any)?.results || conversationsData || []
  const messages = (messagesData as any)?.results || messagesData || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedConversation) {
      markRead.mutate(selectedConversation)
    }
  }, [selectedConversation])

  const handleSend = () => {
    if (!messageText.trim() || !selectedConversation) return
    sendMessage.mutate({
      conversationId: selectedConversation,
      data: { message_type: 'text', content: messageText, conversation: 0 }
    })
    setMessageText('')
  }

  const handleNewChat = () => {
    if (!newChatUserId) return
    createConversation.mutate({
      participant_ids: [parseInt(newChatUserId)],
      conversation_type: 'property_inquiry',
      initial_message: newChatMessage,
    }, {
      onSuccess: (data: any) => {
        setSelectedConversation(data?.conversation_id || data?.id)
        setShowNewChat(false)
        setNewChatUserId('')
        setNewChatMessage('')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            New Conversation
          </button>
        </div>

        {showNewChat && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Start New Conversation</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="User ID"
                value={newChatUserId}
                onChange={(e) => setNewChatUserId(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>
            <textarea
              placeholder="Initial message (optional)"
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2"
              rows={2}
            />
            <button
              onClick={handleNewChat}
              disabled={createConversation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {createConversation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        )}

        <div className="flex bg-white rounded shadow" style={{ height: '70vh' }}>
          {/* Conversation list */}
          <div className="w-1/3 border-r overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 text-gray-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-gray-500">No conversations yet</div>
            ) : (
              conversations.map((conv: any) => (
                <div
                  key={conv.id || conv.conversation_id}
                  onClick={() => setSelectedConversation(conv.conversation_id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conv.conversation_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">
                      {conv.participants?.map((p: any) => p.full_name || p.email).join(', ') || conv.conversation_id}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {conv.last_message?.content || 'No messages'}
                  </p>
                  <span className="text-xs text-gray-400">
                    {conv.conversation_type?.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Messages area */}
          <div className="w-2/3 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="text-gray-500">Loading messages...</div>
                  ) : (
                    (messages as any[]).map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender?.id === 'current' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.is_deleted ? 'bg-gray-200 italic text-gray-400' :
                          'bg-gray-100'
                        }`}>
                          <div className="text-xs text-gray-500 mb-1">
                            {msg.sender?.full_name || msg.sender?.email || 'Unknown'}
                          </div>
                          <p className="text-sm">
                            {msg.is_deleted ? 'Message deleted' : msg.content}
                          </p>
                          {msg.attachment && (
                            <a href={msg.attachment} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline">
                              📎 Attachment
                            </a>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.sent_at).toLocaleTimeString()}
                            {msg.is_edited && ' (edited)'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-3 flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sendMessage.isPending || !messageText.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
