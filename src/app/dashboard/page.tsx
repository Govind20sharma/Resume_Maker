'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useResumeStore } from '@/store/resume-store'
import type { ResumeData } from '@/types/resume'
import type { TemplateId } from '@/types/template'
import { cn } from '@/lib/utils'

interface SavedResume {
  id: string
  title: string
  target_role: string
  template_id: string
  created_at: string
  resume_data: ResumeData
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
    </svg>
  )
}

function IconFile() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

function ResumeCard({
  resume,
  isSelected,
  onClick,
  onLoad,
  onDelete,
  deletingId,
}: {
  resume: SavedResume
  isSelected: boolean
  onClick: () => void
  onLoad: () => void
  onDelete: () => void
  deletingId: string | null
}) {
  const templateLabel = resume.template_id.charAt(0).toUpperCase() + resume.template_id.slice(1)

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border cursor-pointer transition-all duration-150',
        isSelected
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
        )}>
          <IconFile />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate">{resume.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{resume.target_role}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
              {templateLabel}
            </span>
            <span className="text-[11px] text-gray-400">{formatDate(resume.created_at)}</span>
          </div>
        </div>
        <span className={cn('transition-transform shrink-0 text-gray-400 mt-1', isSelected && 'rotate-90')}>
          <IconChevron />
        </span>
      </div>

      {isSelected && (
        <div
          className="border-t border-blue-100 px-4 py-3 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onLoad}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <IconEdit />
            Open & Edit
          </button>
          <button
            onClick={onDelete}
            disabled={deletingId === resume.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border',
              'border-red-200 text-red-500 hover:bg-red-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <IconTrash />
            {deletingId === resume.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const setResumeData = useResumeStore((s) => s.setResumeData)
  const selectTemplate = useResumeStore((s) => s.selectTemplate)

  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/auth/login?redirect=/dashboard'); return }
    fetchResumes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function fetchResumes() {
    setLoadingResumes(true)
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })
    setResumes((data as SavedResume[]) ?? [])
    setLoadingResumes(false)
  }

  function handleLoad(resume: SavedResume) {
    setResumeData(resume.resume_data)
    selectTemplate(resume.template_id as TemplateId)
    router.push('/editor')
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await supabase.from('resumes').delete().eq('id', id)
    setResumes((prev) => prev.filter((r) => r.id !== id))
    if (selectedId === id) setSelectedId(null)
    setDeletingId(null)
  }

  if (authLoading) return null

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {resumes.length > 0
              ? `${resumes.length} saved resume${resumes.length > 1 ? 's' : ''}`
              : 'No saved resumes yet'}
          </p>
        </div>

        {loadingResumes && (
          <div className="flex items-center gap-3 text-sm text-gray-400 py-12 justify-center">
            <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading your resumes…
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <IconFile />
            </div>
            <p className="text-sm font-medium text-gray-600">No resumes saved yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Create your first resume to get started</p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <IconPlus />
              Create Resume
            </button>
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                isSelected={selectedId === resume.id}
                onClick={() => setSelectedId((prev) => prev === resume.id ? null : resume.id)}
                onLoad={() => handleLoad(resume)}
                onDelete={() => handleDelete(resume.id)}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
