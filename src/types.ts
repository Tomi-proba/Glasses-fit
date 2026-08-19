export interface Personal {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  photo: string | null
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  start: string
  end: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  location: string
  start: string
  end: string
  details: string
}

export interface SkillGroup {
  id: string
  label: string
  items: string[]
}

export interface Project {
  id: string
  name: string
  link: string
  description: string
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface CVData {
  personal: Personal
  experience: Experience[]
  education: Education[]
  skills: SkillGroup[]
  projects: Project[]
  languages: Language[]
}

export type TemplateId =
  | 'minimal'
  | 'classic'
  | 'sidebar'
  | 'creative'
  | 'timeline'
  | 'corporate'
  | 'darktech'
  | 'elegant'
  | 'compact'
  | 'academic'

export interface TemplateMeta {
  id: TemplateId
  name: string
  description: string
  accent: string
}
