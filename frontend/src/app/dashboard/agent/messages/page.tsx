'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { authAPI } from '../../../../services/api'
import { useConversations, useMessages, useSendMessage, useMarkConversationRead } from '@/hooks/useChat'

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversationsData, isLoading: convosLoading } = useConversations()
  const { data: messagesData, isLoading: msgsLoading } = useMessages(selectedConvoId || '')
  const sendMessageMutation = useSendMessage()
  const markReadMutation = useMarkConversationRead()

  const conversations = (conversationsData as any)?.results ?? (conversationsData as any) ?? []
  const messages = (messagesData as any)?.results ?? (messagesData as any) ?? []

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await authAPI.getProfile()
        setUser((profileData as any).user || profileData)
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/sign-in')
        }
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedConvoId) {
      markReadMutation.mutate(selectedConvoId)
    }
  }, [selectedConvoId])

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConvoId) return
    sendMessageMutation.mutate(
      { conversationId: selectedConvoId, data: { conversation: selectedConvoId, content: newMessage, message_type: 'text' } },
      { onSuccess: () => setNewMessage('') }
    )
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agent Portal</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <Link href="/dashboard/agent" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChartBarIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/agent/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            My Properties
          </Link>
          <Link href="/dashboard/agent/applications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <UsersIcon className="h-5 w-5" />
            Applications
          </Link>
          <Link href="/dashboard/agent/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href="/dashboard/agent/credits" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link href="/dashboard/agent/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-property237-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-property237-primary">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Communication with tenants and other agents
          </p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {convosLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <InboxIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No conversations yet</p>
                <Link href="/chat" className="text-sm text-property237-primary hover:underline mt-2 inline-block">
                  Start a conversation
                </Link>
              </div>
            ) : (
              conversations.map((convo: any) => (
                <button
                  key={convo.id || convo.conversation_id}
                  onClick={() => setSelectedConvoId(String(convo.id || convo.conversation_id))}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selectedConvoId === String(convo.id || convo.conversation_id) ? 'bg-property237-primary/5' : ''
                  }`}
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {convo.subject || convo.other_user?.first_name || 'Conversation'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {convo.last_message?.content || 'No messages'}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {!selectedConvoId ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to view messages</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {msgsLoading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet</div>
                  ) : (
                    messages.map((msg: any) => {
                      const isOwn = msg.sender?.id === user?.id
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-property237-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-property237-primary"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark disabled:opacity-50"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
