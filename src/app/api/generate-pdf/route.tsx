import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resumeDataSchema } from '@/lib/resume-schema'
import { renderToBuffer } from '@react-pdf/renderer'
import ResumePdf from '@/components/templates/pdf/ResumePdf'

const templateIdSchema = z.enum([
  'technical', 'professional', 'creative', 'general', 'executive', 'fresher',
])

const requestSchema = z.object({
  resumeData: resumeDataSchema,
  templateId: templateIdSchema,
})

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

  const { resumeData, templateId } = parsed.data

  try {
    const pdfBuffer = await renderToBuffer(
      <ResumePdf data={resumeData} templateId={templateId} />
    )

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment',
      },
    })
  } catch (err) {
    console.error('[api/generate-pdf]', err)
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
