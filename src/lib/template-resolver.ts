import type { TemplateId } from '@/types/template'

const ROLE_MAP: Array<{ keywords: string[]; template: TemplateId }> = [
  {
    keywords: ['vp', 'director', 'chief', 'head of', 'president', 'executive', 'cto', 'ceo', 'coo'],
    template: 'executive',
  },
  {
    keywords: ['fresh', 'graduate', 'intern', 'entry', 'junior', 'trainee', 'student'],
    template: 'fresher',
  },
  {
    keywords: [
      'developer', 'engineer', 'software', 'frontend', 'backend', 'fullstack',
      'devops', 'data', 'ml', 'ai', 'cloud', 'architect', 'programmer', 'sde',
    ],
    template: 'technical',
  },
  {
    keywords: ['design', 'creative', 'brand', 'art', 'ux', 'ui', 'media', 'content'],
    template: 'creative',
  },
  {
    keywords: ['manager', 'lead', 'analyst', 'consultant', 'finance', 'hr', 'sales', 'marketing'],
    template: 'professional',
  },
]

export function resolveTemplates(targetRole: string): TemplateId[] {
  const lower = targetRole.toLowerCase()

  for (const { keywords, template } of ROLE_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const rest: TemplateId[] = (['technical', 'professional', 'creative', 'general', 'executive', 'fresher'] as TemplateId[])
        .filter((id) => id !== template)
      return [template, ...rest]
    }
  }

  // default order
  return ['general', 'technical', 'professional', 'creative', 'executive', 'fresher']
}
