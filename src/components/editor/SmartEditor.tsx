'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { TEMPLATE_MAP } from '@/components/templates'
import { cn } from '@/lib/utils'
import { serializeSection, deserializeSection } from '@/lib/section-serializer'
import EnhancementPanel from '@/components/editor/EnhancementPanel'
import type { ResumeData } from '@/types/resume'

interface AiPanel {
  sectionKey: string
  sectionLabel: string
  loading: boolean
  suggestion: string | null
  previousSuggestion: string | null
  error: 'rate_limit' | 'ai_error' | null
  userPrompt: string
}

const PREVIEW_SCALE = 0.5
const TEMPLATE_W = 794
const TEMPLATE_H = 1123

// ─── Mode Strip ──────────────────────────────────────────────────────────────

function ModeStrip({
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onAiEnhance,
  aiDisabled,
}: {
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onView}
        className={cn(
          'text-xs px-2 py-0.5 rounded transition-colors',
          !isEditing
            ? 'bg-gray-100 text-gray-700 font-medium'
            : 'text-gray-500 hover:bg-gray-100'
        )}
      >
        View
      </button>
      <button
        onClick={onEdit}
        className={cn(
          'text-xs px-2 py-0.5 rounded transition-colors',
          isEditing
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-500 hover:bg-gray-100'
        )}
      >
        Edit
      </button>
      <button
        onClick={onAiEnhance}
        disabled={aiDisabled}
        title={aiDisabled ? "You've used all 20 AI enhancements this session" : 'AI Enhance'}
        className={cn(
          'text-xs px-2 py-0.5 rounded transition-colors',
          aiPanelOpen
            ? 'bg-purple-100 text-purple-700 font-medium'
            : aiDisabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
        )}
      >
        🤖 AI
      </button>
    </div>
  )
}

// ─── Section Card Wrapper ─────────────────────────────────────────────────────

function SectionCard({
  title,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onAiEnhance,
  aiDisabled,
  children,
}: {
  title: string
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group border rounded-lg p-3 transition-colors',
        aiPanelOpen
          ? 'border-purple-300 bg-purple-50/30'
          : isEditing
          ? 'border-blue-300 bg-blue-50/40'
          : 'border-gray-200 hover:border-blue-200'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        <ModeStrip
          isEditing={isEditing}
          aiPanelOpen={aiPanelOpen}
          onEdit={onEdit}
          onView={onView}
          onAiEnhance={onAiEnhance}
          aiDisabled={aiDisabled}
        />
      </div>
      {children}
    </div>
  )
}

// ─── Summary Section ──────────────────────────────────────────────────────────

function SummarySection({
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  value: string
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: string) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])

  function handleView() {
    onSave(draft)
    onView()
  }

  return (
    <SectionCard title="Summary" isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <textarea
          className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          rows={5}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onSave(draft)}
          autoFocus
        />
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">
          {value || <span className="italic text-gray-300">No summary yet</span>}
        </p>
      )}
    </SectionCard>
  )
}

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillsSection({
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  value: string[]
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: string[]) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState(value.join(', '))
  useEffect(() => { setDraft(value.join(', ')) }, [value])

  function parseSkills(raw: string): string[] {
    return raw.split(',').map((s) => s.trim()).filter(Boolean)
  }

  function handleView() {
    onSave(parseSkills(draft))
    onView()
  }

  return (
    <SectionCard title="Skills" isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <div>
          <textarea
            className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onSave(parseSkills(draft))}
            placeholder="React, TypeScript, Node.js, ..."
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {value.length > 0
            ? value.map((s, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">
                  {s}
                </span>
              ))
            : <span className="text-xs italic text-gray-300">No skills yet</span>}
        </div>
      )}
    </SectionCard>
  )
}

// ─── String-List Section (Certifications / Achievements) ─────────────────────

function StringListSection({
  title,
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  title: string
  value: string[]
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: string[]) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState(value.join('\n'))
  useEffect(() => { setDraft(value.join('\n')) }, [value])

  function parseList(raw: string): string[] {
    return raw.split('\n').map((s) => s.trim()).filter(Boolean)
  }

  function handleView() {
    onSave(parseList(draft))
    onView()
  }

  return (
    <SectionCard title={title} isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <div>
          <textarea
            className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onSave(parseList(draft))}
            placeholder="One item per line"
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-1">One item per line</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {value.length > 0
            ? value.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-gray-300 mt-0.5">•</span>
                  {item}
                </li>
              ))
            : <span className="text-xs italic text-gray-300">Nothing added yet</span>}
        </ul>
      )}
    </SectionCard>
  )
}

// ─── Experience Section ───────────────────────────────────────────────────────

type ExpEntry = ResumeData['experience'][number]

