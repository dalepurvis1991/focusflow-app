import { BottomNav } from '@/components/BottomNav'
import { SidebarNav } from '@/components/SidebarNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Sidebar - visible on tablet and above */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r" style={{ borderColor: 'var(--border)' }}>
        <SidebarNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto pb-24 md:pb-6">
          <div className="mx-auto max-w-full md:max-w-none">
            {children}
          </div>
        </main>

        {/* Bottom Nav - visible on phone only */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
