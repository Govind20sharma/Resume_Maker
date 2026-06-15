import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-provider'
import { parseResumeDataFromAI } from '@/lib/intake-helpers'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const EXTRACTION_SYSTEM_PROMPT = `You are a resume parser. Extract information from the provided resume text into structured JSON.

CRITICAL RULES:
1. Extract ONLY what is explicitly stated — never invent, infer, or fabricate any detail
2. For array fields (experience, education, skills, projects, certifications, achievements): use [] when no data present — NEVER null
3. For nullable string fields (linkedin, portfolio, grade): use null when absent
4. Return ONLY valid JSON — no markdown, no explanation, no preamble
5. Preserve job titles, company names, and dates exactly as written in the source
6. The "summary" field: use the resume's own summary/profile if present; otherwise write 2-3 sentences in third person from the content

JSON Schema to follow exactly:
{
  "target_role": "string (most recent job title or inferred role)",
  "jd_keywords": null,
  "summary": "string",
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string | null",
    "portfolio": "string | null"
  },
  "experience": [{ "title": "string", "company": "string", "duration": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "year": "string", "grade": "string | null" }],
  "skills": ["string"],
  "projects": [{ "name": "string", "description": "string", "link": "string | null" }],
  "certifications": ["string"],
  "achievements": ["string"]
}`

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json(
      { error: 'Invalid form data', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const file = formData.get('file') as File | null
  const targetRole = (formData.get('targetRole') as string | null) ?? ''

  if (!file) {
    return NextResponse.json(
      { error: 'No file provided', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // Size check
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File must be under 5 MB', code: 'FILE_TOO_LARGE' },
      { status: 413 }
    )
  }

  // Type check
  const name = file.name.toLowerCase()
  const isPdf = name.endsWith('.pdf')
  const isDocx = name.endsWith('.docx')

  if (!isPdf && !isDocx) {
    return NextResponse.json(
      { error: 'Only PDF and DOCX files are supported', code: 'UNSUPPORTED_FILE_TYPE' },
      { status: 400 }
    )
  }

  // Extract text
  let text = ''
  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    if (isPdf) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
      const result = await pdfParse(buffer)
      text = result.text
    } else {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    }
  } catch (err) {
    console.error('[api/parse-resume] extraction error:', err)
    return NextResponse.json(
      { error: 'Failed to extract text from file', code: 'EXTRACTION_ERROR' },
      { status: 500 }
    )
  }

  // Low-quality check
  if (text.trim().length < 100) {
    return NextResponse.json(
      { error: 'Resume text could not be extracted', code: 'LOW_QUALITY_PARSE' },
      { status: 422 }
    )
  }

  // Build prompt — include targetRole if provided so AI can override target_role field
  const prompt = targetRole
    ? `Target role (from user input): ${targetRole}\n\nResume text:\n${text}`
    : `Resume text:\n${text}`

  const aiResult = await callAI({ prompt, systemPrompt: EXTRACTION_SYSTEM_PROMPT })

  if ('error' in aiResult) {
    return NextResponse.json(
      { error: 'AI service unavailable', code: 'AI_UNAVAILABLE' },
      { status: 503 }
    )
  }

  const parseResult = parseResumeDataFromAI(aiResult.data)

  if (!parseResult.success) {
    console.error('[api/parse-resume] parse failed:', parseResult.error)
    return NextResponse.json(
      { error: 'Failed to parse resume data', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  // If user supplied a target role, override whatever the AI inferred
  const data = targetRole
    ? { ...parseResult.data, target_role: targetRole }
    : parseResult.data

  return NextResponse.json({ data })
}
