'use client'

import { useRouter } from 'next/navigation'
import { useRewards } from '@/context/RewardsContext'
import { useUser } from '@/context/UserContext'
import { FirstTimeGuide } from '@/components/FirstTimeGuide'
import { ChevronLeft, Copy, Check, Trophy, Flame, Zap } from 'lucide-react'
import { useState } from 'react'

export default function RewardsPage() {
  const router = useRouter()
  const { state } = useRewards()
  const { user } = useUser()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCode = (code: string, rewardId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(rewardId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!user?.onboarding) return null

  // Calculate progress toward next milestones
  const pointsTo100 = Math.max(0, 100 - state.weeklyPoints)
  const pointsTo500 = Math.max(0, 500 - state.totalPoints)
  const daysTo7 = Math.max(0, 7 - state.currentStreak)
  const daysTo14 = Math.max(0, 14 - state.currentStreak)
  const daysTo30 = Math.max(0, 30 - state.currentStreak)

  const earnedBadges = state.badges.filter((b) => b.earnedAt !== null)
  const unearnedBadges = state.badges.filter((b) => b.earnedAt === null)

  return (
    <div className="min-h-full bg-[#0b1219] px-4 pt-6 pb-28">
      <FirstTimeGuide
        pageKey="rewards"
        title="Your rewards and badges"
        tips={[
          "Earn Focus Points by using the app daily and completing focus sessions",
          "Reach milestones to unlock badges and exclusive rewards",
          "Your streak is key to earning bonus points",
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-100">Rewards</h1>
          <div className="w-16" />
        </div>

        {/* Focus Points Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-yellow-500/30">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-yellow-300 uppercase tracking-wide font-semibold">
                Total Focus Points
              </p>
              <div className="text-4xl font-bold text-yellow-300">{state.totalPoints}</div>
              <p className="text-sm text-yellow-200">
                {state.weeklyPoints} this week
              </p>
            </div>
            <div className="text-5xl">⭐</div>
          </div>

          {/* Weekly progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-200">Weekly goal: 100 FP</span>
              <span className="text-yellow-300 font-semibold">
                {state.weeklyPoints}/100
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (state.weeklyPoints / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-orange-300 uppercase tracking-wide font-semibold">
                Current Streak
              </p>
              <div className="text-4xl font-bold text-orange-300">{state.currentStreak} days</div>
              <p className="text-sm text-orange-200">
                +{state.currentStreak * 5} FP/day bonus
              </p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
            Milestones
          </h2>

          {/* 7-day streak */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-semibold text-slate-100">Getting Started</p>
                  <p className="text-xs text-slate-400">7-day streak</p>
                </div>
              </div>
              {state.currentStreak >= 7 ? (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Earned
                </span>
              ) : (
                <span className="text-xs text-slate-400">{daysTo7} days left</span>
              )}
            </div>
            {state.currentStreak < 7 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${(state.currentStreak / 7) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* 14-day streak */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold text-slate-100">Building Momentum</p>
                  <p className="text-xs text-slate-400">14-day streak</p>
                </div>
              </div>
              {state.currentStreak >= 14 ? (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Earned
                </span>
              ) : (
                <span className="text-xs text-slate-400">{daysTo14} days left</span>
              )}
            </div>
            {state.currentStreak < 14 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${(state.currentStreak / 14) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* 30-day streak */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <p className="font-semibold text-slate-100">Monthly Champion</p>
                  <p className="text-xs text-slate-400">30-day streak + 1 month half price</p>
                </div>
              </div>
              {state.currentStreak >= 30 ? (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Earned
                </span>
              ) : (
                <span className="text-xs text-slate-400">{daysTo30} days left</span>
              )}
            </div>
            {state.currentStreak < 30 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-pink-500 h-full transition-all duration-500"
                  style={{ width: `${(state.currentStreak / 30) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* 100 points in a week */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold text-slate-100">Focus Master</p>
                  <p className="text-xs text-slate-400">100 FP in a week</p>
                </div>
              </div>
              {state.weeklyPoints >= 100 ? (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Earned
                </span>
              ) : (
                <span className="text-xs text-slate-400">{pointsTo100} FP left</span>
              )}
            </div>
            {state.weeklyPoints < 100 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${(state.weeklyPoints / 100) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* 500 total points */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="font-semibold text-slate-100">Dedicated</p>
                  <p className="text-xs text-slate-400">500 total FP</p>
                </div>
              </div>
              {state.totalPoints >= 500 ? (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Earned
                </span>
              ) : (
                <span className="text-xs text-slate-400">{pointsTo500} FP left</span>
              )}
            </div>
            {state.totalPoints < 500 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${(state.totalPoints / 500) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
            Badges ({earnedBadges.length}/{state.badges.length})
          </h2>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-2 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="text-3xl">{badge.emoji}</div>
                  <div>
                    <p className="font-semibold text-slate-100 text-sm">{badge.name}</p>
                    <p className="text-xs text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Unearned Badges */}
          {unearnedBadges.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Locked Badges</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {unearnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-2 opacity-50"
                  >
                    <div className="text-3xl">❓</div>
                    <div>
                      <p className="font-semibold text-slate-400 text-sm">Locked</p>
                      <p className="text-xs text-slate-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Rewards Section */}
        {state.rewards.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider px-1 text-slate-400">
              Active Rewards
            </h2>

            {state.rewards.map((reward) => {
              const isExpired = reward.expiresAt < Date.now()
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isExpired
                      ? 'bg-slate-900/50 border-slate-800 opacity-50'
                      : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30'
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-100">{reward.name}</p>
                      <p className="text-sm text-slate-400">{reward.description}</p>
                      {isExpired && (
                        <p className="text-xs text-red-400 mt-1">Expired</p>
                      )}
                    </div>

                    {!isExpired && (
                      <button
                        onClick={() => handleCopyCode(reward.code, reward.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-100 text-sm font-mono"
                      >
                        <span>{reward.code}</span>
                        {copiedId === reward.id ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Encouragement */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
          <p className="text-sm text-slate-300">
            Keep using FocusFlow daily to earn more rewards and unlock all badges!
          </p>
        </div>
      </div>
    </div>
  )
}
