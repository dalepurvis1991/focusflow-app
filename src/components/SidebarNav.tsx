'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageCircle, Calendar, User, LogOut, Sun, Moon, CheckCircle2, Trophy, Heart } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { cn } from '@/lib/utils'

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
    { href: '/health', label: 'Health', icon: Heart },
    { href: '/rewards', label: 'Rewards', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#136dec] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100">FocusFlow</h1>
            <p className="text-xs text-slate-400">Your ADHD co-pilot</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm font-medium text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email || 'No email'}</p>
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
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                active
                  ? "text-[#136dec] bg-[#136dec]/10"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-800 px-4 py-4 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
