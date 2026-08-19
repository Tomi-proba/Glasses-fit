import type { CVData } from '../../types'

export interface TemplateProps {
  data: CVData
}

export function hasContent(data: CVData): boolean {
  return Boolean(
    data.personal.fullName ||
      data.experience.length ||
      data.education.length ||
      data.skills.length ||
      data.projects.length,
  )
}
