'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatBubble } from '@/components/ChatBubble'
import { Send, Mic } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { Message } from '@/types/assistant'
import { useCalendar } from '@/context/CalendarContext'
import { useUser } from '@/context/UserContext'

interface ChatMessage extends Message {
  id: string
}

export default function AssistantPage() {
  const { events } = useCalendar()
  const { user } = useUser()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      conversationId: 'main',
      role: 'assistant',
      content:
        "Hey! I'm your FocusFlow coach. I'm here to listen, help you organize your thoughts, remember what matters, and give you gentle nudges to take care of yourself. What's on your mind?",
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: generateId(),
      conversationId: 'main',
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({
              role: m.role,
              content: m.content,
            }))
            .concat([
              {
                role: 'user',
                content: text,
              },
            ]),
          events,
          user,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to get response from assistant')
      }

      const data = await response.json()

      const assistantResponse: ChatMessage = {
        id: generateId(),
        conversationId: 'main',
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantResponse])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Chat error:', err)

      const errorResponse: ChatMessage = {
        id: generateId(),
        conversationId: 'main',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex flex-col">
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 z-10">
        <h1 className="text-xl font-bold text-slate-100">FocusFlow Coach</h1>
        <p className="text-sm text-slate-400">Always here to listen</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {messages.map((message) => (
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

      <div className="fixed bottom-24 left-0 right-0 bg-gradient-to-t from-[#0b1219] to-transparent pointer-events-none h-12" />

      <div className="fixed bottom-24 left-0 right-0 p-4 flex gap-2 max-w-2xl mx-auto">
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
          className="flex-1"
          disabled={isLoading}
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

      <div className="h-24" />
    </div>
  )
}
