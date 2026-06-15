import type { ResumeData } from '@/types/resume'

type ExpEntry = ResumeData['experience'][number]
type EduEntry = ResumeData['education'][number]
type ProjectEntry = ResumeData['projects'][number]

// Converts a ResumeData section to plain text for the AI
export function serializeSection(key: string, data: ResumeData): string {
  switch (key) {
    case 'summary':
      return data.summary

    case 'skills':
      return data.skills.join(', ')

    case 'certifications':
      return data.certifications.join('\n')

    case 'achievements':
      return data.achievements.join('\n')

    case 'experience':
      return data.experience.map((exp) =>
        `${exp.title} at ${exp.company} (${exp.duration})\n${exp.bullets.map((b) => `• ${b}`).join('\n')}`
      ).join('\n\n')

    case 'education':
      return data.education.map((edu) =>
        `${edu.degree} — ${edu.institution} (${edu.year})${edu.grade ? `, ${edu.grade}` : ''}`
      ).join('\n')

    case 'projects':
      return data.projects.map((p) =>
        `${p.name}${p.link ? ` (${p.link})` : ''}\n${p.description}`
      ).join('\n\n')

    default:
      return ''
  }
}

// Parses AI output back into the correct ResumeData field type.
// Falls back to original data if parsing fails.
export function deserializeSection(key: string, aiText: string, original: ResumeData): unknown {
  const text = aiText.trim()

  switch (key) {
    case 'summary':
      return text

    case 'skills':
      return text.split(',').map((s) => s.trim()).filter(Boolean)

    case 'certifications':
    case 'achievements':
      return text
        .split('\n')
        .map((s) => s.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean)

    case 'experience':
      try { return parseExperience(text) } catch { return original.experience }

    case 'education':
      try { return parseEducation(text) } catch { return original.education }

    case 'projects':
      try { return parseProjects(text) } catch { return original.projects }

    default:
      return aiText
  }
}

function parseExperience(text: string): ExpEntry[] {
  const blocks = text.trim().split(/\n\s*\n/)
  return blocks.map((block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return null
    const first = lines[0]
    const m = first.match(/^(.+?)\s+at\s+(.+?)\s*\((.+?)\)\s*$/)
    const title = m?.[1]?.trim() ?? first
    const company = m?.[2]?.trim() ?? ''
    const duration = m?.[3]?.trim() ?? ''
    const bullets = lines.slice(1).map((l) => l.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean)
    return { title, company, duration, bullets }
  }).filter(Boolean) as ExpEntry[]
}

function parseEducation(text: string): EduEntry[] {
  return text.split('\n').map((line) => {
    line = line.trim()
    if (!line) return null
    const m = line.match(/^(.+?)\s*[—\-]\s*(.+?)\s*\((.+?)\)(?:,\s*(.+))?$/)
    if (m) {
      return { degree: m[1].trim(), institution: m[2].trim(), year: m[3].trim(), grade: m[4]?.trim() ?? null }
    }
    return { degree: line, institution: '', year: '', grade: null }
  }).filter(Boolean) as EduEntry[]
}

function parseProjects(text: string): ProjectEntry[] {
  const blocks = text.trim().split(/\n\s*\n/)
  return blocks.map((block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return null
    const first = lines[0]
    const m = first.match(/^(.+?)\s*\((.+?)\)\s*$/)
    const name = m?.[1]?.trim() ?? first
    const link = m?.[2]?.trim() ?? null
    const description = lines.slice(1).join(' ').trim()
    return { name, link: link || null, description }
  }).filter(Boolean) as ProjectEntry[]
}
