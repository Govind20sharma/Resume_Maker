'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

const NO_SIDEBAR_PATHS = ['/auth/login', '/auth/signup', '/auth/callback']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = NO_SIDEBAR_PATHS.some((p) => pathname.startsWith(p))

  if (hideSidebar) return <>{children}</>

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto min-w-0">
        {children}
      </div>
    </div>
  )
}
