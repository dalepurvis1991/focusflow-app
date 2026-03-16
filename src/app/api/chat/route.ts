import Anthropic from '@anthropic-ai/sdk'
import { Event } from '@/types/calendar'
import { User } from '@/types/user'

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  events: Event[]
  user: User | null
  focusMode?: boolean
}

interface ToolResult {
  type: 'tool_result'
  tool_use_id: string
  content: string
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const tools: Anthropic.Tool[] = [
  {
    name: 'get_events',
    description: 'Get calendar events for a specific date. Use ISO date format (YYYY-MM-DD).',
    input_schema: {
      type: 'object' as const,
      properties: {
        date: {
          type: 'string',
          description: 'The date to get events for in YYYY-MM-DD format',
        },
      },
      required: ['date'],
    },
  },
  {
    name: 'create_event',
    description:
      'Create a new calendar event. Returns confirmation of the created event.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Event title',
        },
        date: {
          type: 'string',
          description: 'Event date in YYYY-MM-DD format',
        },
        startTime: {
          type: 'string',
          description: 'Start time in HH:MM format (24-hour)',
        },
        endTime: {
          type: 'string',
          description: 'End time in HH:MM format (24-hour)',
        },
        location: {
          type: 'string',
          description: 'Optional location',
        },
        hasReminder: {
          type: 'boolean',
          description: 'Whether to set a reminder',
        },
        reminderMinutes: {
          type: 'number',
          description: 'Minutes before event to remind (default: 30)',
        },
      },
      required: ['title', 'date', 'startTime', 'endTime'],
    },
  },
  {
    name: 'set_reminder',
    description:
      'Set a reminder for a specific time. Useful for medication reminders, task reminders, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'What the reminder is for',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format',
        },
        time: {
          type: 'string',
          description: 'Time in HH:MM format (24-hour)',
        },
      },
      required: ['title', 'date', 'time'],
    },
  },
  {
    name: 'get_user_profile',
    description:
      'Get the current user profile including name, medication info, work hours, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'web_search',
    description:
      'Search the web for real-world information like addresses, phone numbers, opening hours, directions, business information, etc. Use this when users ask questions that require current or specific information not in your training data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description:
            'The search query (e.g., "Dr Smith surgery address", "Hull Royal Infirmary phone number", "nearest GP clinic to Hull")',
        },
      },
      required: ['query'],
    },
  },
]

async function searchWeb(query: string): Promise<string> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1`,
      {
        headers: {
          'User-Agent': 'FocusFlow-App/1.0',
        },
      }
    )

    if (!response.ok) {
      return `Search failed with status ${response.status}. I couldn't find information for that query.`
    }

    const data = (await response.json()) as {
      AbstractText?: string
      AbstractURL?: string
      RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>
      Results?: Array<{ Text?: string; FirstURL?: string }>
    }

    // Prioritize AbstractText (instant answer), then RelatedTopics, then Results
    if (data.AbstractText) {
      return `${data.AbstractText}${data.AbstractURL ? ` (Source: ${data.AbstractURL})` : ''}`
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const results = data.RelatedTopics.slice(0, 3)
        .map((topic) => `- ${topic.Text}${topic.FirstURL ? ` (${topic.FirstURL})` : ''}`)
        .join('\n')
      return `Here are some relevant results:\n${results}`
    }

    if (data.Results && data.Results.length > 0) {
      const results = data.Results.slice(0, 3)
        .map((result) => `- ${result.Text}${result.FirstURL ? ` (${result.FirstURL})` : ''}`)
        .join('\n')
      return `Here are some relevant results:\n${results}`
    }

    return `I couldn't find specific information for "${query}". Try rephrasing your search with more specific details.`
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Web search error:', errorMsg)
    return `I encountered an error while searching: ${errorMsg}. Please try again.`
  }
}

