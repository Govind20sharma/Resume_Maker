'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { AtsScoreResult, MissingKeyword } from '@/app/api/ats-score/route'

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 80) return <span className="text-green-600 font-semibold">Strong Match</span>
  if (score >= 60) return <span className="text-amber-600 font-semibold">Good Match</span>
  return <span className="text-red-600 font-semibold">Needs Work</span>
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="48" y="53" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
        {score}%
      </text>
    </svg>
  )
}

export default function DownloadScreen() {
  const router = useRouter()
  const resumeData = useResumeStore((s) => s.resumeData)
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId)
  const resetSession = useResumeStore((s) => s.resetSession)
  const setPendingEnhance = useResumeStore((s) => s.setPendingEnhance)

  const { user } = useAuth()

  const [atsLoading, setAtsLoading] = useState(false)
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null)
  const [atsError, setAtsError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const hasJd = Boolean(resumeData?.jd_keywords?.length)

  useEffect(() => {
    if (!resumeData) { router.replace('/'); return }
    if (!hasJd) return

    setAtsLoading(true)
    fetch('/api/ats-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData,
        jdKeywords: resumeData.jd_keywords,
      }),
    })
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok || 'error' in json) throw new Error(json.error ?? 'Failed')
        setAtsResult(json.data as AtsScoreResult)
      })
      .catch(() => setAtsError('Could not calculate ATS score — you can still download your resume.'))
      .finally(() => setAtsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!resumeData) return null

  async function handleSave() {
    if (!resumeData || !selectedTemplateId) return

    if (!user) {
      router.push('/auth/login?redirect=/download')
      return
    }

    setSaving(true)
    setSaveError(null)

    const title = resumeData.contact.name
      ? `${resumeData.contact.name} — ${resumeData.target_role}`
      : resumeData.target_role

    const { error } = await supabase.from('resumes').insert({
      user_id: user.id,
      title,
      target_role: resumeData.target_role,
      resume_data: resumeData,
      template_id: selectedTemplateId,
    })

    setSaving(false)
    if (error) {
      setSaveError('Could not save resume. Please try again.')
    } else {
      setSaved(true)
    }
  }

  function handleFix(kw: MissingKeyword) {
    setPendingEnhance({
      sectionKey: kw.sectionKey,
      sectionLabel: SECTION_LABELS[kw.sectionKey] ?? kw.section,
      prompt: `Add or incorporate the keyword "${kw.keyword}" naturally`,
    })
    router.push('/editor')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-xl space-y-6">

        {/* Success */}
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Your resume is ready!</h1>
          <p className="text-sm text-gray-500">Check your downloads folder for the PDF file.</p>
        </div>

        {/* ATS Score */}
        {hasJd && (
          <div className="rounded-xl border border-border bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              ATS Keyword Match
            </h2>

            {atsLoading && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin shrink-0" />
                Analysing keyword coverage…
              </div>
            )}

            {atsError && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
                {atsError}
              </p>
            )}

            {atsResult && (
              <>
                <div className="flex items-center gap-5">
                  <ScoreRing score={atsResult.score} />
                  <div>
                    <ScoreLabel score={atsResult.score} />
                    <p className="text-sm text-gray-500 mt-0.5">
                      {atsResult.score}% of job keywords covered
                    </p>
                  </div>
                </div>

                {atsResult.missingKeywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Missing keywords
                    </p>
                    <ul className="space-y-2">
                      {atsResult.missingKeywords.map((kw) => (
                        <li
                          key={kw.keyword}
                          className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-800">{kw.keyword}</span>
                            <span className="ml-2 text-xs text-gray-400">→ {kw.section}</span>
                          </div>
                          <button
                            onClick={() => handleFix(kw)}
                            className="shrink-0 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                          >
                            Fix
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {atsResult.missingKeywords.length === 0 && (
                  <p className="text-sm text-green-700 bg-green-50 rounded p-3 border border-green-200">
                    All keywords are covered — your resume is well-optimised for this role!
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { resetSession(); router.push('/') }}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Create another version
          </button>
          <button
            onClick={() => router.push('/editor')}
            className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
          >
            Back to editor
          </button>
        </div>

        {saveError && (
          <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{saveError}</p>
        )}

        {saved ? (
          <div className="flex items-center justify-between rounded-md bg-green-50 border border-green-200 px-4 py-2.5">
            <span className="text-sm text-green-700 font-medium">✓ Saved to your account</span>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-green-700 underline hover:no-underline"
            >
              View all resumes
            </button>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'w-full px-4 py-2.5 border border-border rounded-md text-sm font-medium',
              'text-gray-700 hover:bg-muted/50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {saving
              ? 'Saving…'
              : user
              ? 'Save your resume'
              : 'Sign in to save your resume'}
          </button>
        )}
      </div>
    </div>
  )
}
