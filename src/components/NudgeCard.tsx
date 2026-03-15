import { AlertCircle, Heart, Zap, Cup } from 'lucide-react'
import { ReactNode } from 'react'

interface NudgeCardProps {
  type: 'water' | 'break' | 'movement' | 'breathing'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function NudgeCard({
  type,
  title,
  description,
  actionLabel = 'Got it',
  onAction,
  icon,
}: NudgeCardProps) {
  const getIcon = () => {
    if (icon) return icon
    switch (type) {
      case 'water':
        return <Cup size={24} className="text-blue-400" />
      case 'break':
        return <AlertCircle size={24} className="text-amber-400" />
      case 'movement':
        return <Zap size={24} className="text-green-400" />
      case 'breathing':
        return <Heart size={24} className="text-pink-400" />
      default:
        return <AlertCircle size={24} className="text-gray-400" />
    }
  }

  const getBackgroundClass = () => {
    switch (type) {
      case 'water':
        return 'bg-blue-500 bg-opacity-10 border-blue-500'
      case 'break':
        return 'bg-amber-500 bg-opacity-10 border-amber'
      case 'movement':
        return 'bg-green-500 bg-opacity-10 border-green-500'
      case 'breathing':
        return 'bg-pink-500 bg-opacity-10 border-pink-500'
      default:
        return 'bg-gray-500 bg-opacity-10 border-gray-500'
    }
  }

  return (
    <div
      className={`p-4 rounded-xl border-2 ${getBackgroundClass()} animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
          <p className="text-slate-300 text-sm mb-4">{description}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
