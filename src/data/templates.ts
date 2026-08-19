import type { TemplateMeta } from '../types'

export const TEMPLATES: TemplateMeta[] = [
  { id: 'minimal', name: 'Minimal', description: 'Black & white, all whitespace, no distractions', accent: '#18181b' },
  { id: 'classic', name: 'Classic', description: 'Traditional serif resume, single column', accent: '#3f3f46' },
  { id: 'sidebar', name: 'Sidebar', description: 'Two-column with a dark contact/skills rail', accent: '#1e3a5f' },
  { id: 'creative', name: 'Creative', description: 'Bold color blocks and an asymmetric layout', accent: '#e11d48' },
  { id: 'timeline', name: 'Timeline', description: 'Vertical timeline for experience & education', accent: '#0d9488' },
  { id: 'corporate', name: 'Corporate', description: 'Structured, navy accents, built for finance & law', accent: '#1e40af' },
  { id: 'darktech', name: 'Dark Tech', description: 'Dark mode, monospace accents, built for engineers', accent: '#22d3ee' },
  { id: 'elegant', name: 'Elegant', description: 'Cream paper, gold rule lines, refined serif', accent: '#a16207' },
  { id: 'compact', name: 'Compact', description: 'Dense, ATS-friendly, fits more on one page', accent: '#374151' },
  { id: 'academic', name: 'Academic', description: 'Plain long-form CV for research & publications', accent: '#111827' },
]
