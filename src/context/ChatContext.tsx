'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Conversation, Message, Personality } from '@/types/assistant'
import { generateId } from '@/lib/utils'

interface ChatContextType {
  conversations: Conversation[]
  activeConversationId: string | null
  userMemory: string

  // Conversation management
  createConversation: (personality?: Personality) => string
  deleteConversation: (id: string) => void
  getConversation: (id: string) => Conversation | undefined
  setActiveConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void

  // Message management
  addMessage: (conversationId: string, message: Message) => void

  // Memory management
  updateMemory: (newFact: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const STORAGE_KEY_CONVERSATIONS = 'focusflow_conversations'
const STORAGE_KEY_MEMORY = 'focusflow_user_memory'
const STORAGE_KEY_ACTIVE = 'focusflow_active_conversation'

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null)
  const [userMemory, setUserMemoryState] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY_CONVERSATIONS)
    const savedMemory = localStorage.getItem(STORAGE_KEY_MEMORY)
    const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE)

    let loadedConversations: Conversation[] = []

    if (savedConversations) {
      try {
        loadedConversations = JSON.parse(savedConversations)
      } catch {
        loadedConversations = []
      }
    }

    // If no conversations exist, create a default one
    if (loadedConversations.length === 0) {
      const defaultConv: Conversation = {
        id: generateId(),
        title: 'New Chat',
        messages: [
          {
            id: generateId(),
            conversationId: '', // Will be set below
            role: 'assistant',
            content: "Hey! I'm your FocusFlow coach. I'm here to listen, help you organize your thoughts, remember what matters, and give you gentle nudges to take care of yourself. What's on your mind?",
            timestamp: Date.now(),
          },
        ],
        personality: 'coach',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      defaultConv.messages[0].conversationId = defaultConv.id
      loadedConversations = [defaultConv]
    }

    setConversations(loadedConversations)

    if (savedMemory) {
      setUserMemoryState(savedMemory)
    }

    // Set active conversation
    if (savedActiveId && loadedConversations.some(c => c.id === savedActiveId)) {
      setActiveConversationIdState(savedActiveId)
    } else if (loadedConversations.length > 0) {
      setActiveConversationIdState(loadedConversations[0].id)
    }

    setMounted(true)
  }, [])

  // Save conversations to localStorage
  const saveConversations = (newConversations: Conversation[]) => {
    setConversations(newConversations)
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(newConversations))
  }

  // Save memory to localStorage
  const saveMemory = (newMemory: string) => {
    setUserMemoryState(newMemory)
    localStorage.setItem(STORAGE_KEY_MEMORY, newMemory)
  }

  const createConversation = (personality: Personality = 'coach'): string => {
    const newId = generateId()
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [
        {
          id: generateId(),
          conversationId: newId,
          role: 'assistant',
          content: "Hey! I'm your FocusFlow coach. I'm here to listen, help you organize your thoughts, remember what matters, and give you gentle nudges to take care of yourself. What's on your mind?",
          timestamp: Date.now(),
        },
      ],
      personality,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const updated = [newConversation, ...conversations]
    saveConversations(updated)
    setActiveConversationIdState(newId)
    localStorage.setItem(STORAGE_KEY_ACTIVE, newId)

    return newId
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id)
    saveConversations(updated)

    // If we deleted the active conversation, switch to another
    if (activeConversationId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null
      setActiveConversationIdState(nextId)
      if (nextId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, nextId)
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE)
      }
    }
  }

  const getConversation = (id: string): Conversation | undefined => {
    return conversations.find(c => c.id === id)
  }

  const setActiveConversation = (id: string) => {
    if (conversations.some(c => c.id === id)) {
      setActiveConversationIdState(id)
      localStorage.setItem(STORAGE_KEY_ACTIVE, id)
    }
  }

  const renameConversation = (id: string, title: string) => {
    const updated = conversations.map(c =>
      c.id === id ? { ...c, title, updatedAt: Date.now() } : c
    )
    saveConversations(updated)
  }

  const addMessage = (conversationId: string, message: Message) => {
    const updated = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, { ...message, conversationId }],
          updatedAt: Date.now(),
        }
      }
      return c
    })

    // Re-sort by updatedAt
    const sorted = updated.sort((a, b) => b.updatedAt - a.updatedAt)
    saveConversations(sorted)
  }

  const updateMemory = (newFact: string) => {
    const updated = userMemory ? `${userMemory}\n- ${newFact}` : `- ${newFact}`
    saveMemory(updated)
  }

  const contextValue: ChatContextType = {
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
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
