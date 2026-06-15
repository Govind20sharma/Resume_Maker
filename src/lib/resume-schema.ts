import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  linkedin: z.string().nullable(),
  portfolio: z.string().nullable(),
})

const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  duration: z.string().min(1),
  bullets: z.array(z.string()),
})

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().min(1),
  grade: z.string().nullable(),
})

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  link: z.string().nullable(),
})

export const resumeDataSchema = z.object({
  target_role: z.string().min(1),
  jd_keywords: z.array(z.string()).nullable(),
  summary: z.string(),
  contact: contactSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  projects: z.array(projectSchema),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
})

export type ResumeDataInput = z.infer<typeof resumeDataSchema>
