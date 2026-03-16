export interface HealthMetrics {
  date: string // YYYY-MM-DD format
  sleepHours?: number
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent'
  waterIntake?: number // in glasses
  movementMinutes?: number
  medicationTaken?: boolean
  medicationTime?: string // HH:MM format
  mood?: 'very low' | 'low' | 'neutral' | 'good' | 'excellent'
  energyLevel?: number // 1-10 scale
  focusQuality?: number // 1-10 scale
  stressLevel?: number // 1-10 scale
  notes?: string
}

export interface HealthSummary {
  date: string
  sleepHours?: number
  sleepQuality?: string
  medsAdherence: number // percentage
  weeklyAverageWater: number
  weeklyMovement: number // total minutes
  avgMood: number // average of mood scale
  avgEnergy: number
  avgFocus: number
  avgStress: number
}

export interface HealthState {
  metrics: HealthMetrics[]
  lastLogged?: string
  streak: number // consecutive days logged
  thisWeekLogged: number // days logged this week
}
