# Quick Start Guide - FocusFlow AI Assistant

## What Changed?

The assistant page now uses **Claude Haiku** instead of mock responses. It can:
- Read your calendar
- Create events
- Set reminders
- Provide ADHD coaching

## Files Modified

```
src/app/api/chat/route.ts          (NEW - API endpoint)
src/app/(main)/assistant/page.tsx  (UPDATED - now uses real API)
tsconfig.json                       (UPDATED - added moduleResolution)
```

## Setup for Vercel Deployment

1. Go to your Vercel project settings
2. Add environment variable:
   ```
   ANTHROPIC_API_KEY = <your-api-key>
   ```
3. Get your API key from [console.anthropic.com](https://console.anthropic.com)
4. Deploy

## How It Works

1. User types message → `"/api/chat"` endpoint
2. Server sends to Claude with:
   - Conversation history
   - User's calendar events
   - User's profile (name, wake time, work hours, meds info)
3. Claude responds with text and/or tool calls
4. Tools: `get_events`, `create_event`, `set_reminder`, `get_user_profile`
5. Response returned to user

## Verification Checklist

Run this in the project directory:

```bash
# Check TypeScript
npx tsc --noEmit

# Check Anthropic SDK
npm ls @anthropic-ai/sdk

# Check files exist
ls src/app/api/chat/route.ts
ls src/app/(main)/assistant/page.tsx
```

## Testing Locally

```bash
npm run dev
# Visit http://localhost:3000/assistant
# Try: "What's on my calendar?"
# Try: "Add a meeting at 2pm tomorrow"
```

## Key Features

### Tools the AI Can Use
- `get_events(date)` - "What's on March 20th?"
- `create_event(title, date, startTime, endTime, location?, reminder?)` - "Add appointment"
- `set_reminder(title, date, time)` - "Remind me to..."
- `get_user_profile()` - "Tell me about the user"

### System Prompt Includes
- User's name
- Wake time
- Work hours
- Medication info
- ADHD-friendly coaching tone

### What the AI Does
1. **Reads** - "What's on my schedule?"
2. **Creates** - "Add a dentist appointment"
3. **Reminds** - "Set a reminder for 8am"
4. **Coaches** - "Help me focus" → practical advice
5. **Validates** - "I forgot my meds" → understanding response

## Troubleshooting

### "API Error 500"
- Check Vercel logs
- Verify `ANTHROPIC_API_KEY` is set correctly
- Test API key at console.anthropic.com

### "No response from assistant"
- Check browser console (F12)
- Verify user is logged in (has context)
- Check that calendar context is available

### "TypeScript errors"
- Run `npx tsc --noEmit`
- Check `tsconfig.json` has `moduleResolution: "node"`

## Code Structure

```
API Route (route.ts):
├── buildSystemPrompt(user) → Creates ADHD coaching prompt
├── tools[] → Defines 4 available tools
├── processTool(name, input, events) → Executes tool logic
└── POST(req) → Main handler with agentic loop

Assistant Page (page.tsx):
├── useCalendar() → Get user's calendar events
├── useUser() → Get user's profile
├── handleSendMessage() → Send to API
└── Displays responses + error handling
```

## Important Notes

- **No Database:** All data passed in request (from localStorage)
- **Stateless:** Each request is independent
- **Scalable:** Easy to add database later
- **Cost Efficient:** Uses Haiku model
- **ADHD-Optimized:** Warm, practical, concise

## Next Steps

1. Deploy to Vercel with `ANTHROPIC_API_KEY`
2. Test the assistant at `/assistant` page
3. Create calendar events and reminders through chat
4. Customize system prompt if needed (in `buildSystemPrompt` function)
5. Add more tools as needed

## Documentation Files

- `AI_ASSISTANT_IMPLEMENTATION.md` - Full technical details
- `ASSISTANT_EXAMPLES.md` - Real conversation examples
- `QUICK_START.md` - This file

---

**Ready to test?** Log in and visit the Assistant page!
