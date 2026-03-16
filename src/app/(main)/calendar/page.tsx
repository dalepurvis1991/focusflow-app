'use client'

import { useState } from 'react'
import { useCalendar } from '@/context/CalendarContext'
import { EventCard } from '@/components/EventCard'
import { FirstTimeGuide } from '@/components/FirstTimeGuide'
import { getTodayDate, getDateFromToday, getDayOfWeek, formatDate } from '@/lib/utils'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Event } from '@/types/calendar'

export default function CalendarPage() {
  const { getEventsForDate } = useCalendar()
  const [selectedDayOffset, setSelectedDayOffset] = useState(0)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    startTime: '10:00',
    endTime: '11:00',
    color: 'blue',
    hasReminder: true,
    reminderMinutes: 15,
  })

  const selectedDate = getDateFromToday(selectedDayOffset)
  const dayEvents = getEventsForDate(selectedDate)

  const weekDates = Array.from({ length: 7 }).map((_, i) => getDateFromToday(i))

  const getDayLabel = (date: string, dayOffset: number): string => {
    if (dayOffset === 0) return 'Today'
    if (dayOffset === 1) return 'Tomorrow'
    return getDayOfWeek(date).slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-[#0b1219] px-4 pt-6 pb-24">
      <FirstTimeGuide
        pageKey="calendar"
        title="Your schedule"
        tips={[
          "Tap the day buttons to see different days, or use the arrows to navigate",
          "Hit the + button to add new events",
          "Your AI assistant can also add events for you — just ask",
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Calendar</h1>
          <button
            onClick={() => setShowAddEvent(true)}
            className="p-3 rounded-lg bg-[#136dec] text-white hover:bg-[#1058c7] transition-colors active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {formatDate(selectedDate)}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDayOffset(Math.max(selectedDayOffset - 1, 0))}
                disabled={selectedDayOffset === 0}
                className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-slate-400" />
              </button>
              <button
                onClick={() => setSelectedDayOffset(selectedDayOffset + 1)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekDates.map((date, index) => (
              <button
                key={date}
                onClick={() => setSelectedDayOffset(index)}
                className={`px-4 py-3 rounded-lg whitespace-nowrap font-semibold transition-all ${
                  selectedDayOffset === index
                    ? 'bg-[#136dec] text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {getDayLabel(date, index)}
              </button>
            ))}
          </div>
        </div>

        {dayEvents.length > 0 ? (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-slate-400 text-lg">No events scheduled for {getDayLabel(selectedDate, selectedDayOffset).toLowerCase()}</p>
            <p className="text-slate-500 text-sm mt-2">Add one to stay organized</p>
          </div>
        )}

        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="w-full bg-slate-900 rounded-t-3xl p-6 space-y-4 max-w-2xl mx-auto border-t border-slate-800">
              <h2 className="text-xl font-bold text-slate-100">Add Event</h2>

              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title || ''}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="w-full"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Start time</label>
                  <input
                    type="time"
                    value={newEvent.startTime || '10:00'}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">End time</label>
                  <input
                    type="time"
                    value={newEvent.endTime || '11:00'}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newEvent.hasReminder || false}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, hasReminder: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Set reminder</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 rounded-lg bg-[#136dec] text-white font-semibold hover:bg-[#1058c7] transition-colors"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
