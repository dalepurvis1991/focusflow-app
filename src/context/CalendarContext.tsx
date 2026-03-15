'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Event } from '@/types/calendar'

interface CalendarContextType {
  events: Event[]
  addEvent: (event: Event) => void
  deleteEvent: (eventId: string) => void
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  getEventsForDate: (date: string) => Event[]
  getUpcomingEvents: (days: number) => Event[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Doctor Appointment',
    description: 'Annual check-up',
    startTime: '10:00',
    endTime: '11:00',
    date: new Date(2026, 2, 15).toISOString().split('T')[0],
    color: 'blue',
    hasReminder: true,
    reminderMinutes: 30,
    travelTimeMinutes: 15,
    location: 'City Medical Center',
  },
  {
    id: '2',
    title: 'Team Meeting',
    startTime: '14:00',
    endTime: '15:00',
    date: new Date(2026, 2, 15).toISOString().split('T')[0],
    color: 'purple',
    hasReminder: true,
    reminderMinutes: 15,
  },
  {
    id: '3',
    title: 'Lunch Break',
    startTime: '12:00',
    endTime: '13:00',
    date: new Date(2026, 2, 15).toISOString().split('T')[0],
    color: 'green',
    hasReminder: false,
    reminderMinutes: 0,
  },
  {
    id: '4',
    title: 'Project Deadline',
    startTime: '17:00',
    endTime: '17:30',
    date: new Date(2026, 2, 16).toISOString().split('T')[0],
    color: 'amber',
    hasReminder: true,
    reminderMinutes: 60,
  },
  {
    id: '5',
    title: 'Coffee with Alex',
    startTime: '15:30',
    endTime: '16:30',
    date: new Date(2026, 2, 17).toISOString().split('T')[0],
    color: 'pink',
    hasReminder: true,
    reminderMinutes: 30,
    location: 'Downtown Cafe',
  },
]

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedEvents = localStorage.getItem('focusflow_events')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents)
    localStorage.setItem('focusflow_events', JSON.stringify(newEvents))
  }

  const addEvent = (event: Event) => {
    const newEvents = [...events, event]
    saveEvents(newEvents)
  }

  const deleteEvent = (eventId: string) => {
    const newEvents = events.filter((e) => e.id !== eventId)
    saveEvents(newEvents)
  }

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    const newEvents = events.map((e) =>
      e.id === eventId ? { ...e, ...updates } : e
    )
    saveEvents(newEvents)
  }

  const getEventsForDate = (date: string): Event[] => {
    return events.filter((e) => e.date === date).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime)
    })
  }

  const getUpcomingEvents = (days: number): Event[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = events.filter((event) => {
      const eventDate = new Date(event.date)
      const daysFromNow =
        (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      return daysFromNow >= 0 && daysFromNow < days
    })

    return upcoming.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })
  }

  const contextValue: CalendarContextType = {
    events,
    addEvent,
    deleteEvent,
    updateEvent,
    getEventsForDate,
    getUpcomingEvents,
  }

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendar must be used within CalendarProvider')
  }
  return context
}
