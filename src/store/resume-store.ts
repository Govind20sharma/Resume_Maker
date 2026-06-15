'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData } from '@/types/resume'
import type { TemplateId } from '@/types/template'
import type { IntakeAnswers } from '@/lib/intake-helpers'

const EMPTY_INTAKE_ANSWERS: IntakeAnswers = {
  name: null, contact: null, location: null,
  current_role: null, experience_years: null, skills: null,
  education: null, achievements: null, projects: null, summary: null,
}

export interface PendingEnhance {
  sectionKey: string
  sectionLabel: string
  prompt: string
}

interface ResumeStore {
  resumeData: ResumeData | null
  selectedTemplateId: TemplateId | null
  aiCallCount: number
  intakeStep: number
  intakeAnswers: IntakeAnswers
  pendingEnhance: PendingEnhance | null

  setResumeData: (data: ResumeData) => void
  updateSection: (section: keyof ResumeData, value: unknown) => void
  selectTemplate: (id: TemplateId) => void
  incrementAiCallCount: () => void
  setIntakeStep: (step: number) => void
  setIntakeAnswers: (answers: IntakeAnswers) => void
  setPendingEnhance: (v: PendingEnhance | null) => void
  resetSession: () => void
}

const initialState = {
  resumeData: null,
  selectedTemplateId: null,
  aiCallCount: 0,
  intakeStep: 0,
  intakeAnswers: EMPTY_INTAKE_ANSWERS,
  pendingEnhance: null,
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      ...initialState,

      setResumeData: (data) => set({ resumeData: data }),

      updateSection: (section, value) =>
        set((state) => ({
          resumeData: state.resumeData
            ? { ...state.resumeData, [section]: value }
            : null,
        })),

      selectTemplate: (id) => set({ selectedTemplateId: id }),

      incrementAiCallCount: () =>
        set((state) => ({ aiCallCount: state.aiCallCount + 1 })),

      setIntakeStep: (step) => set({ intakeStep: step }),

      setIntakeAnswers: (answers) => set({ intakeAnswers: answers }),

      setPendingEnhance: (v) => set({ pendingEnhance: v }),

      resetSession: () => set(initialState),
    }),
    {
      name: 'resume-session',
    }
  )
)
