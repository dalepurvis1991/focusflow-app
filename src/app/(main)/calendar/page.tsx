'use client'

import { useState } from 'react'
import { useCalendar } from '@/context/CalendarContext'
import { EventCard } from '@/components/EventCard'
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

  const getDayLabel = (date: string): string => {
    const offset = selectedDayOffset
    if (offset === 0) return 'Today'
    if (offset === 1) return 'Tomorrow'
    return getDayOfWeek(date).slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-navy px-4 pt-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <button
            onClick={() => setShowAddEvent(true)}
            className="p-3 rounded-lg bg-purple text-white hover:bg-purple-dark transition-colors active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400 uppercase">
              {formatDate(selectedDate)}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDayOffset(Math.max(selectedDayOffset - 1, 0))}
                disabled={selectedDayOffset === 0}
                className="p-2 rounded-lg hover:bg-navy-light disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              <button
                onClick={() => setSelectedDayOffset(selectedDayOffset + 1)}
                className="p-2 rounded-lg hover:bg-navy-light transition-colors"
              >
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekDates.map((date, index) => (
              <button
                key={date}
                onClick={() => setSelectedDayOffset(index)}
                className={`px-4 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedDayOffset === index
                    ? 'bg-purple text-white'
                    : 'bg-navy-light text-gray-300 hover:bg-navy-lighter'
                }`}
              >
                {getDayLabel(date)}
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
            <p className="text-gray-400 text-lg">No events scheduled for {getDayLabel(selectedDate).toLowerCase()}</p>
            <p className="text-gray-500 text-sm mt-2">Add one to stay organized</p>
          </div>
        )}

        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="w-full bg-navy-light rounded-t-3xl p-6 space-y-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-white">Add Event</h2>

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
                  <label className="text-sm text-gray-400 block mb-2">Start time</label>
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
                  <label className="text-sm text-gray-400 block mb-2">End time</label>
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
                <span className="text-gray-300">Set reminder</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 rounded-lg bg-navy-light text-white font-medium hover:bg-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-3 rounded-lg bg-purple text-white font-medium hover:bg-purple-dark transition-colors"
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
