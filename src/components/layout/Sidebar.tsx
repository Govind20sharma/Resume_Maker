'use client'

import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  )
}

function IconList() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function IconUpload() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4 4 4" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  )
}

function IconLogin() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h7a2 2 0 012 2v1" />
    </svg>
  )
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  icon,
  label,
  active,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
        danger
          ? 'text-red-500 hover:bg-red-50'
          : active
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <span className={cn(
        'shrink-0',
        danger ? 'text-red-400' : active ? 'text-blue-600' : 'text-gray-400'
      )}>
        {icon}
      </span>
      {label}
    </button>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ''
  const initials = displayName ? getInitials(displayName) : '?'

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">

      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800 tracking-tight">AI Resume</span>
      </div>

      {/* User profile */}
      {user ? (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
              <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <NavItem
          icon={<IconHome />}
          label="Home"
          active={pathname === '/'}
          onClick={() => router.push('/')}
        />
        {user && (
          <NavItem
            icon={<IconList />}
            label="My Resumes"
            active={pathname === '/dashboard'}
            onClick={() => router.push('/dashboard')}
          />
        )}
        <NavItem
          icon={<IconPlus />}
          label="Create Resume"
          active={pathname === '/intake'}
          onClick={() => router.push('/')}
        />
        <NavItem
          icon={<IconUpload />}
          label="Upload Resume"
          active={pathname === '/upload'}
          onClick={() => router.push('/upload')}
        />
      </nav>

      {/* Bottom: sign in/out */}
      <div className="px-2 py-3 border-t border-gray-100">
        {user ? (
          <NavItem
            icon={<IconLogout />}
            label="Sign out"
            onClick={handleSignOut}
            danger
          />
        ) : (
          <>
            <NavItem
              icon={<IconLogin />}
              label="Sign in"
              active={pathname === '/auth/login'}
              onClick={() => router.push('/auth/login')}
            />
            <NavItem
              icon={<IconPlus />}
              label="Sign up"
              active={pathname === '/auth/signup'}
              onClick={() => router.push('/auth/signup')}
            />
          </>
        )}
      </div>
    </aside>
  )
}
