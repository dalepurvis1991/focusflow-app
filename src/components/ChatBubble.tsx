import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-3 mb-4 animate-slide-up', isUser && 'flex-row-reverse')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
          FF
        </div>
      )}

      <div
        className={cn(
          'max-w-xs lg:max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-purple text-white rounded-br-none'
            : 'bg-navy-light text-gray-200 rounded-bl-none'
        )}
      >
        <p className="break-words">{content}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}
