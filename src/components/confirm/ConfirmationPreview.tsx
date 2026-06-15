'use client'

import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import type { ResumeData } from '@/types/resume'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="py-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <p className="text-sm mt-0.5">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

export default function ConfirmationPreview() {
  const router = useRouter()
  const { resumeData } = useResumeStore()

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No resume data found. <button onClick={() => router.push('/')} className="underline">Start over</button></p>
      </div>
    )
  }

  const d: ResumeData = resumeData

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Does this look right?</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review your information. Click any field to edit it.
          </p>
        </div>

        {/* Contact */}
        <Section title="Contact">
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Name" value={d.contact.name} />
            <Field label="Email" value={d.contact.email} />
            <Field label="Phone" value={d.contact.phone} />
            <Field label="Location" value={d.contact.location} />
            <Field label="LinkedIn" value={d.contact.linkedin} />
            <Field label="Portfolio" value={d.contact.portfolio} />
          </div>
        </Section>

        {/* Summary */}
        {d.summary && (
          <Section title="Summary">
            <p className="text-sm">{d.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {d.experience.length > 0 && (
          <Section title="Experience">
            {d.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-medium">{exp.title} — {exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.duration}</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-muted-foreground">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {d.education.length > 0 && (
          <Section title="Education">
            {d.education.map((edu, i) => (
              <div key={i}>
                <p className="text-sm font-medium">{edu.degree} — {edu.institution}</p>
                <p className="text-xs text-muted-foreground">{edu.year}{edu.grade ? ` · ${edu.grade}` : ''}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {d.skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {d.skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-muted text-xs rounded-full">{s}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Achievements */}
        {d.achievements.length > 0 && (
          <Section title="Achievements">
            <ul className="list-disc list-inside space-y-0.5">
              {d.achievements.map((a, i) => <li key={i} className="text-sm">{a}</li>)}
            </ul>
          </Section>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push('/intake')}
            className="px-4 py-2 text-sm border border-input rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Go back
          </button>
          <button
            onClick={() => router.push('/templates')}
            className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Looks good → Pick a template
          </button>
        </div>
      </div>
    </div>
  )
}
