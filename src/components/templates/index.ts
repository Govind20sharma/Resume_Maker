import type { ComponentType } from 'react'
import type { ResumeData } from '@/types/resume'
import type { TemplateId, TemplateConfig } from '@/types/template'
import TechnicalTemplate from './TechnicalTemplate'
import ProfessionalTemplate from './ProfessionalTemplate'
import CreativeTemplate from './CreativeTemplate'
import GeneralTemplate from './GeneralTemplate'
import ExecutiveTemplate from './ExecutiveTemplate'
import FresherTemplate from './FresherTemplate'

export type TemplateComponentType = ComponentType<{ data: ResumeData }> & { config: TemplateConfig }

export const TEMPLATE_MAP: Record<TemplateId, TemplateComponentType> = {
  technical: TechnicalTemplate as TemplateComponentType,
  professional: ProfessionalTemplate as TemplateComponentType,
  creative: CreativeTemplate as TemplateComponentType,
  general: GeneralTemplate as TemplateComponentType,
  executive: ExecutiveTemplate as TemplateComponentType,
  fresher: FresherTemplate as TemplateComponentType,
}
