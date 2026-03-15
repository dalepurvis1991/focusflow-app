'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/' || href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/assistant', label: 'Assistant', icon: MessageCircle },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t z-40" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-2xl mx-auto px-4 flex justify-around items-center h-20 safe-bottom">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 min-h-0"
              style={{
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
