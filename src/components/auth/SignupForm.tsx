'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) return

    setLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push(redirect)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-4xl">📧</div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then{' '}
            <Link href={`/auth/login?redirect=${redirect}`} className="underline hover:text-foreground">
              sign in
            </Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-muted-foreground">Save and manage your resumes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Govind Sharma"
              required
              className={cn(
                'w-full rounded-md border border-input px-3 py-2 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:border-transparent'
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={cn(
                'w-full rounded-md border border-input px-3 py-2 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:border-transparent'
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              minLength={6}
              required
              className={cn(
                'w-full rounded-md border border-input px-3 py-2 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:border-transparent'
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim() || password.length < 6}
            className={cn(
              'w-full rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium',
              'hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={`/auth/login?redirect=${redirect}`}
            className="underline hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
