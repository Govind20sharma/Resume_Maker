import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { callAI } from '@/lib/ai-provider'
import { isRateLimited } from '@/lib/rate-limiter'

const requestSchema = z.object({
  sectionName: z.string().min(1),
  currentText: z.string().min(1),
  targetRole: z.string().min(1),
  previousSuggestion: z.string().optional(),
  userPrompt: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const callCount = parseInt(req.headers.get('x-ai-call-count') ?? '0', 10)
  if (isRateLimited(callCount)) {
    return NextResponse.json(
      { error: 'Session AI limit reached', code: 'RATE_LIMIT_EXCEEDED' },
      { status: 429 }
    )
  }

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

  const { sectionName, currentText, targetRole, previousSuggestion, userPrompt } = parsed.data

  const systemPrompt = `You are a professional resume writer improving a "${sectionName}" section for a ${targetRole} role.

RULES — follow without exception:
1. NEVER add, invent, or infer any fact, skill, title, company, date, or achievement not in the source content.
2. Only improve the language, clarity, impact, and professionalism of what already exists.
3. Use active verbs. Quantify achievements only if numbers already appear in the source.
4. Preserve the exact same structure and format as the original.
5. Return ONLY the improved text — no explanation, no preamble, no markdown.`

  let userContent = `Improve this ${sectionName} section:\n\n${currentText}`

  if (previousSuggestion) {
    userContent += `\n\nPrevious suggestion (provide a meaningfully different improvement):\n${previousSuggestion}`
  }

  if (userPrompt) {
    userContent += `\n\nAdditional instruction from user: ${userPrompt}`
  }

  const result = await callAI({ prompt: userContent, systemPrompt })

  if ('error' in result) {
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status: 503 }
    )
  }

  return NextResponse.json({ data: result.data })
}
