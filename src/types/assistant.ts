export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  sentiment?: 'positive' | 'neutral' | 'needs-support'
}

export type Personality = 'coach' | 'friend' | 'motivator' | 'calm'

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  personality: Personality
  createdAt: number
  updatedAt: number
}
