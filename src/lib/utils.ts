export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const isAM = hour < 12
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${isAM ? 'AM' : 'PM'}`
  } catch {
    return time
  }
}

export function formatDate(date: string): string {
  try {
    const d = new Date(date + 'T00:00:00')
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`
  } catch {
    return date
  }
}

export function getDayOfWeek(date: string): string {
  const d = new Date(date + 'T00:00:00')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[d.getDay()]
}

export function getDateFromToday(daysOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function getGreeting(hour: number): string {
  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number)
  return { hours, minutes }
}

export function timeToMinutes(time: string): number {
  const { hours, minutes } = parseTime(time)
  return hours * 60 + minutes
}

export function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple text-white',
    amber: 'bg-amber text-white',
    green: 'bg-green-500 text-white',
    pink: 'bg-pink-500 text-white',
  }
  return colorMap[color] || 'bg-purple text-white'
}

export function getColorBorderClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500',
    purple: 'border-purple',
    amber: 'border-amber',
    green: 'border-green-500',
    pink: 'border-pink-500',
  }
  return colorMap[color] || 'border-purple'
}
