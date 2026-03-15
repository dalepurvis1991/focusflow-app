# FocusFlow Setup Guide

## Getting Started

### 1. Install Dependencies

```bash
cd focusflow-app
npm install
```

This will install all required packages:
- Next.js 14+
- React 18
- TypeScript
- Tailwind CSS
- Lucide React icons
- date-fns utilities

### 2. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### 3. First Time Experience

The app will automatically redirect you to the onboarding flow:
1. Welcome screen
2. Enter your name and age
3. Set your daily routine (wake time, work hours)
4. ADHD medication info (optional)
5. Notification preferences

All data is saved to localStorage. You can reset by clicking "Reset Onboarding" in the Profile page.

## What's Included

### ✅ Fully Functional Features

- **Onboarding**: 5-step multi-step wizard with validation
- **Dashboard**: Time-aware greeting, event summary, streak tracking, nudge cards
- **Calendar**: Week view, color-coded events, add event modal, sample data
- **Assistant**: Chat interface with mock responses for common ADHD concerns
- **Profile**: Settings management, daily routine display, preferences
- **Navigation**: Bottom navigation bar with active state indicators

### 🎨 Design Features

- Dark mode (default) with navy/purple color scheme
- Mobile-first responsive design
- Smooth animations (fade-in, slide-up)
- Large touch targets for mobile
- Accessibility-friendly typography
- Rounded corners and generous spacing

### 🧠 Technical Features

- TypeScript for type safety
- React Context for state management
- localStorage for persistence
- Tailwind CSS for styling
- Next.js App Router (modern structure)
- Mobile viewport optimizations

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global Tailwind styles
│   ├── page.tsx           # Root page (redirects)
│   ├── onboarding/        # Onboarding flow
│   └── (main)/            # Main app with bottom nav
│       ├── dashboard/     # Home screen
│       ├── assistant/     # Chat interface
│       ├── calendar/      # Calendar view
│       └── profile/       # Settings & profile
├── components/            # Reusable React components
├── context/              # State management (UserContext, CalendarContext)
├── types/                # TypeScript type definitions
└── lib/                  # Utility functions
```

## Key Components

### BottomNav.tsx
Mobile navigation bar with 4 main sections (Home, Assistant, Calendar, Profile). Auto-highlights based on current page.

### OnboardingStep.tsx
Reusable wrapper for onboarding pages with progress bar, back button, and next button.

### ChatBubble.tsx
Message display component with user/assistant styling and timestamps.

### EventCard.tsx
Calendar event display with optional compact mode, showing title, time, location, and reminders.

### NudgeCard.tsx
Gentle reminder card for water, breaks, movement, or breathing exercises.

### QuickAction.tsx
Icon + label button for common actions. Supports primary, secondary, and outline variants.

## Context & State

### UserContext
Manages:
- User profile and onboarding data
- User preferences
- Streak tracking
- localStorage persistence

Usage:
```typescript
const { user, streak, setUser, updatePreferences, clearUser } = useUser()
```

### CalendarContext
Manages:
- Calendar events
- Event CRUD operations
- Event filtering by date
- Sample event data

Usage:
```typescript
const { events, addEvent, getEventsForDate, getUpcomingEvents } = useCalendar()
```

## Customization

### Colors
Edit the Tailwind config in `tailwind.config.ts`:
```typescript
colors: {
  navy: '#0f172a',
  purple: '#8b5cf6',
  amber: '#f59e0b',
}
```

### Animations
Add or modify keyframes in `tailwind.config.ts`:
```typescript
keyframes: {
  'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } }
}
```

### Sample Events
Edit the `SAMPLE_EVENTS` array in `src/context/CalendarContext.tsx` to add your own calendar data.

## Build for Production

```bash
npm run build
npm start
```

The optimized build will be in `.next/`.

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Clear Cache & Dependencies
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### localStorage Not Working
This is a browser feature. Check that:
1. Cookies are enabled
2. You're not in private/incognito mode
3. localStorage hasn't hit the quota

### Types Not Working
Ensure TypeScript is properly configured:
```bash
npx tsc --noEmit
```

## Next Steps

To deploy FocusFlow:

1. **Vercel** (Recommended for Next.js)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Docker**
   Create a Dockerfile with Node 18+

3. **Static Export** (if needed)
   Set `output: 'export'` in `next.config.js`

## Architecture Notes

- Uses Next.js 14 App Router (not Pages Router)
- TypeScript for type safety
- React Context API (no Redux needed)
- Tailwind CSS for styling (no CSS modules needed)
- localStorage for persistence (ready for backend integration)

## Performance

- Lazy loading of pages
- Image optimization ready
- Code splitting by route
- CSS minification with Tailwind
- Bundle size < 500KB (gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+

## Need Help?

Check `README.md` for feature overview and `src/` for implementation details.

Happy building! 💜
