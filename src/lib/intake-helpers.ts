import { resumeDataSchema } from '@/lib/resume-schema'
import type { ResumeData } from '@/types/resume'

export interface IntakeAnswers {
  name: string | null
  contact: string | null
  location: string | null
  current_role: string | null
  experience_years: string | null
  skills: string | null
  education: string | null
  achievements: string | null
  projects: string | null
  summary: string | null
}

export function buildIntakePrompt(targetRole: string, answers: IntakeAnswers): string {
  const lines = [
    `Target role: ${targetRole}`,
    answers.name ? `Full name: ${answers.name}` : null,
    answers.contact ? `Contact info: ${answers.contact}` : null,
    answers.location ? `Location: ${answers.location}` : null,
    answers.current_role ? `Current/most recent role: ${answers.current_role}` : null,
    answers.experience_years ? `Years of experience: ${answers.experience_years}` : null,
    answers.skills ? `Skills: ${answers.skills}` : null,
    answers.education ? `Education: ${answers.education}` : null,
    answers.achievements ? `Achievements: ${answers.achievements}` : null,
    answers.projects ? `Projects/certifications: ${answers.projects}` : null,
    answers.summary ? `Self-description: ${answers.summary}` : null,
  ].filter(Boolean)

  return lines.join('\n')
}

export const INTAKE_SYSTEM_PROMPT = `You are a professional resume writer. Given the candidate's information below, create a structured JSON resume.

CRITICAL RULES:
- Only use facts explicitly provided — never invent, infer, or fabricate any detail
- For array fields (experience, education, skills, projects, certifications, achievements): use [] when there is no data — NEVER null
- For nullable string fields (linkedin, portfolio, grade): use null when there is no data
- Return ONLY valid JSON matching the schema exactly — no markdown, no explanation
- The "summary" field must be 2-3 professional sentences written in third person
- Split contact info (email/phone/linkedin/portfolio) from the contact string intelligently

JSON Schema to follow exactly:
{
  "target_role": "string",
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

type ParseResult =
  | { success: true; data: ResumeData }
  | { success: false; error: string }

export function parseResumeDataFromAI(rawText: string): ParseResult {
  try {
    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // AI sometimes returns null for array fields — coerce to empty arrays
    const normalized = {
      ...parsed,
      experience:     Array.isArray(parsed.experience)     ? parsed.experience     : [],
      education:      Array.isArray(parsed.education)      ? parsed.education      : [],
      skills:         Array.isArray(parsed.skills)         ? parsed.skills         : [],
      projects:       Array.isArray(parsed.projects)       ? parsed.projects       : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      achievements:   Array.isArray(parsed.achievements)   ? parsed.achievements   : [],
    }

    const validated = resumeDataSchema.safeParse(normalized)

    if (!validated.success) {
      return { success: false, error: 'Schema validation failed: ' + JSON.stringify(validated.error.issues) }
    }

    return { success: true, data: validated.data as ResumeData }
  } catch {
    return { success: false, error: 'Failed to parse AI response as JSON' }
  }
}
