import { BottomNav } from '@/components/BottomNav'
import { SidebarNav } from '@/components/SidebarNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1219]">
      {/* Sidebar - visible on tablet and above */}
      <div className="hidden md:flex md:flex-col md:w-64 border-r border-slate-800 bg-slate-900">
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
