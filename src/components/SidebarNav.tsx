'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageCircle, Calendar, User, LogOut, Sun, Moon, CheckCircle2 } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, theme, toggleTheme, logout } = useUser()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Logo */}
      <div className="px-6 py-8 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: 'var(--text)' }}>FocusFlow</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Your ADHD co-pilot</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email || 'No email'}</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text)'
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t px-4 py-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)'
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          style={{
            color: '#ef4444',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
