'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { RewardsState, Badge, BadgeId, Reward, DailyActivity, PointEarningEvent } from '@/types/rewards'
import { getTodayDate } from '@/lib/utils'

interface RewardsContextType {
  state: RewardsState
  addPoints: (amount: number, reason: PointEarningEvent['reason']) => void
  checkMilestones: () => Badge[]
  getDailyActivity: () => DailyActivity | null
  getRewardCode: (rewardId: string) => string | null
  recordDailyLogin: () => boolean
  recordFocusSession: (minutes: number) => void
  recordAiChat: () => void
  recordEventCreated: () => void
  recordNudgeDismissed: () => void
  getNewBadges: () => Badge[]
  clearNewBadges: () => void
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined)

const BADGES: Record<BadgeId, Omit<Badge, 'earnedAt'>> = {
  'first-focus': {
    id: 'first-focus',
    name: 'Focused',
    description: 'Completed your first focus session',
    emoji: '🎯',
  },
  'first-chat': {
    id: 'first-chat',
    name: 'Connected',
    description: 'Started your first AI conversation',
    emoji: '💬',
  },
  'getting-started': {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Reached 7-day streak',
    emoji: '🚀',
  },
  'building-momentum': {
    id: 'building-momentum',
    name: 'Building Momentum',
    description: 'Reached 14-day streak',
    emoji: '⚡',
  },
  'monthly-champion': {
    id: 'monthly-champion',
    name: 'Monthly Champion',
    description: 'Reached 30-day streak with 15+ min/day',
    emoji: '👑',
  },
  'focus-master': {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Earned 100 Focus Points in a week',
    emoji: '🔥',
  },
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Earned 500 total Focus Points',
    emoji: '💎',
  },
  connected: {
    id: 'connected',
    name: 'Connected',
    description: 'First AI conversation',
    emoji: '🤝',
  },
}

const DEFAULT_REWARDS_STATE: RewardsState = {
  totalPoints: 0,
  weeklyPoints: 0,
  badges: Object.values(BADGES).map((b) => ({ ...b, earnedAt: null })),
  rewards: [],
  dailyLog: [],
  currentStreak: 0,
  lastLoginDate: null,
  lastDailyBonusDate: null,
}

function generateRewardCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'FOCUS-CHAMPION-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function getStorageKey(email: string | undefined): string {
  return `focusflow_rewards_${email || 'default'}`
}

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RewardsState>(DEFAULT_REWARDS_STATE)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentEmail, setCurrentEmail] = useState<string | undefined>()

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true)
    const email = localStorage.getItem('focusflow_current_user')
    setCurrentEmail(email || undefined)

    const saved = localStorage.getItem(getStorageKey(email || undefined))
    if (saved) {
      setState(JSON.parse(saved))
    } else {
      setState(DEFAULT_REWARDS_STATE)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (mounted && currentEmail !== undefined) {
      localStorage.setItem(getStorageKey(currentEmail), JSON.stringify(state))
    }
  }, [state, mounted, currentEmail])

  const getTodayActivity = (): DailyActivity | null => {
    const today = getTodayDate()
    return state.dailyLog.find((log) => log.date === today) || null
  }

  const getOrCreateTodayActivity = (): DailyActivity => {
    const today = getTodayDate()
    let activity = state.dailyLog.find((log) => log.date === today)

    if (!activity) {
      activity = {
        date: today,
        appOpened: false,
        focusSessions: 0,
        aiChats: 0,
        eventsCreated: 0,
        nudgesDismissed: 0,
      }
      const newLog: DailyActivity[] = [...state.dailyLog, activity]
      setState((prev) => ({
        ...prev,
        dailyLog: newLog,
      }))
    }

    return activity
  }

  const addPoints = (amount: number, reason: PointEarningEvent['reason']) => {
    setState((prev) => {
      const newTotal = prev.totalPoints + amount
      const newWeekly = prev.weeklyPoints + amount

      // Reset weekly points if a week has passed
      const today = getTodayDate()
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      return {
        ...prev,
        totalPoints: newTotal,
        weeklyPoints: newWeekly,
      }
    })
  }

  const recordDailyLogin = (): boolean => {
    const today = getTodayDate()
    const lastLogin = state.lastLoginDate

    if (lastLogin === today) {
      // Already logged in today
      return false
    }

    setState((prev) => {
      let newStreak = prev.currentStreak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Check if last login was yesterday
      if (lastLogin === yesterdayStr) {
        newStreak += 1
      } else {
        // Streak is broken
        newStreak = 1
      }

      return {
        ...prev,
        lastLoginDate: today,
        currentStreak: newStreak,
        lastDailyBonusDate: today,
      }
    })

    // Award points for daily login
    addPoints(10, 'daily-login')
    return true
  }

  const recordFocusSession = (minutes: number) => {
    const activity = getOrCreateTodayActivity()
    activity.focusSessions += 1

    setState((prev) => {
      const updated: DailyActivity[] = prev.dailyLog.map((log) => (log.date === activity.date ? activity : log))
      return {
        ...prev,
        dailyLog: updated,
      }
    })

    addPoints(25, 'focus-session')
  }

  const recordAiChat = () => {
    const activity = getOrCreateTodayActivity()
    if (activity.aiChats < 3) {
      activity.aiChats += 1

      setState((prev) => {
        const updated: DailyActivity[] = prev.dailyLog.map((log) => (log.date === activity.date ? activity : log))
        return {
          ...prev,
          dailyLog: updated,
        }
      })

      addPoints(15, 'ai-chat')
    }
  }

  const recordEventCreated = () => {
    const activity = getOrCreateTodayActivity()
    activity.eventsCreated += 1

    setState((prev) => {
      const updated: DailyActivity[] = prev.dailyLog.map((log) => (log.date === activity.date ? activity : log))
      return {
        ...prev,
        dailyLog: updated,
      }
    })

    addPoints(10, 'calendar-event')
  }

  const recordNudgeDismissed = () => {
    const activity = getOrCreateTodayActivity()
    activity.nudgesDismissed += 1

    setState((prev) => {
      const updated: DailyActivity[] = prev.dailyLog.map((log) => (log.date === activity.date ? activity : log))
      return {
        ...prev,
        dailyLog: updated,
      }
    })

    addPoints(5, 'nudge-dismissed')
  }

  const checkMilestones = (): Badge[] => {
    const earnedBadges: Badge[] = []

    setState((prev) => {
      const updated = { ...prev }
      const badges = [...updated.badges]

      // Check for first-focus badge
      if (
        !badges.find((b) => b.id === 'first-focus')?.earnedAt &&
        (getTodayActivity()?.focusSessions ?? 0) > 0
      ) {
        const idx = badges.findIndex((b) => b.id === 'first-focus')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])
        }
      }

      // Check for 7-day streak
      if (!badges.find((b) => b.id === 'getting-started')?.earnedAt && updated.currentStreak >= 7) {
        const idx = badges.findIndex((b) => b.id === 'getting-started')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])

          // Award reward code
          const newReward: Reward = {
            id: 'reward-7day-' + Date.now(),
            name: '7-Day Streak Reward',
            description: 'Unlock Motivator personality',
            code: generateRewardCode(),
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
          }
          updated.rewards.push(newReward)
        }
      }

      // Check for 14-day streak
      if (!badges.find((b) => b.id === 'building-momentum')?.earnedAt && updated.currentStreak >= 14) {
        const idx = badges.findIndex((b) => b.id === 'building-momentum')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])
        }
      }

      // Check for 30-day streak (with 15+ min/day check would need to be implemented at a higher level)
      if (!badges.find((b) => b.id === 'monthly-champion')?.earnedAt && updated.currentStreak >= 30) {
        const idx = badges.findIndex((b) => b.id === 'monthly-champion')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])

          // Award reward code
          const newReward: Reward = {
            id: 'reward-30day-' + Date.now(),
            name: 'Monthly Champion Reward',
            description: '1 month half price',
            code: generateRewardCode(),
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
          }
          updated.rewards.push(newReward)
        }
      }

      // Check for focus-master (100 points in a week)
      if (!badges.find((b) => b.id === 'focus-master')?.earnedAt && updated.weeklyPoints >= 100) {
        const idx = badges.findIndex((b) => b.id === 'focus-master')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])
        }
      }

      // Check for dedicated (500 total points)
      if (!badges.find((b) => b.id === 'dedicated')?.earnedAt && updated.totalPoints >= 500) {
        const idx = badges.findIndex((b) => b.id === 'dedicated')
        if (idx !== -1) {
          badges[idx].earnedAt = Date.now()
          earnedBadges.push(badges[idx])
        }
      }

      return {
        ...updated,
        badges,
      }
    })

    setNewBadges(earnedBadges)
    return earnedBadges
  }

  const getRewardCode = (rewardId: string): string | null => {
    const reward = state.rewards.find((r) => r.id === rewardId)
    return reward?.code || null
  }

  if (!mounted) {
    return <>{children}</>
  }

  const contextValue: RewardsContextType = {
    state,
    addPoints,
    checkMilestones,
    getDailyActivity: getTodayActivity,
    getRewardCode,
    recordDailyLogin,
    recordFocusSession,
    recordAiChat,
    recordEventCreated,
    recordNudgeDismissed,
    getNewBadges: () => newBadges,
    clearNewBadges: () => setNewBadges([]),
  }

  return (
    <RewardsContext.Provider value={contextValue}>{children}</RewardsContext.Provider>
  )
}

export function useRewards() {
  const context = useContext(RewardsContext)
  if (context === undefined) {
    throw new Error('useRewards must be used within RewardsProvider')
  }
  return context
}
