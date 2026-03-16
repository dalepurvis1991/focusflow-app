'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
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
    } else if (!user?.onboarding?.completedAt) {
      router.push('/onboarding')
    }
  }, [mounted, isLoggedIn, user, router])

  if (!mounted || !isLoggedIn || !user?.onboarding?.completedAt) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#0b1219]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#136dec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
