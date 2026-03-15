export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  sentiment?: 'positive' | 'neutral' | 'needs-support'
}

export interface Conversation {
  id: string
  userId: string
  createdAt: number
  updatedAt: number
  messages: Message[]
  topic?: string
}
