'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { useCalendar } from '@/context/CalendarContext'
import { useUser } from '@/context/UserContext'

interface FocusChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface FocusChatProps {
  isOpen: boolean
  onClose: () => void
}

export function FocusChat({ isOpen, onClose }: FocusChatProps) {
  const { events } = useCalendar()
  const { user } = useUser()
  const [messages, setMessages] = useState<FocusChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Quick question? I can help with research without breaking your flow.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: FocusChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

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
                content: input,
              },
            ]),
          events,
          user,
          focusMode: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to get response')
      }

      const data = await response.json()

      const assistantResponse: FocusChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantResponse])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      const errorResponse: FocusChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Sorry, I couldn't help: ${errorMessage}`,
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div className="w-full max-w-md bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl flex flex-col max-h-96 pointer-events-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-100">Quick Search</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[#136dec] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                  FF
                </div>
              )}
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-[#136dec] text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#136dec] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                FF
              </div>
              <div className="flex items-center gap-1 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#136dec] disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-[#136dec] text-white hover:bg-[#1058c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
