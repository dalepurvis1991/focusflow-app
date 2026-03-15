import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

interface OnboardingStepProps {
  step: number
  totalSteps: number
  title: string
  description?: string
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  hideBack?: boolean
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  children,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = 'Continue',
  hideBack = false,
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen bg-[#0b1219] flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-32">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {!hideBack && onBack ? (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-slate-400" size={24} />
              </button>
            ) : (
              <div className="w-10" />
            )}
            <span className="text-sm text-slate-500 font-medium">
              {step} of {totalSteps}
            </span>
          </div>

          <div className="w-full h-1 bg-slate-800 rounded-full mb-8">
            <div
              className="h-full bg-gradient-to-r from-[#136dec] to-[#1058c7] rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">{title}</h1>
          {description && (
            <p className="text-slate-400 text-lg">{description}</p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">{children}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0b1219] border-t border-slate-800 p-6">
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full py-4 bg-gradient-to-r from-[#136dec] to-[#1058c7] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
