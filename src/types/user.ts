export interface OnboardingData {
  name: string
  age: number
  wakeTime: string
  workStartTime: string
  workEndTime: string
  takesAdhgMeds: boolean
  medsTime?: string
  medsName?: string
  notificationsEnabled: boolean
  completedAt: number
}

export interface Preferences {
  reminderFrequency: 'high' | 'medium' | 'low'
  focusDuration: number
  breakDuration: number
  breakRemindersEnabled: boolean
  soundEnabled: boolean
  darkMode: boolean
  theme?: 'dark' | 'light'
  personality?: 'coach' | 'friend' | 'motivator' | 'calm'
}

export interface User {
  id: string
  name: string
  age: number
  email?: string
  subscriptionTier: 'free' | 'pro'
  createdAt: number
  onboarding: OnboardingData | null
  preferences: Preferences
}

export interface Streak {
  count: number
  lastDate: string
  totalDays: number
}
