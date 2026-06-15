import OpenAI from 'openai'
import type { ApiError } from '@/types/api'

export const AI_MODEL = 'gpt-4o-mini'

interface CallAIParams {
  prompt: string
  systemPrompt: string
}

type CallAIResult = { data: string } | ApiError

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.PUBG })
  }
  return client
}

export async function callAI({ prompt, systemPrompt }: CallAIParams): Promise<CallAIResult> {
  try {
    const completion = await getClient().chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    })
    const text = completion.choices[0]?.message?.content ?? ''
    return { data: text }
  } catch (err) {
    console.error('[ai-provider] callAI error:', err)
    return { error: 'AI service unavailable', code: 'AI_UNAVAILABLE' }
  }
}
