'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { formatTime } from '@/lib/utils'
import { LogOut, Settings, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, clearUser, updatePreferences } = useUser()

  const handleLogout = () => {
    clearUser()
    router.push('/onboarding')
  }

  if (!user?.onboarding) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0b1219] px-4 pt-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-100">Profile</h1>

        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="w-16 h-16 rounded-full bg-[#136dec] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              {user.onboarding.name[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{user.onboarding.name}</h2>
            <p className="text-slate-400 text-sm mt-1">Age {user.onboarding.age}</p>
            <div className="mt-4 inline-block px-3 py-1 bg-[#136dec]/20 rounded-full border border-[#136dec]/30">
              <p className="text-sm font-semibold text-[#3b82f6] capitalize">
                {user.subscriptionTier} Tier
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
            Daily Routine
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
              <span className="text-slate-400">Wake time</span>
              <span className="font-semibold text-slate-100">
                {formatTime(user.onboarding.wakeTime)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
              <span className="text-slate-400">Work starts</span>
              <span className="font-semibold text-slate-100">
                {formatTime(user.onboarding.workStartTime)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
              <span className="text-slate-400">Work ends</span>
              <span className="font-semibold text-slate-100">
                {formatTime(user.onboarding.workEndTime)}
              </span>
            </div>
          </div>
        </div>

        {user.onboarding.takesAdhgMeds && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
              ADHD Medication
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
                <span className="text-slate-400">Medication time</span>
                <span className="font-semibold text-slate-100">
                  {formatTime(user.onboarding.medsTime || '')}
                </span>
              </div>
              {user.onboarding.medsName && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
                  <span className="text-slate-400">Type</span>
                  <span className="font-semibold text-slate-100">
                    {user.onboarding.medsName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide px-1">
            Preferences
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
              <span className="text-slate-400">Reminder frequency</span>
              <select
                value={user.preferences.reminderFrequency}
                onChange={(e) =>
                  updatePreferences({
                    reminderFrequency: e.target.value as 'high' | 'medium' | 'low',
                  })
                }
                className="bg-slate-900 border border-slate-700 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
              <span className="text-slate-400">Focus session duration</span>
              <select
                value={user.preferences.focusDuration}
                onChange={(e) =>
                  updatePreferences({
                    focusDuration: parseInt(e.target.value, 10),
                  })
                }
                className="bg-slate-900 border border-slate-700 text-white"
              >
                <option value="15">15 min</option>
                <option value="25">25 min</option>
                <option value="45">45 min</option>
              </select>
            </div>
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors">
              <span className="text-slate-400">Break reminders</span>
              <input
                type="checkbox"
                checked={user.preferences.breakRemindersEnabled}
                onChange={(e) =>
                  updatePreferences({ breakRemindersEnabled: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors">
              <span className="text-slate-400">Sound enabled</span>
              <input
                type="checkbox"
                checked={user.preferences.soundEnabled}
                onChange={(e) =>
                  updatePreferences({ soundEnabled: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide px-1">
            Account
          </h3>
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300"
          >
            <Settings size={20} />
            <span>Reset Onboarding</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 hover:bg-opacity-20 transition-colors text-red-400"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center text-sm text-slate-400">
          <p>FocusFlow v1.0</p>
          <p className="text-xs text-slate-500 mt-1">Your ADHD companion</p>
        </div>
      </div>
    </div>
  )
}
