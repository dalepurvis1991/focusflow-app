'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatBubble } from '@/components/ChatBubble'
import { Send, Mic } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { Message } from '@/types/assistant'

interface ChatMessage extends Message {
  id: string
}

const MOCK_RESPONSES: Record<string, string> = {
  appointment: "Got it! What time is your appointment? I'll add it to your calendar and set a reminder.",
  tired: "That's totally valid. ADHD brains can be exhausting. Want to talk through what's going on? Or maybe it's time for a break?",
  forget: "I know that feeling. Let's write it down right now so you don't lose it. What do you need to remember?",
  anxious: "Hey, I hear you. Anxiety and ADHD often go hand-in-hand. Want to talk about what's worrying you, or would a grounding technique help?",
  focus: "Let's work on your focus. Want to try a pomodoro session? I can set a timer for 25 minutes and remind you to take a break.",
  reminder: "Sure, I can help with that. What do you want to remember, and when?",
  default: "I hear you. Tell me more about what you're thinking. What would help right now?",
}

function getMockResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes('doctor') || lower.includes('appointment')) {
    return MOCK_RESPONSES.appointment
  }
  if (lower.includes('tired') || lower.includes('exhausted')) {
    return MOCK_RESPONSES.tired
  }
  if (lower.includes('forget') || lower.includes('remember')) {
    return MOCK_RESPONSES.reminder
  }
  if (lower.includes('anxious') || lower.includes('anxiety')) {
    return MOCK_RESPONSES.anxious
  }
  if (lower.includes('focus') || lower.includes('concentrate')) {
    return MOCK_RESPONSES.focus
  }

  return MOCK_RESPONSES.default
}

export default function AssistantPage() {
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

    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const assistantResponse: ChatMessage = {
      id: generateId(),
      conversationId: 'main',
      role: 'assistant',
      content: getMockResponse(text),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantResponse])
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex flex-col">
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 z-10">
        <h1 className="text-xl font-bold text-slate-100">FocusFlow Coach</h1>
        <p className="text-sm text-slate-400">Always here to listen</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
