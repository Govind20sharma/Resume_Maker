import { z } from 'zod'
import { callAI } from '@/lib/ai-provider'
import { buildIntakePrompt, parseResumeDataFromAI, INTAKE_SYSTEM_PROMPT } from '@/lib/intake-helpers'

const intakeRequestSchema = z.object({
  targetRole: z.string().min(1),
  answers: z.object({
    name: z.string().nullable(),
    contact: z.string().nullable(),
    location: z.string().nullable(),
    current_role: z.string().nullable(),
    experience_years: z.string().nullable(),
    skills: z.string().nullable(),
    education: z.string().nullable(),
    achievements: z.string().nullable(),
    projects: z.string().nullable(),
    summary: z.string().nullable(),
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = intakeRequestSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request body', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const { targetRole, answers } = parsed.data
    const prompt = buildIntakePrompt(targetRole, answers)

    const aiResult = await callAI({ prompt, systemPrompt: INTAKE_SYSTEM_PROMPT })

    if ('error' in aiResult) {
      return Response.json(
        { error: 'AI service unavailable', code: 'AI_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const parseResult = parseResumeDataFromAI(aiResult.data)

    if (!parseResult.success) {
      console.error('[api/intake] parse failed:', parseResult.error)
      return Response.json(
        { error: 'Failed to generate resume data', code: 'SERVER_ERROR' },
        { status: 500 }
      )
    }

    return Response.json({ data: parseResult.data })
  } catch (err) {
    console.error('[api/intake]', err)
    return Response.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