function buildSystemPrompt(user: User | null, focusMode: boolean = false): string {
  const userName = user?.onboarding?.name || user?.name || 'there'
  const wakeTime = user?.onboarding?.wakeTime || '7:00 AM'
  const workStart = user?.onboarding?.workStartTime || '9:00 AM'
  const workEnd = user?.onboarding?.workEndTime || '5:00 PM'
  const medsInfo = user?.onboarding?.takesAdhgMeds
    ? `The user takes ${user.onboarding.medsName || 'ADHD medication'} at ${user.onboarding.medsTime || '8:00 AM'}.`
    : 'The user does not take ADHD medication.'

  return `You are FocusFlow Coach, a warm, supportive AI assistant designed to help people with ADHD manage their time, tasks, and well-being. You have access to the user's calendar, can create events, set reminders, and search the web for real-world information.

About the user:
- Name: ${userName}
- Wake time: ${wakeTime}
- Work hours: ${workStart} - ${workEnd}
- ${medsInfo}

Your personality and approach:
- Warm, non-judgmental, and validating. ADHD is real, and you get it.
- Practical and action-oriented. Focus on what the user can do right now.
- Concise and clear. ADHD brains work better with short, focused messages.
- Supportive of executive function. Break tasks into manageable pieces.
- Gently remind about self-care, meds, and breaks.

When the user asks you to:
- "Add an appointment" → Use create_event to actually add it to their calendar
- "Set a reminder" → Use set_reminder to create the reminder
- "What's on my calendar?" → Use get_events to check their actual calendar
- "Do it", "Set that up", "Add it" → Take action with the appropriate tool
- "What's the address of..." / "Phone number of..." / "Opening hours..." / "Find me a..." → Use web_search to look up current information

Always:
1. If the user mentions a specific date/time, use it. If they say "tomorrow", calculate the actual date.
2. Confirm actions before executing them when the intent is clear.
3. After creating events or reminders, give a brief confirmation.
4. If something is unclear, ask clarifying questions.
5. For information queries about addresses, phone numbers, hours, directions, or local services, use web_search to provide accurate current information.
6. Provide emotional support for ADHD struggles while also being practical.

Today's date for reference: ${new Date().toISOString().split('T')[0]}

${
  focusMode
    ? `\nFOCUS MODE: The user is currently in an active focus session. Keep all responses very brief and action-oriented. Get them quick answers and let them get back to their task. Use 1-3 sentences max. Be direct and concise.`
    : ''
}`
}

async function processTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  events: Event[]
): Promise<string> {
  switch (toolName) {
    case 'get_events': {
      const date = toolInput.date as string
      const dayEvents = events.filter((e) => e.date === date)
      if (dayEvents.length === 0) {
        return `No events scheduled for ${date}`
      }
      return JSON.stringify(dayEvents, null, 2)
    }

    case 'create_event': {
      const newEvent: Event = {
        id: `event_${Date.now()}`,
        title: toolInput.title as string,
        date: toolInput.date as string,
        startTime: toolInput.startTime as string,
        endTime: toolInput.endTime as string,
        location: (toolInput.location as string) || undefined,
        color: 'blue',
        hasReminder: (toolInput.hasReminder as boolean) ?? true,
        reminderMinutes: (toolInput.reminderMinutes as number) ?? 30,
      }
      return JSON.stringify({
        success: true,
        event: newEvent,
        message: `Created event: ${newEvent.title} on ${newEvent.date} at ${newEvent.startTime}`,
      })
    }

    case 'set_reminder': {
      const reminder = {
        id: `reminder_${Date.now()}`,
        title: toolInput.title as string,
        date: toolInput.date as string,
        time: toolInput.time as string,
        message: `Reminder set: ${toolInput.title} on ${toolInput.date} at ${toolInput.time}`,
      }
      return JSON.stringify({
        success: true,
        reminder,
      })
    }

    case 'get_user_profile': {
      return JSON.stringify({
        message: 'User profile retrieved (passed from client)',
      })
    }

    case 'web_search': {
      const query = toolInput.query as string
      const searchResult = await searchWeb(query)
      return JSON.stringify({
        success: true,
        query,
        result: searchResult,
      })
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` })
  }
}

export async function POST(req: Request) {
  try {
    const { messages, events, user, focusMode } = (await req.json()) as ChatRequest

    const systemPrompt = buildSystemPrompt(user, focusMode)

    let conversationMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      tools: tools,
      messages: conversationMessages,
    })

    // Handle tool use in an agentic loop
    while (response.stop_reason === 'tool_use') {
      const toolUseBlock = response.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )

      if (!toolUseBlock) break

      const toolResult = await processTool(
        toolUseBlock.name,
        toolUseBlock.input as Record<string, unknown>,
        events
      )

      // Add assistant's response with tool use
      conversationMessages = [
        ...conversationMessages,
        {
          role: 'assistant',
          content: response.content,
        },
      ]

      // Add tool result
      conversationMessages = [
        ...conversationMessages,
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUseBlock.id,
              content: toolResult,
            },
          ],
        },
      ]

      // Get next response
      response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        tools: tools,
        messages: conversationMessages,
      })
    }

    // Extract final text response
    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )
    const finalResponse = textBlock?.text || 'I apologize, I could not generate a response.'

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: finalResponse,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
