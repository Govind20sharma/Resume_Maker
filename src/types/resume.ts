export interface ResumeData {
  target_role: string
  jd_keywords: string[] | null
  summary: string
  contact: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string | null
    portfolio: string | null
  }
  experience: Array<{
    title: string
    company: string
    duration: string
    bullets: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    grade: string | null
  }>
  skills: string[]
  projects: Array<{
    name: string
    description: string
    link: string | null
  }>
  certifications: string[]
  achievements: string[]
}
