'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email')
        return
      }

      const success = login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } finally {
      setIsLoading(false)
    }
  }

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

        {/* Login Card */}
        <div className="rounded-xl p-8 shadow-lg border bg-slate-900 border-slate-800">
          <h2 className="text-2xl font-bold mb-2 text-slate-100">Welcome Back</h2>
          <p className="mb-6 text-slate-400">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  borderColor: error ? '#ef4444' : '#334155',
                }}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-[#136dec] focus:ring-offset-0 pr-12 bg-[#0b1219] text-slate-100"
                  style={{
                    borderColor: error ? '#ef4444' : '#334155',
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500">
                <p className="text-sm text-red-500 font-medium">{error}</p>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
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
                New to FocusFlow?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/register"
            className="w-full py-3 rounded-lg font-semibold transition-all text-center border-2 text-[#136dec] border-[#136dec] hover:bg-[#136dec]/10"
          >
            Create Account
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg border bg-[#0b1219] border-[#136dec]">
          <p className="text-xs font-medium mb-2 text-[#136dec]">💡 Demo Account</p>
          <p className="text-xs text-slate-400">
            Email: <span className="text-slate-100">demo@focusflow.app</span>
          </p>
          <p className="text-xs text-slate-400">
            Password: <span className="text-slate-100">demo123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
