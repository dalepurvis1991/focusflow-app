import { Event } from '@/types/calendar'
import { formatTime, getColorClass, getColorBorderClass } from '@/lib/utils'
import { MapPin, Clock, Bell } from 'lucide-react'

interface EventCardProps {
  event: Event
  compact?: boolean
  onClick?: () => void
}

export function EventCard({ event, compact = false, onClick }: EventCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left p-3 rounded-lg bg-navy-light hover:bg-navy-lighter transition-colors animate-slide-up"
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-1 h-12 rounded-full ${getColorBorderClass(event.color)}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {event.title}
            </h3>
            <p className="text-xs text-gray-400">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all ${getColorClass(
        event.color
      )} ${getColorBorderClass(event.color)} bg-opacity-10 hover:bg-opacity-20 animate-slide-up`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-base flex-1">{event.title}</h3>
        {event.hasReminder && <Bell size={16} className="flex-shrink-0 ml-2" />}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock size={14} />
          <span>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>

        {event.travelTimeMinutes && (
          <div className="text-xs text-gray-400 bg-black bg-opacity-20 rounded px-2 py-1 inline-block">
            Travel time: {event.travelTimeMinutes} min
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-gray-300 mt-2">{event.description}</p>
        )}
      </div>
    </button>
  )
}
