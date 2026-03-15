'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Preferences, OnboardingData, Streak } from '@/types/user'

interface UserContextType {
  user: User | null
  streak: Streak | null
  isLoggedIn: boolean
  theme: 'dark' | 'light'
  setUser: (user: User | null) => void
  updateOnboarding: (data: OnboardingData) => void
  updatePreferences: (prefs: Partial<Preferences>) => void
  updateStreak: (streak: Streak) => void
  clearUser: () => void
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, name: string) => boolean
  logout: () => void
  toggleTheme: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const DEFAULT_PREFERENCES: Preferences = {
  reminderFrequency: 'medium',
  focusDuration: 25,
  breakDuration: 5,
  breakRemindersEnabled: true,
  soundEnabled: true,
  darkMode: true,
  theme: 'dark',
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [streak, setStreakState] = useState<Streak | null>(null)
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('focusflow_user')
    const savedStreak = localStorage.getItem('focusflow_streak')
    const savedTheme = (localStorage.getItem('focusflow_theme') as 'dark' | 'light') || 'dark'

    // Initialize demo account if it doesn't exist
    const demoExists = localStorage.getItem('focusflow_credentials_demo@focusflow.app')
    if (!demoExists) {
      localStorage.setItem(
        'focusflow_credentials_demo@focusflow.app',
        JSON.stringify({ password: 'demo123', email: 'demo@focusflow.app' })
      )
      const demoUser: User = {
        id: 'demo_user',
        name: 'Demo User',
        email: 'demo@focusflow.app',
        age: 28,
        subscriptionTier: 'free',
        createdAt: Date.now(),
        onboarding: {
          name: 'Demo User',
          age: 28,
          wakeTime: '07:00',
          workStartTime: '09:00',
          workEndTime: '17:00',
          takesAdhgMeds: true,
          medsTime: '08:00',
          medsName: 'Adderall',
          notificationsEnabled: true,
          completedAt: Date.now(),
        },
        preferences: DEFAULT_PREFERENCES,
      }
      localStorage.setItem(
        'focusflow_user_demo@focusflow.app',
        JSON.stringify(demoUser)
      )
    }

    if (savedUser) {
      setUserState(JSON.parse(savedUser))
    }
    if (savedStreak) {
      setStreakState(JSON.parse(savedStreak))
    }

    setThemeState(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (newTheme === 'dark') {
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        html.classList.add('light')
        html.classList.remove('dark')
      }
    }
  }

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem('focusflow_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('focusflow_user')
    }
  }

  const updateOnboarding = (data: OnboardingData) => {
    if (user) {
      const updated = { ...user, onboarding: data }
      setUser(updated)
    }
  }

  const updatePreferences = (prefs: Partial<Preferences>) => {
    if (user) {
      const updated = {
        ...user,
        preferences: { ...user.preferences, ...prefs },
      }
      setUser(updated)
    }
  }

  const updateStreak = (newStreak: Streak) => {
    setStreakState(newStreak)
    localStorage.setItem('focusflow_streak', JSON.stringify(newStreak))
  }

  const login = (email: string, password: string): boolean => {
    const credentials = localStorage.getItem(`focusflow_credentials_${email}`)
    if (credentials) {
      const stored = JSON.parse(credentials)
      if (stored.password === password) {
        const storedUser = localStorage.getItem(`focusflow_user_${email}`)
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          localStorage.setItem('focusflow_current_user', email)
          return true
        }
      }
    }
    return false
  }

  const register = (email: string, password: string, name: string): boolean => {
    const existing = localStorage.getItem(`focusflow_credentials_${email}`)
    if (existing) {
      return false
    }

    localStorage.setItem(`focusflow_credentials_${email}`, JSON.stringify({ password, email }))
    localStorage.setItem('focusflow_current_user', email)

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      age: 0,
      subscriptionTier: 'free',
      createdAt: Date.now(),
      onboarding: null,
      preferences: DEFAULT_PREFERENCES,
    }

    localStorage.setItem(`focusflow_user_${email}`, JSON.stringify(newUser))
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('focusflow_current_user')
    localStorage.removeItem('focusflow_streak')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    localStorage.setItem('focusflow_theme', newTheme)
    applyTheme(newTheme)
  }

  const contextValue: UserContextType = {
    user,
    streak,
    isLoggedIn: !!user,
    theme,
    setUser,
    updateOnboarding,
    updatePreferences,
    updateStreak,
    clearUser: logout,
    login,
    register,
    logout,
    toggleTheme,
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
