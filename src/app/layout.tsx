import type { Metadata, Viewport } from 'next'
import { UserProvider } from '@/context/UserContext'
import { CalendarProvider } from '@/context/CalendarContext'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'FocusFlow - Your ADHD Co-Pilot',
  description: 'Your ADHD co-pilot — AI-powered daily life management',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%230b1219" width="180" height="180"/><circle cx="90" cy="90" r="60" fill="%23136dec"/><path d="M70 90 L85 105 L110 70" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        sizes: '180x180',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0b1219" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FocusFlow" />
        <link rel="preconnect" href="https://rsms.me/inter/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('focusflow_theme') || 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <UserProvider>
          <CalendarProvider>
            <div className="min-h-screen transition-colors duration-300">
              {children}
            </div>
          </CalendarProvider>
        </UserProvider>
      </body>
    </html>
  )
}
