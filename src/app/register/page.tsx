'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Name is required')
      return false
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!validateForm()) {
        return
      }

      const success = register(email, password, name)
      if (success) {
        router.push('/onboarding')
      } else {
        setError('Email already registered')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, text: '', color: '' }
    if (password.length < 6) return { level: 1, text: 'Weak', color: '#ef4444' }
    if (password.length < 10) return { level: 2, text: 'Fair', color: '#f59e0b' }
    return { level: 3, text: 'Strong', color: '#22c55e' }
  })()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b1219]">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#136dec] flex items-center justify-center">
              <CheckCircle2 size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100">FocusFlow</h1>
          </div>
          <p className="text-lg text-slate-400">Your ADHD co-pilot</p>
        </div>

        {/* Register Card */}
        <div className="rounded-xl p-8 shadow-lg border bg-slate-900 border-slate-800">
          <h2 className="text-2xl font-bold mb-2 text-slate-100">Get Started</h2>
          <p className="mb-6 text-slate-400">Create your FocusFlow account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-400">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-[#136dec] focus:ring-offset-0 bg-[#0b1219] text-slate-100"
                style={{
                  borderColor: error.includes('Name') ? '#ef4444' : '#334155',
                }}
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-[#136dec] focus:ring-offset-0 bg-[#0b1219] text-slate-100"
                style={{
                  borderColor: error.includes('email') || error.includes('Email') ? '#ef4444' : '#334155',
                }}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-400">
                  Password
                </label>
                {password && (
                  <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-[#136dec] focus:ring-offset-0 pr-12 bg-[#0b1219] text-slate-100"
                  style={{
                    borderColor: error.includes('Password') || error.includes('Passwords') ? '#ef4444' : '#334155',
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 h-1 w-full rounded-full overflow-hidden bg-slate-800">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength.level / 3) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-[#136dec] focus:ring-offset-0 pr-12 bg-[#0b1219] text-slate-100"
                  style={{
                    borderColor: error.includes('Passwords') ? '#ef4444' : '#334155',
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg flex items-start gap-3 bg-red-500/10 border border-red-500">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold transition-all text-white flex items-center justify-center gap-2 hover:shadow-lg"
              style={{
                backgroundColor: isLoading ? '#2563eb' : '#136dec',
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            href="/login"
            className="w-full py-3 rounded-lg font-semibold transition-all text-center border-2 text-[#136dec] border-[#136dec] hover:bg-[#136dec]/10"
          >
            Sign In
          </Link>
        </div>

        {/* Terms Notice */}
        <p className="text-xs text-center mt-6 text-slate-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
