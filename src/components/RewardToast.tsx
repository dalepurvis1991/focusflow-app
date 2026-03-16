'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/types/rewards'
import { cn } from '@/lib/utils'

interface RewardToastProps {
  type: 'points' | 'badge'
  value?: number
  badge?: Badge
  isVisible: boolean
  onDismiss: () => void
}

export function RewardToast({
  type,
  value,
  badge,
  isVisible,
  onDismiss,
}: RewardToastProps) {
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setAnimateOut(false)
      const timer = setTimeout(() => {
        setAnimateOut(true)
        setTimeout(() => {
          onDismiss()
        }, 300)
      }, 3000)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [isVisible, onDismiss])

  if (!isVisible) return null

  if (type === 'points') {
    return (
      <div
        className={cn(
          'fixed top-6 left-1/2 transform -translate-x-1/2 z-50',
          'transition-all duration-300',
          animateOut
            ? 'opacity-0 translate-y-[-20px]'
            : 'opacity-100 translate-y-0'
        )}
      >
        <div className="px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 shadow-2xl border border-yellow-500/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-white font-bold text-lg">+{value} FP</p>
              <p className="text-amber-100 text-xs">Focus Points earned!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'badge' && badge) {
    return (
      <div
        className={cn(
          'fixed top-6 left-1/2 transform -translate-x-1/2 z-50',
          'transition-all duration-300',
          animateOut
            ? 'opacity-0 translate-y-[-20px]'
            : 'opacity-100 translate-y-0'
        )}
      >
        <div className="px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl border border-pink-500/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">{badge.emoji}</span>
            <div>
              <p className="text-white font-bold text-lg">Badge Unlocked!</p>
              <p className="text-purple-100 text-sm">{badge.name}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
