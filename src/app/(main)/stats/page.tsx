'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useCalendar } from '@/context/CalendarContext'
import { FirstTimeGuide } from '@/components/FirstTimeGuide'
import { ChevronLeft, Flame, Clock, Calendar, Heart, Pill } from 'lucide-react'
import { getTodayDate } from '@/lib/utils'

export default function StatsPage() {
  const router = useRouter()
  const { user, streak } = useUser()
  const { getEventsForDate } = useCalendar()

  const [focusSessionsToday, setFocusSessionsToday] = useState(0)
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0)

  useEffect(() => {
    // Get focus sessions completed today
    const today = getTodayDate()
    const stored = localStorage.getItem(`focusflow_sessions_${today}`)
    setFocusSessionsToday(stored ? parseInt(stored) : 0)

    // Get upcoming events for today
    const todayEvents = getEventsForDate(today)
    setUpcomingEventsCount(todayEvents.length)
  }, [])

  if (!user) return null

  const streakCount = streak?.count || 0
  const takesAdhgMeds = user.onboarding?.takesAdhgMeds
  const medsName = user.onboarding?.medsName
  const medsTime = user.onboarding?.medsTime

  // Determine mood message based on activity
  const getMoodMessage = () => {
    const totalActivity = focusSessionsToday + upcomingEventsCount
    const streakBonus = streakCount > 0 ? streakCount : 0

    if (streakCount >= 7 && focusSessionsToday >= 2) {
      return {
        emoji: '🌟',
        message: "You're crushing it!",
        subtext: 'You have an amazing streak and focus sessions today.',
      }
    } else if (focusSessionsToday >= 2) {
      return {
        emoji: '🚀',
        message: "You're on fire!",
        subtext: 'Great focus sessions completed today.',
      }
    } else if (streakCount > 0) {
      return {
        emoji: '🔥',
        message: 'Keep that streak alive!',
        subtext: `You're ${streakCount} days in. You got this!`,
      }
    } else if (upcomingEventsCount > 0) {
      return {
        emoji: '💪',
        message: 'You have a full day ahead!',
        subtext: 'Stay organized and take breaks when you need them.',
      }
    } else {
      return {
        emoji: '😊',
        message: 'You matter.',
        subtext: 'Every small step counts. Be kind to yourself.',
      }
    }
  }

  const mood = getMoodMessage()

  return (
    <div className="min-h-full bg-[#0b1219] px-4 pt-6 pb-28">
      <FirstTimeGuide
        pageKey="stats"
        title="How you're doing"
        tips={[
          "See your streak, focus sessions, and upcoming events at a glance",
          "This page is about celebrating progress, not pressure",
          "Keep showing up — that's what matters most",
        ]}
      />
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-100">How Am I Doing?</h1>
          <div className="w-16" />
        </div>

        {/* Mood Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#136dec]/20 to-slate-900 border border-[#136dec]/30 text-center space-y-3">
          <div className="text-5xl">{mood.emoji}</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{mood.message}</h2>
            <p className="text-slate-400 mt-2">{mood.subtext}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
            Today's Stats
          </h2>

          {/* Streak Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Flame size={24} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">Current Streak</p>
                <p className="text-2xl font-bold text-slate-100">{streakCount} days</p>
              </div>
            </div>
            {streakCount > 0 && (
              <p className="text-xs text-yellow-500 pl-15">
                Keep it up! You're building momentum.
              </p>
            )}
          </div>

          {/* Focus Sessions Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#136dec]/20">
                <Clock size={24} className="text-[#136dec]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">Focus Sessions Today</p>
                <p className="text-2xl font-bold text-slate-100">
                  {focusSessionsToday}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 pl-15">
              {focusSessionsToday === 0
                ? 'Start a focus session to build momentum'
                : `Great work! You've had ${focusSessionsToday} focused session${
                    focusSessionsToday !== 1 ? 's' : ''
                  } today.`}
            </div>
          </div>

          {/* Calendar Events Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Calendar size={24} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">Events Today</p>
                <p className="text-2xl font-bold text-slate-100">
                  {upcomingEventsCount}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 pl-15">
              {upcomingEventsCount === 0
                ? 'No events scheduled. Perfect for deep work!'
                : `You have ${upcomingEventsCount} event${
                    upcomingEventsCount !== 1 ? 's' : ''
                  } today.`}
            </div>
          </div>

          {/* Medication Reminder Card */}
          {takesAdhgMeds && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <Pill size={24} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Medication Reminder</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {medsName || 'Your medication'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-400 pl-15">
                Scheduled for {medsTime || 'morning'}. Don't forget to take it!
              </div>
            </div>
          )}

          {/* Mental Health Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-500/20">
                <Heart size={24} className="text-pink-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">Mental Health Check</p>
                <p className="text-sm text-slate-300 font-semibold mt-1">
                  You're doing your best
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 pl-15">
              ADHD is not laziness. You're making efforts that matter, even if
              they're small.
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
            What's Next?
          </h2>

          <button
            onClick={() => router.push('/focus')}
            className="w-full p-4 rounded-xl bg-[#136dec]/10 border border-[#136dec]/30 hover:bg-[#136dec]/20 transition-colors text-left space-y-2"
          >
            <p className="font-semibold text-slate-100">Start a Focus Session</p>
            <p className="text-sm text-slate-400">
              Dedicated time to tackle one task
            </p>
          </button>

          <button
            onClick={() => router.push('/calendar')}
            className="w-full p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors text-left space-y-2"
          >
            <p className="font-semibold text-slate-100">Check Your Calendar</p>
            <p className="text-sm text-slate-400">
              Stay organized for the day ahead
            </p>
          </button>

          <button
            onClick={() => router.push('/assistant')}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-left space-y-2"
          >
            <p className="font-semibold text-slate-100">Talk to Assistant</p>
            <p className="text-sm text-slate-400">
              Chat about your day or get support
            </p>
          </button>
        </div>

        {/* Encouraging Note */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
          <p className="text-sm text-slate-300">
            Remember: Progress over perfection. You're doing better than you
            think.
          </p>
        </div>
      </div>
    </div>
  )
}
