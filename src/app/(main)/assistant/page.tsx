'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatBubble } from '@/components/ChatBubble'
import { FirstTimeGuide } from '@/components/FirstTimeGuide'
import { Send, Mic, Trash2, Menu, X, Plus } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { Message, Personality } from '@/types/assistant'
import { useCalendar } from '@/context/CalendarContext'
import { useUser } from '@/context/UserContext'
import { useChat } from '@/context/ChatContext'

interface ChatResponse {
  role: string
  content: string
  memoryUpdate?: string
}

const PERSONALITY_OPTIONS: { value: Personality; label: string; description: string }[] = [
  { value: 'coach', label: 'Coach', description: 'Structured & practical' },
  { value: 'friend', label: 'Friend', description: 'Casual & empathetic' },
  { value: 'motivator', label: 'Motivator', description: 'High energy' },
  { value: 'calm', label: 'Calm', description: 'Gentle & grounding' },
]

export default function AssistantPage() {
  const { events } = useCalendar()
  const { user } = useUser()
  const {
    conversations,
    activeConversationId,
    userMemory,
    createConversation,
    deleteConversation,
    getConversation,
    setActiveConversation,
    renameConversation,
    addMessage,
    updateMemory,
  } = useChat()

  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameText, setRenameText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = activeConversationId ? getConversation(activeConversationId) : null

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  const handleNewConversation = () => {
    createConversation('coach')
    setSidebarOpen(false)
  }

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this conversation? This cannot be undone.')) {
      deleteConversation(id)
    }
  }

  const handleStartRename = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation()
    setRenamingId(id)
    setRenameText(currentTitle)
  }

  const handleSaveRename = (id: string) => {
    if (renameText.trim()) {
      renameConversation(id, renameText.trim())
    }
    setRenamingId(null)
    setRenameText('')
  }

  const handleDeleteCurrentConversation = () => {
    if (activeConversationId && confirm('Delete this conversation? This cannot be undone.')) {
      deleteConversation(activeConversationId)
    }
  }

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || !activeConversation) return

    const userMessage: Message = {
      id: generateId(),
      conversationId: activeConversation.id,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    addMessage(activeConversation.id, userMessage)

    // Auto-title after first message if still "New Chat"
    if (activeConversation.title === 'New Chat' && activeConversation.messages.length === 1) {
      const title = text.length > 30 ? text.substring(0, 30) + '...' : text
      renameConversation(activeConversation.id, title)
    }

    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Get last 20 messages for context (excluding the initial assistant message)
      const messagesToSend = activeConversation.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-19)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))
        .concat([
          {
            role: 'user',
            content: text,
          },
        ])

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          events,
          user,
          personality: activeConversation.personality,
          memory: userMemory,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to get response from assistant')
      }

      const data: ChatResponse = await response.json()

      const assistantMessage: Message = {
        id: generateId(),
        conversationId: activeConversation.id,
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
      }

      addMessage(activeConversation.id, assistantMessage)

      // Update memory if Claude learned something new
      if (data.memoryUpdate) {
        updateMemory(data.memoryUpdate)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Chat error:', err)

      const errorMessage_msg: Message = {
        id: generateId(),
        conversationId: activeConversation.id,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: Date.now(),
      }
      addMessage(activeConversation.id, errorMessage_msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !activeConversation) {
    return (
      <div className="min-h-screen bg-[#0b1219] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#136dec] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const formatTime = (timestamp: number) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex flex-col lg:flex-row">
      <FirstTimeGuide
        pageKey="assistant"
        title="Meet your AI coach"
        tips={[
          'Create separate conversations to keep topics organized (work, health, personal, etc.)',
          "I can help you manage your calendar — try 'What's on my schedule tomorrow?'",
          'Ask me to set reminders, create events, or help you plan your day',
          "I understand typos and casual language — just talk to me like a friend",
          'Your conversation history is saved automatically, and I remember things you tell me',
          'Switch between different personality modes to find what works best for you',
        ]}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 z-40 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-100">Conversations</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 lg:hidden rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* New chat button */}
        <button
          onClick={handleNewConversation}
          className="m-4 p-3 rounded-lg bg-[#136dec] text-white hover:bg-[#1058c7] transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setActiveConversation(conv.id)
                setSidebarOpen(false)
              }}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === conv.id
                  ? 'bg-[#136dec] text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {renamingId === conv.id ? (
                <input
                  type="text"
                  value={renameText}
                  onChange={(e) => setRenameText(e.target.value)}
                  onBlur={() => handleSaveRename(conv.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(conv.id)
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-slate-700 text-white px-2 py-1 rounded text-sm"
                />
              ) : (
                <>
                  <p className="font-medium text-sm truncate">{conv.title}</p>
                  <p className="text-xs opacity-60 mt-1">{formatTime(conv.updatedAt)}</p>
                </>
              )}

              {/* Delete button on hover */}
              {activeConversationId === conv.id && !renamingId && (
                <button
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar footer - memory preview */}
        {userMemory && (
          <div className="p-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-2">My memory</p>
            <p className="text-xs text-slate-400 line-clamp-3">{userMemory}</p>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div
                onClick={() => {
                  setRenamingId(activeConversation.id)
                  setRenameText(activeConversation.title)
                }}
                className="cursor-pointer flex-1 min-w-0"
              >
                <h1 className="text-lg font-bold text-slate-100 truncate">
                  {activeConversation.title}
                </h1>
                <p className="text-xs text-slate-400">
                  {activeConversation.messages.length - 1} messages
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteCurrentConversation}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
              title="Delete conversation"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Personality selector */}
          <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
            {PERSONALITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                  activeConversation.personality === option.value
                    ? 'bg-[#136dec] text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
                title={option.description}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {activeConversation.messages.map((message) => (
            <ChatBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#136dec] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                FF
              </div>
              <div className="flex items-center gap-1 px-4 py-3 bg-slate-800 rounded-xl rounded-bl-none">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse animation-delay-100" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse animation-delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-gradient-to-t from-[#0b1219] to-transparent pointer-events-none h-12" />

        <div className="p-4 flex gap-2">
          <input
            type="text"
            placeholder="Tell me what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-[#136dec] transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-lg bg-[#136dec] text-white hover:bg-[#1058c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            <Send size={20} />
          </button>
          <button className="p-3 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors active:scale-95">
            <Mic size={20} />
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
