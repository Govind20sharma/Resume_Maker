import type { ResumeData } from './resume'

export type TemplateId =
  | 'technical'
  | 'professional'
  | 'creative'
  | 'general'
  | 'executive'
  | 'fresher'

export interface TemplateConfig {
  id: TemplateId
  name: string
  roleTypes: string[]
  atsOptimised: boolean
  component: React.ComponentType<{ data: ResumeData }>
}
