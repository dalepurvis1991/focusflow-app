'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { ChevronLeft, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type TimerState = 'idle' | 'focusing' | 'break' | 'finished'

export default function FocusPage() {
  const router = useRouter()
  const { user } = useUser()

  const focusDuration = user?.preferences?.focusDuration || 25
  const breakDuration = user?.preferences?.breakDuration || 5
  const soundEnabled = user?.preferences?.soundEnabled ?? true

  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60)
  const [sessionCount, setSessionCount] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  // Get focus sessions completed today from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem(`focusflow_sessions_${today}`)
    setSessionsCompleted(stored ? parseInt(stored) : 0)
  }, [])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1)
      }, 1000)
    } else if (secondsLeft === 0 && isRunning) {
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, secondsLeft])

  const handleTimerComplete = () => {
    if (soundEnabled) {
      playNotificationSound()
    }

    if (timerState === 'focusing') {
      // Completed a focus session
      const today = new Date().toISOString().split('T')[0]
      const newCount = sessionsCompleted + 1
      localStorage.setItem(`focusflow_sessions_${today}`, newCount.toString())
      setSessionsCompleted(newCount)

      // Switch to break
      setTimerState('break')
      setSecondsLeft(breakDuration * 60)
      setIsRunning(false)
    } else if (timerState === 'break') {
      // Break is over, start next focus session
      setSessionCount(sessionCount + 1)
      setTimerState('focusing')
      setSecondsLeft(focusDuration * 60)
      setIsRunning(false)
    }
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      // Fallback: vibration
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
    }
  }

  const handleStart = () => {
    if (timerState === 'idle') {
      setTimerState('focusing')
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimerState('idle')
    setSecondsLeft(focusDuration * 60)
    setSessionCount(1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const totalSeconds =
    timerState === 'break' ? breakDuration * 60 : focusDuration * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  const messages = {
    idle: ["Ready to focus?", "Let's get started!"],
    focusing: ["You're doing great!", "Stay focused!", "Almost there!", "Keep going!"],
    break: ["You earned this!", "Recharge your batteries!", "Great work!"],
  }

  const getMessage = () => {
    const msgs =
      messages[timerState as keyof typeof messages] || messages.idle
    return msgs[Math.floor(Math.random() * msgs.length)]
  }

  return (
    <div className="min-h-full bg-[#0b1219] px-4 pt-6 pb-28">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-100">Focus Timer</h1>
          <div className="w-16" />
        </div>

        {/* Session Counter */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400 uppercase tracking-wide">
            {timerState === 'break' ? 'Break Time' : `Focus Session ${sessionCount}`}
          </p>
          <p className="text-xs text-slate-500">
            {sessionsCompleted} completed today
          </p>
        </div>

        {/* Large Timer Display */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Progress ring background */}
            <svg
              className="absolute w-full h-full -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(progress / 100) * 565.48} 565.48`}
                className={cn(
                  'text-[#136dec] transition-all duration-300',
                  timerState === 'break' && 'text-green-500',
                  timerState === 'idle' && 'text-slate-600'
                )}
              />
            </svg>

            {/* Time display */}
            <div className="text-center z-10">
              <div className="text-7xl font-bold text-slate-100 font-mono">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                {timerState === 'break' ? 'Break' : 'Focus'}
              </div>
            </div>
          </div>

          {/* Encouragement message */}
          <p className="text-center text-lg text-slate-300 italic">
            {getMessage()}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-[#136dec] text-white rounded-xl font-semibold hover:bg-[#1058c7] transition-colors active:scale-95"
            >
              <Play size={20} />
              {timerState === 'idle' ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors active:scale-95"
            >
              <Pause size={20} />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-4 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 transition-colors active:scale-95"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        {/* Settings Info */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-sm font-semibold text-slate-300">Your Settings</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Focus Duration</p>
              <p className="text-slate-100 font-semibold">{focusDuration} min</p>
            </div>
            <div>
              <p className="text-slate-400">Break Duration</p>
              <p className="text-slate-100 font-semibold">{breakDuration} min</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="w-full text-center text-sm text-[#136dec] hover:text-[#1058c7] transition-colors font-semibold mt-2"
          >
            Update settings in Profile
          </button>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 text-sm">
          <p className="text-slate-300 font-semibold">💡 Focus Tips</p>
          <ul className="text-slate-400 space-y-1 text-xs">
            <li>• Put your phone in another room</li>
            <li>• Close unnecessary browser tabs</li>
            <li>• Let others know you're focusing</li>
            <li>• Start with small tasks</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
