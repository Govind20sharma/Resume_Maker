import type { IntakeAnswers } from './intake-helpers'

export interface IntakeQuestion {
  id: keyof IntakeAnswers
  question: string
  placeholder: string
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'name',
    question: "What's your full name?",
    placeholder: 'e.g. Govind Sharma',
  },
  {
    id: 'contact',
    question: "What's your email and phone number? Add LinkedIn or portfolio link if you have one.",
    placeholder: 'e.g. govind@email.com, +91-9999999999, linkedin.com/in/govind',
  },
  {
    id: 'location',
    question: "Where are you based?",
    placeholder: 'e.g. Delhi, India',
  },
  {
    id: 'current_role',
    question: "What is your current or most recent job title and company?",
    placeholder: 'e.g. Senior Developer at Acme Corp',
  },
  {
    id: 'experience_years',
    question: "How many years of total work experience do you have?",
    placeholder: 'e.g. 4 years',
  },
  {
    id: 'skills',
    question: "What are your top 3–5 skills or areas of expertise?",
    placeholder: 'e.g. React, TypeScript, Node.js, System Design',
  },
  {
    id: 'education',
    question: "Where did you study and what degree did you complete?",
    placeholder: 'e.g. B.Tech Computer Science, IIT Delhi, 2020',
  },
  {
    id: 'achievements',
    question: "What are 2–3 key achievements or impact moments from your career? Numbers help!",
    placeholder: 'e.g. Reduced page load by 40%, Led team of 5, Shipped product used by 10k users',
  },
  {
    id: 'projects',
    question: "Any notable projects, certifications, or portfolio links to highlight?",
    placeholder: 'e.g. Built AI chatbot (github.com/...), AWS Certified Developer',
  },
  {
    id: 'summary',
    question: "Finally — how would you describe yourself in 1–2 sentences?",
    placeholder: 'e.g. Passionate frontend developer with 4 years experience building fast, accessible web apps.',
  },
]
