export type BadgeId =
  | 'first-focus'
  | 'first-chat'
  | 'getting-started'
  | 'building-momentum'
  | 'monthly-champion'
  | 'focus-master'
  | 'dedicated'
  | 'connected'

export interface Badge {
  id: BadgeId
  name: string
  description: string
  emoji: string
  earnedAt: number | null
}

export interface Reward {
  id: string
  name: string
  description: string
  code: string
  expiresAt: number
}

export interface DailyActivity {
  date: string
  appOpened: boolean
  focusSessions: number
  aiChats: number
  eventsCreated: number
  nudgesDismissed: number
}

export interface RewardsState {
  totalPoints: number
  weeklyPoints: number
  badges: Badge[]
  rewards: Reward[]
  dailyLog: DailyActivity[]
  currentStreak: number
  lastLoginDate: string | null
  lastDailyBonusDate: string | null
}

export interface PointEarningEvent {
  reason:
    | 'daily-login'
    | 'focus-session'
    | 'ai-chat'
    | 'calendar-event'
    | 'nudge-dismissed'
    | 'streak-bonus'
  amount: number
  timestamp: number
}
