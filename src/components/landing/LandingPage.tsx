'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const router = useRouter()
  const { setResumeData } = useResumeStore()

  const [role, setRole] = useState('')
  const [jd, setJd] = useState('')
  const [roleError, setRoleError] = useState('')

  function buildResumeStub(targetRole: string, rawJd: string) {
    const jdKeywords = rawJd.trim()
      ? Array.from(
          new Set(
            rawJd
              .split(/[\s,.\n]+/)
              .map((w) => w.trim())
              .filter((w) => w.length > 3)
          )
        )
      : null

    return {
      target_role: targetRole,
      jd_keywords: jdKeywords,
      summary: '',
      contact: { name: '', email: '', phone: '', location: '', linkedin: null, portfolio: null },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role.trim()) {
      setRoleError('Please enter the role you\'re targeting')
      return
    }
    setRoleError('')
    setResumeData(buildResumeStub(role.trim(), jd))
    router.push('/intake')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Resume Builder</h1>
          <p className="text-muted-foreground text-lg">
            Build a professional resume in minutes — powered by AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Target role */}
          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-medium">
              What role are you targeting?
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                if (e.target.value.trim()) setRoleError('')
              }}
              placeholder="e.g. Frontend Developer, Marketing Manager"
              className={cn(
                'w-full rounded-md border px-3 py-2 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:border-transparent',
                roleError ? 'border-destructive' : 'border-input'
              )}
            />
            {roleError && (
              <p className="text-sm text-destructive">{roleError}</p>
            )}
          </div>

          {/* Optional JD */}
          <div className="space-y-1">
            <label htmlFor="jd" className="block text-sm font-medium">
              Job Description{' '}
              <span className="text-muted-foreground font-normal">(optional — unlocks ATS score)</span>
            </label>
            <textarea
              id="jd"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here…"
              rows={5}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Build My Resume →
            </button>
            {/* <button
              type="button"
              onClick={handlePathB}
              className="flex-1 rounded-md border border-input px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              Improve Existing Resume
            </button> */}
          </div>
        </form>
      </div>
    </main>
  )
}
