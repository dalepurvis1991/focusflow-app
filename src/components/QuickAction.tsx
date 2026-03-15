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
    primary: 'bg-[#136dec] text-white hover:bg-[#1058c7]',
    secondary: 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700',
    outline: 'border-2 border-[#136dec] text-[#136dec]',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-6 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-semibold',
        variants[variant],
        className
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-sm text-center">{label}</span>
    </button>
  )
}
