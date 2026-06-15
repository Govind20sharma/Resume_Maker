'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { INTAKE_QUESTIONS } from '@/lib/intake-questions'
import type { IntakeAnswers } from '@/lib/intake-helpers'
import { cn } from '@/lib/utils'

interface IntakeChatProps {
  /** Test helper — jumps to last question immediately */
  skipToLast?: boolean
}

export default function IntakeChat({ skipToLast = false }: IntakeChatProps) {
  const router = useRouter()
  const { resumeData, setResumeData, intakeStep, intakeAnswers, setIntakeStep, setIntakeAnswers } = useResumeStore()

  const currentIndex = skipToLast ? INTAKE_QUESTIONS.length - 1 : intakeStep
  const answers = intakeAnswers

  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const question = INTAKE_QUESTIONS[currentIndex]
  const isLastQuestion = currentIndex === INTAKE_QUESTIONS.length - 1
  const totalQuestions = INTAKE_QUESTIONS.length

  function goBack() {
    if (currentIndex > 0) {
      setIntakeStep(currentIndex - 1)
      setCurrentAnswer('')
      setError(null)
    }
  }

  async function advance(answer: string | null) {
    const updatedAnswers: IntakeAnswers = { ...answers, [question.id]: answer || null }
    setIntakeAnswers(updatedAnswers)
    setCurrentAnswer('')

    if (!isLastQuestion) {
      setIntakeStep(currentIndex + 1)
      return
    }

    // Last question — call AI
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: resumeData?.target_role ?? '',
          answers: updatedAnswers,
        }),
      })

      const json = await res.json()

      if (!res.ok || 'error' in json) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      setResumeData(json.data)
      router.push('/confirm')
    } catch {
      setError('Could not connect to the server. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Building your resume</h1>
          <p className="text-sm text-muted-foreground">
            Targeting: <span className="font-medium text-foreground">{resumeData?.target_role}</span>
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <p className="text-base font-medium">{question.question}</p>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                advance(currentAnswer)
              }
            }}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            {currentIndex > 0 && (
              <button
                onClick={goBack}
                disabled={isLoading}
                className="px-4 py-2 text-sm border border-input rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => advance(currentAnswer)}
              disabled={isLoading}
              className={cn(
                'flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium',
                'hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? 'Generating resume…' : isLastQuestion ? 'Generate Resume →' : 'Next →'}
            </button>
            <button
              onClick={() => advance(null)}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Already answered — show count */}
        {currentIndex > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            {currentIndex} question{currentIndex > 1 ? 's' : ''} answered
          </p>
        )}
      </div>
    </div>
  )
}
