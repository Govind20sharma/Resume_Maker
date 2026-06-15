'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    router.replace(user ? '/dashboard' : '/auth/login')
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground text-sm">
        <span className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
        Verifying your account…
      </div>
    </div>
  )
}
