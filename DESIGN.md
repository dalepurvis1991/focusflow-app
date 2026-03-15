# FocusFlow Design System

## Visual Identity

FocusFlow is designed as a **premium wellness app** that feels calm, supportive, and easy to use for people with ADHD.

### Inspiration
- **Calm**: The meditative design and smooth interactions
- **Notion**: Clean organization and visual hierarchy
- **Apple Health**: Minimal, data-focused interface

## Color Palette

### Primary Colors
- **Navy** (#0f172a): Main background - dark, calming, reduces visual noise
- **Navy Light** (#1e293b): Cards, sections, hover states
- **Navy Lighter** (#334155): Borders, inactive states

### Accent Colors
- **Purple** (#8b5cf6): Primary actions, interactive elements, success states
- **Purple Dark** (#7c3aed): Hover state for purple buttons
- **Purple Light** (#a78bfa): Text accents, highlights

### Alert Color
- **Amber** (#f59e0b): Alerts, urgent reminders, time-sensitive items

### Event Colors (for calendar)
- Blue, Green, Pink, Amber, Purple - for event differentiation

### Neutral Grays
- White/Off-white: Primary text
- Gray-300 (#d1d5db): Secondary text
- Gray-400 (#9ca3af): Tertiary text, placeholders
- Gray-500 (#6b7280): Disabled states

## Typography

### Font Family
- System font stack: `system-ui, -apple-system, sans-serif`
- No custom fonts (faster loading, better accessibility)

### Sizes
- **Display**: 32px (3xl)
- **Heading 1**: 24px (2xl)
- **Heading 2**: 20px (xl)
- **Body**: 16px (base)
- **Small**: 14px (sm)
- **Micro**: 12px (xs)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

Tailwind spacing scale (4px base unit):
- Small: 0.5rem (8px)
- Medium: 1rem (16px)
- Large: 1.5rem (24px)
- XL: 2rem (32px)

## Border Radius

- Small elements: 0.5rem (8px)
- Medium elements: 1rem (16px)
- Cards/modals: 1.5rem (24px)

## Shadows

Subtle shadows for depth:
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

No heavy shadows (reduces visual noise for ADHD).

## Animations

### Keyframes
- **fade-in**: 0.3s ease-in-out (opacity)
- **slide-up**: 0.4s ease-out (translate + opacity)
- **pulse-soft**: 2s ease-in-out (gentle opacity pulse)

### Duration Standards
- Fast: 150-200ms (interactions)
- Medium: 300-400ms (transitions)
- Slow: 1000ms+ (background animations)

### Use Cases
- Fade-in: Page/component entry
- Slide-up: Message bubbles, cards appearing
- Pulse-soft: Loading states, gentle emphasis

### Easing
- Interactions: `ease-out` (snappy)
- Page transitions: `ease-in-out` (smooth)
- Loading: `ease-in-out` (continuous)

## Component Styles

### Buttons
- **Primary**: Gradient purple, white text, 16px padding, 8px radius
- **Secondary**: Navy background, gray text, border, 16px padding
- **Outline**: Border with purple, transparent background
- **Min height**: 48px (touch target for mobile)

### Inputs
- Background: Navy-light
- Border: Navy-lighter
- Focus: Purple border, subtle shadow
- Padding: 12px
- Height: 44px minimum

### Cards
- Background: Navy-light or transparent
- Border: Optional, 2px
- Padding: 16-24px
- Border radius: 16px

### Event Cards
- Color-coded left border (4px)
- Hover: Scale up slightly, increased opacity
- Animation: Slide-up on load

### Bottom Navigation
- Fixed position at bottom
- Safe area padding for notches
- Large touch targets (64px)
- Active indicator: Purple background

## Icons

Using **Lucide React** (24px default size):
- Consistent stroke width
- Clear, minimal design
- Good ADHD-friendly visibility

## Accessibility

### Color Contrast
- All text meets WCAG AA standard
- Navy + white: 13.5:1 contrast
- Navy + gray-400: 4.8:1 contrast

### Touch Targets
- Minimum 48px x 48px for interactive elements
- Sufficient spacing between buttons (12px)

### Text
- Clear, friendly language
- Avoid medical jargon
- Short paragraphs
- Clear call-to-action buttons

### Focus States
- Purple outline on interactive elements
- Visible focus indicators
- Keyboard navigable

## Mobile-First Design

### Viewport Considerations
- Minimum width: 320px
- Maximum width: 640px (for tablet experience)
- Safe area insets for notches
- Bottom nav accounts for safe-area-inset-bottom

### Touch Interaction
- 48px minimum touch targets
- No hover-only interactions
- Active states for feedback
- Haptic feedback potential (future)

### Scrolling
- Vertical scroll primary
- Smooth scrolling behavior
- Momentum scrolling on mobile

## Dark Mode

- **Default**: Always dark (no light mode toggle in v1)
- Rationale: Reduces visual stimulation for ADHD
- Future: Optional light mode if requested

## State Indicators

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- No hover effects

### Hover
- Scale up slightly (1.05x)
- Background color change
- Smooth transition

### Active
- Scale down (0.95x)
- Provides tactile feedback
- Short duration (100ms)

### Loading
- Pulse animation (opacity)
- Spinner dots if needed
- Clear loading text

## Cards & Containers

### Nudge Cards
- Colored background with opacity (10-20%)
- Matching colored border
- Icon on left
- Action button bottom-aligned

### Event Cards
- Color-coded left border
- Title + time + location
- Travel time indicator
- Compact and expanded modes

### Message Bubbles
- User: Purple background, white text, right-aligned
- Assistant: Navy-light background, gray text, left-aligned
- Rounded corners (16px)
- Timestamp (tiny, 12px)

## Layout Grid

- Mobile: Single column, full width
- Tablet+: Centered max-width (640px)
- Gutters: 16px padding
- Gap between sections: 24px

## Onboarding Visual Design

- Large, friendly heading (32px)
- Progress bar (purple gradient)
- Descriptive subtitle (gray)
- Clear single input focus
- Helpful hint text (small, gray)
- Large call-to-action button

## Dashboard Layout

- Time-based greeting (large)
- Date/day indicator (small, gray)
- Streak card (highlights achievement)
- Next event highlight
- Quick action grid (2 columns)
- Nudge card
- Help text with action

## Calendar Layout

- Day selector tabs (7 days)
- Date navigation
- Event list (compact or full)
- Empty state (friendly message)
- Float action button (FAB)

## Assistant Layout

- Header with title
- Message feed (scrollable)
- Input bar (fixed at bottom)
- Send button + voice button
- Chat bubbles with timestamps

## Profile Layout

- User avatar (large, circular)
- Name + tier badge
- Settings grouped by category
- Toggle switches for preferences
- Dropdown selects for options
- Danger zone (sign out)

## Loading States

- Pulse animation (dots)
- Subtle opacity change
- Clear loading text
- Duration: 2 seconds min

## Empty States

- Emoji/icon (friendly)
- Descriptive message (encouraging)
- Optional action button
- Centered, prominent

## Error States

- Red/amber background
- Clear error message
- Helpful context
- Action to resolve (retry, contact support)

## Success States

- Green background or icon
- Positive confirmation message
- Auto-dismiss or action button

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px (not primary focus)

## Print Styles

Not currently implemented, but could be added for:
- Calendar export
- Event list printing
- Settings export

## Animation Performance

- Use CSS transforms when possible (faster)
- Avoid animating colors (heavier)
- Use will-change sparingly
- Test on low-end devices

---

This design system ensures FocusFlow feels premium, calming, and supportive—exactly what someone with ADHD needs.
