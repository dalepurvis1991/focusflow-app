import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface QuickActionProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  className?: string
}

export function QuickAction({
  icon,
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}: QuickActionProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-purple to-purple-dark text-white',
    secondary: 'bg-navy-light text-white border border-navy-lighter',
    outline: 'border-2 border-purple text-purple',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-6 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-sm font-semibold text-center">{label}</span>
    </button>
  )
}
