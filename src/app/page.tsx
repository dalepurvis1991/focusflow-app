'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useEffect, useState } from 'react'

export default function RootPage() {
  const router = useRouter()
  const { user, isLoggedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isLoggedIn) {
      router.push('/login')
    } else if (user?.onboarding?.completedAt) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  }, [isLoggedIn, user, router, mounted])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading FocusFlow...</p>
      </div>
    </div>
  )
}
