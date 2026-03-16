'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { HealthMetrics, HealthState, HealthSummary } from '@/types/health'

interface HealthContextType {
  state: HealthState
  logMetrics: (metrics: HealthMetrics) => void
  getMetricsForDate: (date: string) => HealthMetrics | undefined
  getWeeklySummary: (endDate: string) => HealthSummary
  updateStreak: () => void
}

const HealthContext = createContext<HealthContextType | undefined>(undefined)

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function calculateStreak(metrics: HealthMetrics[]): number {
  if (metrics.length === 0) return 0

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]

    if (metrics.some((m) => m.date === dateStr)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

function getWeekStartDate(date: string): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day // Adjust for Sunday=0
  const weekStart = new Date(d.setDate(diff))
  return weekStart.toISOString().split('T')[0]
}

function calculateWeeklySummary(metrics: HealthMetrics[], endDate: string): HealthSummary {
  const weekStart = getWeekStartDate(endDate)
  const weekMetrics = metrics.filter((m) => m.date >= weekStart && m.date <= endDate)

  const sleepAvg = weekMetrics.filter((m) => m.sleepHours).length > 0
    ? weekMetrics.reduce((sum, m) => sum + (m.sleepHours || 0), 0) / weekMetrics.filter((m) => m.sleepHours).length
    : 0

  const moodValues = weekMetrics.map((m) => {
    const moodMap = { 'very low': 1, low: 2, neutral: 3, good: 4, excellent: 5 }
    return moodMap[m.mood || 'neutral'] || 3
  })
  const avgMood = moodValues.length > 0 ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : 3

  const avgEnergy = weekMetrics.filter((m) => m.energyLevel).length > 0
    ? weekMetrics.reduce((sum, m) => sum + (m.energyLevel || 0), 0) / weekMetrics.filter((m) => m.energyLevel).length
    : 5

  const avgFocus = weekMetrics.filter((m) => m.focusQuality).length > 0
    ? weekMetrics.reduce((sum, m) => sum + (m.focusQuality || 0), 0) / weekMetrics.filter((m) => m.focusQuality).length
    : 5

  const avgStress = weekMetrics.filter((m) => m.stressLevel).length > 0
    ? weekMetrics.reduce((sum, m) => sum + (m.stressLevel || 0), 0) / weekMetrics.filter((m) => m.stressLevel).length
    : 5

  const weeklyWater = weekMetrics.reduce((sum, m) => sum + (m.waterIntake || 0), 0)
  const weeklyMovement = weekMetrics.reduce((sum, m) => sum + (m.movementMinutes || 0), 0)

  const medsAdherence = weekMetrics.filter((m) => m.medicationTaken).length > 0
    ? (weekMetrics.filter((m) => m.medicationTaken).length / weekMetrics.length) * 100
    : 0

  return {
    date: endDate,
    sleepHours: Math.round(sleepAvg * 10) / 10,
    medsAdherence: Math.round(medsAdherence),
    weeklyAverageWater: weeklyWater,
    weeklyMovement,
    avgMood: Math.round(avgMood * 10) / 10,
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    avgFocus: Math.round(avgFocus * 10) / 10,
    avgStress: Math.round(avgStress * 10) / 10,
  }
}

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateValue] = useState<HealthState>({
    metrics: [],
    lastLogged: undefined,
    streak: 0,
    thisWeekLogged: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedMetrics = localStorage.getItem('focusflow_health_metrics')
    if (savedMetrics) {
      const metrics = JSON.parse(savedMetrics) as HealthMetrics[]
      const streak = calculateStreak(metrics)
      const today = getTodayDate()
      const weekStart = getWeekStartDate(today)
      const thisWeekLogged = metrics.filter((m) => m.date >= weekStart && m.date <= today).length

      setStateValue({
        metrics,
        lastLogged: metrics.length > 0 ? metrics[metrics.length - 1].date : undefined,
        streak,
        thisWeekLogged,
      })
    }
  }, [])

  const logMetrics = (metrics: HealthMetrics) => {
    const updated = [...state.metrics, metrics]
    updated.sort((a, b) => a.date.localeCompare(b.date))
    setStateValue((prev) => ({
      ...prev,
      metrics: updated,
      lastLogged: metrics.date,
    }))
    localStorage.setItem('focusflow_health_metrics', JSON.stringify(updated))
  }

  const getMetricsForDate = (date: string): HealthMetrics | undefined => {
    return state.metrics.find((m) => m.date === date)
  }

  const getWeeklySummary = (endDate: string): HealthSummary => {
    return calculateWeeklySummary(state.metrics, endDate)
  }

  const updateStreak = () => {
    const streak = calculateStreak(state.metrics)
    setStateValue((prev) => ({
      ...prev,
      streak,
    }))
  }

  const contextValue: HealthContextType = {
    state,
    logMetrics,
    getMetricsForDate,
    getWeeklySummary,
    updateStreak,
  }

  if (!mounted) return null

  return <HealthContext.Provider value={contextValue}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const context = useContext(HealthContext)
  if (context === undefined) {
    throw new Error('useHealth must be used within HealthProvider')
  }
  return context
}
