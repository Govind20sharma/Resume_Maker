'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { cn } from '@/lib/utils'
import type { ResumeData } from '@/types/resume'

const MAX_SIZE = 5 * 1024 * 1024

export default function FileUpload() {
  const router = useRouter()
  const resumeData = useResumeStore((s) => s.resumeData)
  const setResumeData = useResumeStore((s) => s.setResumeData)
  const setIntakeStep = useResumeStore((s) => s.setIntakeStep)

  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((file: File): string | null => {
    if (file.size > MAX_SIZE) return 'File must be under 5 MB'
    const name = file.name.toLowerCase()
    if (!name.endsWith('.pdf') && !name.endsWith('.docx'))
      return 'Only PDF and DOCX files are supported'
    return null
  }, [])

  async function processFile(file: File) {
    const validationError = validate(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setFileName(file.name)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetRole', resumeData?.target_role ?? '')

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok || 'error' in json) {
        if (json.code === 'LOW_QUALITY_PARSE') {
          setError('Resume text could not be extracted — try a different file or switch to guided intake.')
        } else if (json.code === 'FILE_TOO_LARGE') {
          setError('File must be under 5 MB')
        } else if (json.code === 'UNSUPPORTED_FILE_TYPE') {
          setError('Only PDF and DOCX files are supported')
        } else {
          setError(json.error ?? 'Failed to process file. Please try again.')
        }
        setUploading(false)
        return
      }

      const parsed = json.data as ResumeData
      // Merge jd_keywords from store (set on landing page) into parsed data
      const merged: ResumeData = {
        ...parsed,
        jd_keywords: resumeData?.jd_keywords ?? null,
      }

      setResumeData(merged)
      setIntakeStep(0) // reset intake state since we're on Path B
      router.push('/confirm')
    } catch {
      setError('Could not connect to the server. Please try again.')
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so same file can be re-selected after error
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-6">

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Upload your resume</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll extract your information and load it into the editor automatically.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'relative rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Processing <span className="text-foreground">{fileName}</span>…
              </p>
              <p className="text-xs text-muted-foreground">This may take a few seconds</p>
            </div>
          ) : fileName && !error ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📄</span>
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">Click to choose a different file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">📎</span>
              <div>
                <p className="text-sm font-medium">
                  Drag & drop your resume here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse — PDF or DOCX, max 5 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => router.push('/intake')}
              className="text-sm text-destructive underline mt-1 hover:no-underline"
            >
              Switch to guided intake instead
            </button>
          </div>
        )}

        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to start
        </button>
      </div>
    </div>
  )
}
