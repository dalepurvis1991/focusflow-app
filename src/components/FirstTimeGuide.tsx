'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface FirstTimeGuideProps {
  pageKey: string
  title: string
  tips: string[]
}

export function FirstTimeGuide({ pageKey, title, tips }: FirstTimeGuideProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this guide has been seen before
    const storageKey = `focusflow_guide_seen_${pageKey}`
    const hasSeenGuide = localStorage.getItem(storageKey)

    if (!hasSeenGuide) {
      setIsVisible(true)
    }
  }, [pageKey])

  const handleDismiss = () => {
    const storageKey = `focusflow_guide_seen_${pageKey}`
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-sm w-full shadow-2xl animate-fade-in">
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            aria-label="Close guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tips */}
        <div className="p-6 space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 pt-1">
                <div className="w-2 h-2 bg-[#136dec] rounded-full mt-1.5" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* Dismiss button */}
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className="w-full py-3 px-4 bg-[#136dec] hover:bg-[#1058c7] text-white font-semibold rounded-lg transition-colors active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
