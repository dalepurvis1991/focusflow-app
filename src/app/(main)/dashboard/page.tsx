'use client'

import { useUser } from '@/context/UserContext'
import { useCalendar } from '@/context/CalendarContext'
import { useRouter } from 'next/navigation'
import { getGreeting, formatTime, getDateFromToday, getTodayDate } from '@/lib/utils'
import { EventCard } from '@/components/EventCard'
import { NudgeCard } from '@/components/NudgeCard'
import { QuickAction } from '@/components/QuickAction'
import { MessageCircle, Calendar, Flame } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, streak } = useUser()
  const { getUpcomingEvents } = useCalendar()

  const hour = new Date().getHours()
  const greeting = getGreeting(hour)

  const todayDate = getTodayDate()
  const upcomingEvents = getUpcomingEvents(1)
    .filter((e) => e.date === todayDate)
    .slice(0, 3)

  // AuthGuard in layout guarantees user and onboarding exist
  if (!user?.onboarding) return null

  const nextEvent = upcomingEvents[0]
  const nextEventTime = nextEvent ? formatTime(nextEvent.startTime) : null

  return (
    <div className="min-h-full px-4 pt-8 bg-[#0b1219]">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">
            {greeting}, <span className="text-[#136dec]">{user.onboarding.name}</span>
          </h1>
          <p className="text-slate-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {streak && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
            <Flame className="flex-shrink-0 text-yellow-500" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-lg text-slate-100">{streak.count} day streak!</p>
              <p className="text-sm text-yellow-500">Keep it up!</p>
            </div>
          </div>
        )}

        {nextEvent && (
          <div className="p-4 rounded-xl border-l-4 border-[#136dec] bg-slate-900 border border-slate-800">
            <p className="text-xs uppercase tracking-wider mb-1 text-slate-400 font-semibold">
              Next up
            </p>
            <h3 className="text-lg font-semibold text-slate-100">{nextEvent.title}</h3>
            <p className="text-sm mt-2 text-slate-400">
              {nextEventTime} {nextEvent.location && `• ${nextEvent.location}`}
            </p>
          </div>
        )}

        {upcomingEvents.length > 1 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
              Today's schedule
            </h2>
            {upcomingEvents.slice(1).map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        )}

        <NudgeCard
          type="water"
          title="You might be thirsty"
          description="You haven't had water in the last 2 hours. A quick sip can help with focus."
          actionLabel="Thanks!"
        />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              icon="📅"
              label="Add to Calendar"
              onClick={() => router.push('/calendar')}
            />
            <QuickAction
              icon="🤖"
              label="Talk to Assistant"
              onClick={() => router.push('/assistant')}
            />
            <QuickAction
              icon="📊"
              label="How am I doing?"
              onClick={() => {}}
              variant="secondary"
            />
            <QuickAction
              icon="🎯"
              label="Start Focus"
              onClick={() => {}}
              variant="secondary"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-center space-y-2">
          <p className="text-sm text-slate-400">
            💬 Everything feeling overwhelming? Talk to me anytime.
          </p>
          <Link
            href="/assistant"
            className="inline-block px-4 py-2 text-white rounded-lg font-semibold text-sm transition-colors bg-[#136dec] hover:bg-[#1058c7]"
          >
            Open Chat
          </Link>
        </div>
      </div>
    </div>
  )
}