function ExperienceSection({
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  value: ExpEntry[]
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: ExpEntry[]) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState<ExpEntry[]>(value)
  useEffect(() => { setDraft(value) }, [value])

  function updateEntry(i: number, field: keyof ExpEntry, val: string | string[]) {
    setDraft((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  function updateBullets(i: number, raw: string) {
    updateEntry(i, 'bullets', raw.split('\n').map((s) => s.trim()).filter(Boolean))
  }

  function addEntry() {
    setDraft((prev) => [
      ...prev,
      { title: '', company: '', duration: '', bullets: [] },
    ])
  }

  function removeEntry(i: number) {
    setDraft((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleView() {
    onSave(draft)
    onView()
  }

  return (
    <SectionCard title="Experience" isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <div
          className="space-y-4"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              onSave(draft)
            }
          }}
        >
          {draft.map((exp, i) => (
            <div key={i} className="border border-gray-200 rounded p-3 space-y-2 bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateEntry(i, 'title', e.target.value)}
                />
                <button
                  onClick={() => removeEntry(i)}
                  className="text-xs text-red-400 hover:text-red-600 px-1"
                  tabIndex={-1}
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateEntry(i, 'company', e.target.value)}
                />
                <input
                  className="w-32 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="2022 – 2024"
                  value={exp.duration}
                  onChange={(e) => updateEntry(i, 'duration', e.target.value)}
                />
              </div>
              <textarea
                className="w-full text-sm border border-gray-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                rows={3}
                placeholder="Bullets (one per line)"
                value={exp.bullets.join('\n')}
                onChange={(e) => updateBullets(i, e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.length > 0
            ? value.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-800">{exp.title}</span>
                    <span className="text-xs text-gray-400">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500">{exp.company}</p>
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="text-gray-300">•</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            : <span className="text-xs italic text-gray-300">No experience added yet</span>}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Education Section ────────────────────────────────────────────────────────

type EduEntry = ResumeData['education'][number]

function EducationSection({
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  value: EduEntry[]
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: EduEntry[]) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState<EduEntry[]>(value)
  useEffect(() => { setDraft(value) }, [value])

  function updateEntry(i: number, field: keyof EduEntry, val: string | null) {
    setDraft((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  function addEntry() {
    setDraft((prev) => [...prev, { degree: '', institution: '', year: '', grade: null }])
  }

  function removeEntry(i: number) {
    setDraft((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleView() {
    onSave(draft)
    onView()
  }

  return (
    <SectionCard title="Education" isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <div
          className="space-y-3"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              onSave(draft)
            }
          }}
        >
          {draft.map((edu, i) => (
            <div key={i} className="border border-gray-200 rounded p-3 space-y-2 bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Degree / Qualification"
                  value={edu.degree}
                  onChange={(e) => updateEntry(i, 'degree', e.target.value)}
                />
                <button
                  onClick={() => removeEntry(i)}
                  className="text-xs text-red-400 hover:text-red-600 px-1"
                  tabIndex={-1}
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEntry(i, 'institution', e.target.value)}
                />
                <input
                  className="w-24 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => updateEntry(i, 'year', e.target.value)}
                />
              </div>
              <input
                className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Grade / GPA (optional)"
                value={edu.grade ?? ''}
                onChange={(e) => updateEntry(i, 'grade', e.target.value || null)}
              />
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add education
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {value.length > 0
            ? value.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-800">{edu.degree}</span>
                    <span className="text-xs text-gray-400">{edu.year}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}
                  </p>
                </div>
              ))
            : <span className="text-xs italic text-gray-300">No education added yet</span>}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Projects Section ─────────────────────────────────────────────────────────

type ProjectEntry = ResumeData['projects'][number]

function ProjectsSection({
  value,
  isEditing,
  aiPanelOpen,
  onEdit,
  onView,
  onSave,
  onAiEnhance,
  aiDisabled,
}: {
  value: ProjectEntry[]
  isEditing: boolean
  aiPanelOpen?: boolean
  onEdit: () => void
  onView: () => void
  onSave: (v: ProjectEntry[]) => void
  onAiEnhance?: () => void
  aiDisabled?: boolean
}) {
  const [draft, setDraft] = useState<ProjectEntry[]>(value)
  useEffect(() => { setDraft(value) }, [value])

  function updateEntry(i: number, field: keyof ProjectEntry, val: string | null) {
    setDraft((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  function addEntry() {
    setDraft((prev) => [...prev, { name: '', description: '', link: null }])
  }

  function removeEntry(i: number) {
    setDraft((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleView() {
    onSave(draft)
    onView()
  }

  return (
    <SectionCard title="Projects" isEditing={isEditing} aiPanelOpen={aiPanelOpen} onEdit={onEdit} onView={handleView} onAiEnhance={onAiEnhance} aiDisabled={aiDisabled}>
      {isEditing ? (
        <div
          className="space-y-3"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              onSave(draft)
            }
          }}
        >
          {draft.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded p-3 space-y-2 bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Project Name"
                  value={p.name}
                  onChange={(e) => updateEntry(i, 'name', e.target.value)}
                />
                <button
                  onClick={() => removeEntry(i)}
                  className="text-xs text-red-400 hover:text-red-600 px-1"
                  tabIndex={-1}
                >
                  ✕
                </button>
              </div>
              <textarea
                className="w-full text-sm border border-gray-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                rows={2}
                placeholder="Description"
                value={p.description}
                onChange={(e) => updateEntry(i, 'description', e.target.value)}
              />
              <input
                className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Link (optional)"
                value={p.link ?? ''}
                onChange={(e) => updateEntry(i, 'link', e.target.value || null)}
              />
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add project
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {value.length > 0
            ? value.map((p, i) => (
                <div key={i}>
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  {p.link && <span className="text-xs text-gray-400 ml-2">{p.link}</span>}
                  <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                </div>
              ))
            : <span className="text-xs italic text-gray-300">No projects added yet</span>}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Main SmartEditor ─────────────────────────────────────────────────────────

export default function SmartEditor() {
  const router = useRouter()
  const resumeData = useResumeStore((s) => s.resumeData)
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId)
  const updateSection = useResumeStore((s) => s.updateSection)
  const aiCallCount = useResumeStore((s) => s.aiCallCount)
  const incrementAiCallCount = useResumeStore((s) => s.incrementAiCallCount)
  const pendingEnhance = useResumeStore((s) => s.pendingEnhance)
  const setPendingEnhance = useResumeStore((s) => s.setPendingEnhance)

  const [editSection, setEditSection] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [aiPanel, setAiPanel] = useState<AiPanel | null>(null)

  const aiDisabled = aiCallCount >= 20

  // ── AI Enhancement ──
  const callEnhance = useCallback(async (
    sectionKey: string,
    sectionLabel: string,
    userPrompt?: string,
    prevSuggestion?: string | null,
  ) => {
    if (!resumeData) return
    const currentText = serializeSection(sectionKey, resumeData)

    setAiPanel((prev) => ({
      sectionKey,
      sectionLabel,
      loading: true,
      suggestion: prev?.sectionKey === sectionKey ? prev.suggestion : null,
      previousSuggestion: prevSuggestion ?? null,
      error: null,
      userPrompt: userPrompt ?? prev?.userPrompt ?? '',
    }))

    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ai-call-count': String(aiCallCount),
        },
        body: JSON.stringify({
          sectionName: sectionLabel,
          currentText,
          targetRole: resumeData.target_role,
          previousSuggestion: prevSuggestion ?? undefined,
          userPrompt: userPrompt ?? undefined,
        }),
      })

      if (res.status === 429) {
        setAiPanel((prev) => prev ? { ...prev, loading: false, error: 'rate_limit' } : null)
        return
      }
      if (!res.ok) {
        setAiPanel((prev) => prev ? { ...prev, loading: false, error: 'ai_error' } : null)
        return
      }

      const json = await res.json()
      incrementAiCallCount()
      setAiPanel((prev) => prev ? {
        ...prev,
        loading: false,
        suggestion: json.data as string,
        previousSuggestion: null,
        error: null,
      } : null)
    } catch {
      setAiPanel((prev) => prev ? { ...prev, loading: false, error: 'ai_error' } : null)
    }
  }, [resumeData, aiCallCount, incrementAiCallCount])

  function handleAiEnhance(sectionKey: string, sectionLabel: string) {
    if (aiPanel?.sectionKey === sectionKey) {
      // same section clicked again → close
      setAiPanel(null)
      return
    }
    callEnhance(sectionKey, sectionLabel)
  }

  function handleAccept() {
    if (!aiPanel?.suggestion || !resumeData) return
    const value = deserializeSection(aiPanel.sectionKey, aiPanel.suggestion, resumeData)
    updateSection(aiPanel.sectionKey as keyof ResumeData, value)
    setAiPanel(null)
  }

  function handleRegenerate() {
    if (!aiPanel) return
    callEnhance(aiPanel.sectionKey, aiPanel.sectionLabel, aiPanel.userPrompt, aiPanel.suggestion)
  }

  useEffect(() => {
    if (!resumeData) { router.replace('/'); return }
    if (!selectedTemplateId) { router.replace('/templates'); return }
  }, [resumeData, selectedTemplateId, router])

  // Open Enhancement Panel pre-loaded with keyword from ATS Fix button
  useEffect(() => {
    if (!pendingEnhance || !resumeData) return
    const { sectionKey, sectionLabel, prompt } = pendingEnhance
    setPendingEnhance(null)
    callEnhance(sectionKey, sectionLabel, prompt)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingEnhance, resumeData])

  if (!resumeData || !selectedTemplateId) return null

  const TemplateComponent = TEMPLATE_MAP[selectedTemplateId]

  // ── Download ──
  async function handleDownload() {
    if (!resumeData || !selectedTemplateId) return
    setDownloading(true)
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, templateId: selectedTemplateId }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const parts = resumeData.contact.name.trim().split(/\s+/)
      a.href = url
      a.download = `${parts[0] ?? 'My'}-${parts[parts.length - 1] ?? 'Resume'}-Resume.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      router.push('/download')
    } catch (err) {
      console.error('[SmartEditor] download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  // ── Editor layout ──
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0 gap-4"
        style={{ height: 56 }}
      >
        <span className="font-semibold text-gray-800 text-sm">Smart Editor</span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {downloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Download PDF'
            )}
          </button>
        </div>
      </header>

      {/* Two-panel body */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left: live preview */}
        <div
          className="overflow-y-auto bg-gray-100 border-r border-gray-200 flex items-start justify-center p-6 shrink-0"
          style={{ width: '55%' }}
        >
          <div
            style={{
              width: TEMPLATE_W * PREVIEW_SCALE,
              height: TEMPLATE_H * PREVIEW_SCALE,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                width: TEMPLATE_W,
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            >
              <TemplateComponent data={resumeData} />
            </div>
          </div>
        </div>

        {/* Right: section controls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white" style={{ minHeight: 0 }}>
          <SummarySection
            value={resumeData.summary}
            isEditing={editSection === 'summary'}
            onEdit={() => setEditSection('summary')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('summary', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'summary'}
            onAiEnhance={() => handleAiEnhance('summary', 'Summary')}
            aiDisabled={aiDisabled}
          />
          <ExperienceSection
            value={resumeData.experience}
            isEditing={editSection === 'experience'}
            onEdit={() => setEditSection('experience')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('experience', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'experience'}
            onAiEnhance={() => handleAiEnhance('experience', 'Experience')}
            aiDisabled={aiDisabled}
          />
          <SkillsSection
            value={resumeData.skills}
            isEditing={editSection === 'skills'}
            onEdit={() => setEditSection('skills')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('skills', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'skills'}
            onAiEnhance={() => handleAiEnhance('skills', 'Skills')}
            aiDisabled={aiDisabled}
          />
          <EducationSection
            value={resumeData.education}
            isEditing={editSection === 'education'}
            onEdit={() => setEditSection('education')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('education', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'education'}
            onAiEnhance={() => handleAiEnhance('education', 'Education')}
            aiDisabled={aiDisabled}
          />
          <ProjectsSection
            value={resumeData.projects}
            isEditing={editSection === 'projects'}
            onEdit={() => setEditSection('projects')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('projects', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'projects'}
            onAiEnhance={() => handleAiEnhance('projects', 'Projects')}
            aiDisabled={aiDisabled}
          />
          <StringListSection
            title="Certifications"
            value={resumeData.certifications}
            isEditing={editSection === 'certifications'}
            onEdit={() => setEditSection('certifications')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('certifications', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'certifications'}
            onAiEnhance={() => handleAiEnhance('certifications', 'Certifications')}
            aiDisabled={aiDisabled}
          />
          <StringListSection
            title="Achievements"
            value={resumeData.achievements}
            isEditing={editSection === 'achievements'}
            onEdit={() => setEditSection('achievements')}
            onView={() => setEditSection(null)}
            onSave={(v) => updateSection('achievements', v)}
            aiPanelOpen={aiPanel?.sectionKey === 'achievements'}
            onAiEnhance={() => handleAiEnhance('achievements', 'Achievements')}
            aiDisabled={aiDisabled}
          />
        </div>
      </div>

      {/* AI Enhancement Panel */}
      <EnhancementPanel
        open={aiPanel !== null}
        sectionLabel={aiPanel?.sectionLabel ?? ''}
        currentText={aiPanel && resumeData ? serializeSection(aiPanel.sectionKey, resumeData) : ''}
        suggestion={aiPanel?.suggestion ?? null}
        loading={aiPanel?.loading ?? false}
        error={aiPanel?.error ?? null}
        userPrompt={aiPanel?.userPrompt ?? ''}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        onClose={() => setAiPanel(null)}
        onPromptChange={(v) => setAiPanel((prev) => prev ? { ...prev, userPrompt: v } : null)}
        onPromptSubmit={() => {
          if (!aiPanel) return
          callEnhance(aiPanel.sectionKey, aiPanel.sectionLabel, aiPanel.userPrompt, aiPanel.suggestion)
        }}
      />
    </div>
  )
}
