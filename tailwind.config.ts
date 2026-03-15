import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Dark mode
        dark: {
          bg: '#09090b',
          surface: '#18181b',
          border: '#27272a',
          text: '#f8fafc',
          'text-secondary': '#a1a1aa',
        },
        // Light mode
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e4e4e7',
          text: '#09090b',
          'text-secondary': '#71717a',
        },
        // Semantic colors
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        'primary-light': '#60a5fa',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      spacing: {
        'safe-bottom': 'max(1.5rem, env(safe-area-inset-bottom))',
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.5rem' }],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
      },
    },
  },
  plugins: [],
}
export default config
