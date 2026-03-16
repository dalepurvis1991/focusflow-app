'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { OnboardingStep } from '@/components/OnboardingStep'
import { OnboardingData, User } from '@/types/user'
import { generateId } from '@/lib/utils'

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    wakeTime: '07:00',
    workStartTime: '09:00',
    workEndTime: '17:00',
    takesAdhgMeds: false,
    medsTime: '08:00',
    medsName: '',
    notificationsEnabled: true,
  })

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = () => {
    const onboardingData: OnboardingData = {
      name: formData.name,
      age: parseInt(formData.age, 10),
      wakeTime: formData.wakeTime,
      workStartTime: formData.workStartTime,
      workEndTime: formData.workEndTime,
      takesAdhgMeds: formData.takesAdhgMeds,
      medsTime: formData.medsTime,
      medsName: formData.medsName,
      notificationsEnabled: formData.notificationsEnabled,
      completedAt: Date.now(),
    }

    const newUser: User = {
      id: generateId(),
      name: formData.name,
      age: parseInt(formData.age, 10),
      subscriptionTier: 'free',
      createdAt: Date.now(),
      onboarding: onboardingData,
      preferences: {
        reminderFrequency: 'medium',
        focusDuration: 25,
        breakDuration: 5,
        breakRemindersEnabled: true,
        soundEnabled: true,
        darkMode: true,
      },
    }

    setUser(newUser)
    router.push('/dashboard')
  }

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return formData.name.trim().length > 0 && formData.age.length > 0
      case 2:
        return (
          formData.wakeTime.length > 0 &&
          formData.workStartTime.length > 0 &&
          formData.workEndTime.length > 0
        )
      case 3:
        return !formData.takesAdhgMeds || formData.medsTime.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const steps = [
    {
      title: 'Welcome to FocusFlow',
      description: "Let's set up your ADHD assistant",
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed text-slate-400">
            Hi there! I'm FocusFlow, your AI-powered ADHD coach. I'm here to help you manage your day, remember what matters, and take care of yourself.
          </p>
          <p className="text-base text-slate-400">
            Let's start by learning a bit about you. This should take about 2 minutes.
          </p>
          <div className="pt-4">
            <div className="inline-block px-6 py-3 rounded-xl border bg-[#136dec]/10 border-[#136dec]">
              <p className="font-semibold text-[#136dec]">✨ No pressure here</p>
              <p className="text-sm mt-1 text-slate-400">You can always change these settings later</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What's your name?",
      description: 'So I know how to address you',
      content: (
        <div className="space-y-6">
          <input
            type="text"
            placeholder="e.g., Alex"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full text-lg"
            autoFocus
          />
          <div>
            <label className="block text-sm mb-3 text-slate-400">Age</label>
            <input
              type="number"
              placeholder="e.g., 28"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="w-full"
              min="13"
              max="120"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Your Daily Routine',
      description: 'When do you wake up and work?',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-slate-400">
              What time do you wake up?
            </label>
            <input
              type="time"
              value={formData.wakeTime}
              onChange={(e) =>
                setFormData({ ...formData, wakeTime: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-400">
              Work or school starts at?
            </label>
            <input
              type="time"
              value={formData.workStartTime}
              onChange={(e) =>
                setFormData({ ...formData, workStartTime: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-400">
              Work or school ends at?
            </label>
            <input
              type="time"
              value={formData.workEndTime}
              onChange={(e) =>
                setFormData({ ...formData, workEndTime: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'ADHD Medication',
      description: 'Optional, but helpful for reminders',
      content: (
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg transition-colors bg-[#0b1219] border border-slate-800 hover:bg-slate-800">
            <input
              type="checkbox"
              checked={formData.takesAdhgMeds}
              onChange={(e) =>
                setFormData({ ...formData, takesAdhgMeds: e.target.checked })
              }
              className="w-6 h-6"
            />
            <span className="font-medium text-slate-100">I take ADHD medication</span>
          </label>

          {formData.takesAdhgMeds && (
            <div className="space-y-4 p-4 rounded-lg bg-[#0b1219]">
              <div>
                <label className="block text-sm mb-2 text-slate-400">
                  What time do you take it?
                </label>
                <input
                  type="time"
                  value={formData.medsTime}
                  onChange={(e) =>
                    setFormData({ ...formData, medsTime: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-400">
                  Medication name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Adderall, Ritalin"
                  value={formData.medsName}
                  onChange={(e) =>
                    setFormData({ ...formData, medsName: e.target.value })
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}

          <p className="text-sm pt-2 text-slate-400">
            This helps me send you reminders at the right time and understand your energy levels.
          </p>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'How do you want to stay on track?',
      content: (
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg transition-colors bg-[#0b1219] border border-slate-800 hover:bg-slate-800">
            <input
              type="checkbox"
              checked={formData.notificationsEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationsEnabled: e.target.checked,
                })
              }
              className="w-6 h-6"
            />
            <div>
              <span className="font-medium block text-slate-100">
                Enable notifications
              </span>
              <span className="text-xs text-slate-400">
                Gentle reminders for events, medication, breaks, and hydration
              </span>
            </div>
          </label>

          <div className="p-4 rounded-lg border bg-[#136dec]/10 border-[#136dec]">
            <p className="text-sm text-[#3b82f6]">
              💡 Pro tip: I'll learn your patterns over time and adjust reminders to help you thrive, not overwhelm you.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-400">
              Ready to get started? You're all set up! I'll meet you on the home screen.
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <OnboardingStep
      step={currentStep + 1}
      totalSteps={TOTAL_STEPS}
      title={steps[currentStep].title}
      description={steps[currentStep].description}
      onBack={currentStep > 0 ? handleBack : undefined}
      onNext={handleNext}
      nextDisabled={!isStepValid()}
      nextLabel={currentStep === TOTAL_STEPS - 1 ? 'Start Using FocusFlow' : 'Continue'}
      hideBack={currentStep === 0}
    >
      {steps[currentStep].content}
    </OnboardingStep>
  )
}
