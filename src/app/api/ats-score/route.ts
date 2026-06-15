import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { callAI } from '@/lib/ai-provider'
import { resumeDataSchema } from '@/lib/resume-schema'
import { serializeSection } from '@/lib/section-serializer'

const requestSchema = z.object({
  resumeData: resumeDataSchema,
  jdKeywords: z.array(z.string()).min(1),
})

export interface MissingKeyword {
  keyword: string
  section: string
  sectionKey: string
}

export interface AtsScoreResult {
  score: number
  missingKeywords: MissingKeyword[]
}

const VALID_SECTION_KEYS = new Set([
  'summary', 'experience', 'skills', 'education',
  'projects', 'certifications', 'achievements',
])

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) expert analysing resume-to-keyword coverage.

Return ONLY valid JSON in this exact format — no markdown, no explanation:
{
  "score": <integer 0-100, percentage of keywords well-covered>,
  "missingKeywords": [
    {
      "keyword": "<the missing or under-represented keyword>",
      "section": "<human-readable section name, e.g. 'Work Experience'>",
      "sectionKey": "<one of: summary|experience|skills|education|projects|certifications|achievements>"
    }
  ]
}

Rules:
- A keyword is "covered" if it, a synonym, or a clear abbreviation appears meaningfully in the resume
- score = round((covered count / total keywords) * 100)
- List at most 8 missing keywords — pick the most impactful ones
- For each missing keyword, choose the sectionKey where it would most naturally fit`

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { resumeData, jdKeywords } = parsed.data

  // Build a comprehensive resume text for the AI to analyse
  const resumeText = [
    serializeSection('summary', resumeData),
    serializeSection('experience', resumeData),
    serializeSection('skills', resumeData),
    serializeSection('education', resumeData),
    serializeSection('projects', resumeData),
    serializeSection('certifications', resumeData),
    serializeSection('achievements', resumeData),
  ]
    .filter(Boolean)
    .join('\n\n')

  const prompt = `Job keywords to check:\n${jdKeywords.join(', ')}\n\nResume content:\n${resumeText}`

  const aiResult = await callAI({ prompt, systemPrompt: SYSTEM_PROMPT })

  if ('error' in aiResult) {
    return NextResponse.json(
      { error: 'AI service unavailable', code: 'AI_UNAVAILABLE' },
      { status: 503 }
    )
  }

  let result: AtsScoreResult
  try {
    const cleaned = aiResult.data
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const json = JSON.parse(cleaned) as { score: unknown; missingKeywords: unknown[] }

    // Sanitise
    const score = Math.max(0, Math.min(100, Math.round(Number(json.score) || 0)))
    const missingKeywords = (Array.isArray(json.missingKeywords) ? json.missingKeywords : [])
      .slice(0, 8)
      .map((item) => {
        const k = item as Record<string, unknown>
        return {
          keyword: String(k.keyword ?? ''),
          section: String(k.section ?? ''),
          sectionKey: VALID_SECTION_KEYS.has(String(k.sectionKey))
            ? String(k.sectionKey)
            : 'skills',
        }
      })
      .filter((k) => k.keyword)

    result = { score, missingKeywords }
  } catch (err) {
    console.error('[api/ats-score] parse error:', err)
    return NextResponse.json(
      { error: 'Failed to analyse keywords', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: result })
}
