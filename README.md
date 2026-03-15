# FocusFlow

An AI-powered personal assistant specifically designed for people with ADHD. FocusFlow helps manage daily life through adaptive prompts, calendar management, and ADHD-specific coping mechanisms.

## 🧠 What is FocusFlow?

FocusFlow is a mobile-first web application built for people with ADHD. It combines:

- **Smart Calendar Management**: Organize your day with visual event cards, travel time tracking, and intelligent reminders
- **AI Assistant**: A friendly coach who listens, helps you organize thoughts, remembers what matters, and provides gentle nudges
- **Adaptive Nudges**: Context-aware reminders for hydration, breaks, movement, and medication timing
- **Streak System**: Motivate yourself with a visual representation of consistent app usage
- **ADHD-Specific Settings**: Configurable reminder frequency, focus session lengths, and medication timing
- **Dark Mode First**: Thoughtfully designed with reduced visual noise and easy-on-the-eyes UI

## 🎨 Design Philosophy

FocusFlow is built with ADHD users in mind:

- **Calm dark theme** (navy and purple) reduces visual overwhelm
- **Large touch targets** (48px minimum) for easier mobile interaction
- **Smooth animations** provide visual feedback without being distracting
- **Clear hierarchy** helps users understand what to do next
- **Minimal clutter** keeps the focus on what matters
- **Encouraging copy** celebrates progress without being clinical

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
cd focusflow-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect you to onboarding if it's your first time.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Features

### Onboarding (5 Steps)
1. Welcome introduction
2. Personal info (name, age)
3. Daily routine (wake time, work hours)
4. ADHD medication info (optional)
5. Notification preferences

All data is stored in localStorage for now.

### Dashboard
- Time-aware greeting
- Current streak tracking
- Next event summary
- Today's schedule (up to 3 events)
- Nudge cards (hydration, breaks, etc.)
- Quick action buttons

### AI Assistant
- Chat interface with message bubbles
- Mock responses trained on common ADHD concerns
- Voice input placeholder
- Persistent conversation history

### Calendar
- Week view with navigation
- Color-coded events
- Travel time indicators
- Event details with location/time
- Quick add event modal
- Sample events included

### Profile/Settings
- User profile with avatar
- Daily routine display
- Medication management
- Preference controls:
  - Reminder frequency (low/medium/high)
  - Focus session duration (15/25/45 min)
  - Break reminders toggle
  - Sound toggle
- Sign out functionality

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Dates**: date-fns
- **State Management**: React Context API
- **Storage**: localStorage

## 🎯 Architecture

```
focusflow-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Redirect to dashboard/onboarding
│   │   ├── globals.css         # Global styles
│   │   ├── onboarding/         # Onboarding flow
│   │   └── (main)/             # Main app layout with bottom nav
│   │       ├── layout.tsx
│   │       ├── dashboard/
│   │       ├── assistant/
│   │       ├── calendar/
│   │       └── profile/
│   ├── components/             # Reusable UI components
│   │   ├── BottomNav.tsx
│   │   ├── OnboardingStep.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── EventCard.tsx
│   │   ├── NudgeCard.tsx
│   │   └── QuickAction.tsx
│   ├── context/                # React Context for state
│   │   ├── UserContext.tsx
│   │   └── CalendarContext.tsx
│   ├── types/                  # TypeScript interfaces
│   │   ├── user.ts
│   │   ├── calendar.ts
│   │   └── assistant.ts
│   └── lib/                    # Utility functions
│       └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

## 🎨 Color Palette

- **Navy** (#0f172a): Main background
- **Navy Light** (#1e293b): Cards and hover states
- **Purple** (#8b5cf6): Primary actions and accents
- **Amber** (#f59e0b): Alerts and urgent reminders
- **Gray**: Text and secondary elements

## 📊 Data Structure

### User
```typescript
{
  id: string
  name: string
  age: number
  subscriptionTier: 'free' | 'pro'
  onboarding: OnboardingData
  preferences: Preferences
}
```

### Event
```typescript
{
  id: string
  title: string
  startTime: string (HH:MM)
  endTime: string (HH:MM)
  date: string (YYYY-MM-DD)
  color: 'blue' | 'purple' | 'amber' | 'green' | 'pink'
  hasReminder: boolean
  reminderMinutes: number
  travelTimeMinutes?: number
  location?: string
}
```

## 🚦 Sample Data

The app includes sample calendar events to demonstrate functionality:
- Doctor Appointment (Monday 10:00 AM)
- Team Meeting (Monday 2:00 PM)
- Lunch Break (Monday 12:00 PM)
- Project Deadline (Tuesday 5:00 PM)
- Coffee with Alex (Wednesday 3:30 PM)

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Mobile-first responsive design
- ✅ Onboarding flow
- ✅ Calendar with sample events
- ✅ AI assistant chat interface (mock)
- ✅ Profile and settings
- ✅ Streak tracking

### Phase 2
- Real AI backend integration
- Reminder notifications
- Focus/Pomodoro timer
- Biometric awareness
- Analytics dashboard

### Phase 3
- Multi-device sync
- Integration with calendar services (Google Calendar, Outlook)
- Medication tracking with biometric data
- Smart nudge engine powered by ML
- Dark/light mode toggle

## 🔐 Privacy

FocusFlow currently stores all data locally using localStorage. No data is sent to servers.

Future versions will:
- Offer encrypted cloud sync (optional)
- Never sell or share user data
- Allow full data export and deletion
- Be HIPAA-compliant for sensitive health data

## 📝 License

MIT

## 🙋 Support

For issues, feature requests, or feedback, please open an issue on the project repository.

---

**Made with 💜 for the ADHD community**
