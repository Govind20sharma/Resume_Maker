'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  sectionLabel: string
  currentText: string
  suggestion: string | null
  loading: boolean
  error: 'rate_limit' | 'ai_error' | null
  userPrompt: string
  onAccept: () => void
  onRegenerate: () => void
  onClose: () => void
  onPromptChange: (v: string) => void
  onPromptSubmit: () => void
}

export default function EnhancementPanel({
  open,
  sectionLabel,
  currentText,
  suggestion,
  loading,
  error,
  userPrompt,
  onAccept,
  onRegenerate,
  onClose,
  onPromptChange,
  onPromptSubmit,
}: Props) {
  const promptRef = useRef<HTMLTextAreaElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  function handlePromptKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userPrompt.trim()) onPromptSubmit()
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 bg-white border-l border-gray-200 shadow-2xl z-30 flex flex-col transition-transform duration-200 ease-out',
        open ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{ top: 56, width: '42%' }}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">🤖 AI Enhance</span>
          <h2 className="text-sm font-semibold text-gray-800 mt-0.5">{sectionLabel}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

        {/* Current text */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Current</p>
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-3 leading-relaxed whitespace-pre-wrap border border-gray-100">
            {currentText || <span className="italic">(empty)</span>}
          </div>
        </div>

        {/* AI Suggestion */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">AI Suggestion</p>

          {error === 'rate_limit' ? (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              You&apos;ve used all 20 AI enhancements for this session — you can still edit manually.
            </div>
          ) : error === 'ai_error' ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              AI is currently unavailable — you can still edit manually.
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded p-3 border border-gray-100">
              <span className="w-3.5 h-3.5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin shrink-0" />
              Improving your content...
            </div>
          ) : suggestion ? (
            <div className="text-sm text-gray-700 bg-purple-50 rounded p-3 leading-relaxed whitespace-pre-wrap border border-purple-100">
              {suggestion}
            </div>
          ) : (
            <div className="text-sm text-gray-400 bg-gray-50 rounded p-3 border border-gray-100 italic">
              Suggestion will appear here
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!error && (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              disabled={!suggestion || loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ✓ Accept
            </button>
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : '↺'} Regenerate
            </button>
          </div>
        )}
      </div>

      {/* User prompt footer */}
      {error !== 'rate_limit' && (
        <div className="shrink-0 border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 mb-1.5">Give the AI a specific instruction:</p>
          <div className="flex gap-2 items-end">
            <textarea
              ref={promptRef}
              className="flex-1 text-sm border border-gray-200 rounded px-2.5 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-purple-400"
              rows={2}
              placeholder="'make it shorter', 'add metrics', 'use different tone'..."
              value={userPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              disabled={loading}
            />
            <button
              onClick={() => { if (userPrompt.trim()) onPromptSubmit() }}
              disabled={!userPrompt.trim() || loading}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
