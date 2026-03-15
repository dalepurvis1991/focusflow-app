export interface Event {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  date: string
  color: 'blue' | 'purple' | 'amber' | 'green' | 'pink'
  hasReminder: boolean
  reminderMinutes: number
  travelTimeMinutes?: number
  location?: string
  isCompleted?: boolean
}

export interface Reminder {
  id: string
  eventId: string
  minutesBefore: number
  sent: boolean
  sentAt?: number
}

export interface TravelTime {
  id: string
  eventId: string
  durationMinutes: number
}

export interface CalendarDay {
  date: string
  events: Event[]
}
