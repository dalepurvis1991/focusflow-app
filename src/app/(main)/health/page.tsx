'use client'

import { useState, useEffect } from 'react'
import { useHealth } from '@/context/HealthContext'
import { FirstTimeGuide } from '@/components/FirstTimeGuide'
import { Heart, Moon, Droplets, Activity, Pill, TrendingUp } from 'lucide-react'
import { getTodayDate } from '@/lib/utils'

interface QuickCheckInStep {
  id: string
  label: string
  type: 'sleep' | 'water' | 'movement' | 'mood' | 'medication'
  icon: React.ReactNode
}

const QUICK_CHECKIN_STEPS: QuickCheckInStep[] = [
  { id: 'sleep', label: 'How did you sleep?', type: 'sleep', icon: <Moon size={20} /> },
  { id: 'water', label: 'Water today (glasses)', type: 'water', icon: <Droplets size={20} /> },
  { id: 'movement', label: 'Movement (minutes)', type: 'movement', icon: <Activity size={20} /> },
  { id: 'medication', label: 'Took meds?', type: 'medication', icon: <Pill size={20} /> },
  { id: 'mood', label: 'Mood check-in', type: 'mood', icon: <Heart size={20} /> },
]

export default function HealthPage() {
  const { state, logMetrics, getMetricsForDate, getWeeklySummary } = useHealth()
  const [currentStep, setCurrentStep] = useState(0)
  const [hasLoggedToday, setHasLoggedToday] = useState(false)
  const [formData, setFormData] = useState({
    sleepHours: '',
    sleepQuality: 'good' as 'poor' | 'fair' | 'good' | 'excellent',
    waterIntake: '',
    movementMinutes: '',
    medicationTaken: false,
    mood: 'neutral' as 'very low' | 'low' | 'neutral' | 'good' | 'excellent',
    energyLevel: 5,
    focusQuality: 5,
    stressLevel: 5,
  })

  const today = getTodayDate()

  useEffect(() => {
    const todayMetrics = getMetricsForDate(today)
    setHasLoggedToday(!!todayMetrics)
  }, [today, getMetricsForDate])

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitCheckIn = () => {
    const metrics = {
      date: today,
      sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : undefined,
      sleepQuality: formData.sleepQuality,
      waterIntake: formData.waterIntake ? parseInt(formData.waterIntake) : undefined,
      movementMinutes: formData.movementMinutes ? parseInt(formData.movementMinutes) : undefined,
      medicationTaken: formData.medicationTaken,
      mood: formData.mood,
      energyLevel: formData.energyLevel,
      focusQuality: formData.focusQuality,
      stressLevel: formData.stressLevel,
    }

    logMetrics(metrics)
    setHasLoggedToday(true)
    setCurrentStep(0)
    setFormData({
      sleepHours: '',
      sleepQuality: 'good',
      waterIntake: '',
      movementMinutes: '',
      medicationTaken: false,
      mood: 'neutral',
      energyLevel: 5,
      focusQuality: 5,
      stressLevel: 5,
    })
  }

  const handleNextStep = () => {
    if (currentStep < QUICK_CHECKIN_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmitCheckIn()
    }
  }

  const currentQuestion = QUICK_CHECKIN_STEPS[currentStep]
  const weeklySummary = getWeeklySummary(today)

  return (
    <div className="min-h-full px-4 pt-8 pb-24 bg-[#0b1219]">
      <FirstTimeGuide
        pageKey="health"
        title="Health & Wellness Tracking"
        tips={[
          "Quick check-ins take less than 30 seconds — designed for ADHD brains",
          'Track sleep, water, movement, meds, and mood to see patterns',
          'Weekly trends help you understand what helps your focus and well-being',
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">Health Check-In</h1>
          <p className="text-slate-400">Track what impacts your focus and well-being</p>
        </div>

        {!hasLoggedToday ? (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-xl bg-gradient-to-br from-rose-600/20 to-pink-600/20 border border-rose-500/30">
              <div className="flex items-start gap-3">
                <Heart className="text-rose-500 flex-shrink-0 mt-1" size={24} />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="font-semibold text-slate-100 text-lg">Quick Daily Check-In</p>
                    <p className="text-sm text-slate-300">Takes about 20 seconds per question</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 transition-all"
                          style={{ width: `${((currentStep + 1) / QUICK_CHECKIN_STEPS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 min-w-fit">
                        {currentStep + 1} of {QUICK_CHECKIN_STEPS.length}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl text-rose-500">{currentQuestion.icon}</div>
                        <label className="text-lg font-semibold text-slate-100">{currentQuestion.label}</label>
                      </div>

                      <div className="space-y-3">
                        {currentQuestion.type === 'sleep' && (
                          <div className="space-y-3">
                            <input
                              type="number"
                              inputMode="decimal"
                              step="0.5"
                              min="0"
                              max="24"
                              placeholder="Hours (e.g., 7.5)"
                              value={formData.sleepHours}
                              onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                            <div className="space-y-2">
                              <p className="text-xs text-slate-400">Quality:</p>
                              <div className="flex gap-2">
                                {(['poor', 'fair', 'good', 'excellent'] as const).map((quality) => (
                                  <button
                                    key={quality}
                                    onClick={() => handleInputChange('sleepQuality', quality)}
                                    className={`flex-1 px-2 py-2 text-xs rounded transition-all ${
                                      formData.sleepQuality === quality
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                                  >
                                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {currentQuestion.type === 'water' && (
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max="20"
                            placeholder="Number of glasses"
                            value={formData.waterIntake}
                            onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        )}

                        {currentQuestion.type === 'movement' && (
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max="600"
                            placeholder="Minutes (e.g., 30)"
                            value={formData.movementMinutes}
                            onChange={(e) => handleInputChange('movementMinutes', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        )}

                        {currentQuestion.type === 'medication' && (
                          <button
                            onClick={() => handleInputChange('medicationTaken', !formData.medicationTaken)}
                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                              formData.medicationTaken
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {formData.medicationTaken ? '✓ Yes, took meds' : 'No meds today'}
                          </button>
                        )}

                        {currentQuestion.type === 'mood' && (
                          <div className="flex gap-2">
                            {(['very low', 'low', 'neutral', 'good', 'excellent'] as const).map((mood) => (
                              <button
                                key={mood}
                                onClick={() => handleInputChange('mood', mood)}
                                className={`flex-1 px-2 py-2 text-xs rounded transition-all ${
                                  formData.mood === mood
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {mood === 'very low' ? '😞' : mood === 'low' ? '😐' : mood === 'neutral' ? '😌' : mood === 'good' ? '🙂' : '😄'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full px-4 py-3 rounded-lg font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    >
                      {currentStep === QUICK_CHECKIN_STEPS.length - 1 ? 'Save Check-In' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-center space-y-2">
            <p className="text-green-400 font-semibold">✓ Logged for today!</p>
            <p className="text-sm text-slate-400">Come back tomorrow to track your progress</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp size={20} className="text-slate-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">This Week's Summary</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Sleep Avg</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.sleepHours || '—'}</p>
              <p className="text-xs text-slate-500">hours/night</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Medication</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.medsAdherence}%</p>
              <p className="text-xs text-slate-500">adherence</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Water</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.weeklyAverageWater}</p>
              <p className="text-xs text-slate-500">glasses/week</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Movement</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.weeklyMovement}</p>
              <p className="text-xs text-slate-500">minutes/week</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Energy</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.avgEnergy.toFixed(1)}/10</p>
              <p className="text-xs text-slate-500">average</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Focus</p>
              <p className="text-2xl font-bold text-slate-100">{weeklySummary.avgFocus.toFixed(1)}/10</p>
              <p className="text-xs text-slate-500">quality</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold text-slate-100">{state.streak} day streak</p>
                  <p className="text-xs text-slate-400">{state.thisWeekLogged} days logged this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
