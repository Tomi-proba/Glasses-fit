import type { ComponentType } from 'react'
import type { TemplateId } from '../../types'
import type { TemplateProps } from './shared'
import { MinimalTemplate } from './MinimalTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { SidebarTemplate } from './SidebarTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { TimelineTemplate } from './TimelineTemplate'
import { CorporateTemplate } from './CorporateTemplate'
import { DarkTechTemplate } from './DarkTechTemplate'
import { ElegantTemplate } from './ElegantTemplate'
import { CompactTemplate } from './CompactTemplate'
import { AcademicTemplate } from './AcademicTemplate'
import { PhotoBannerTemplate } from './PhotoBannerTemplate'
import { GridTemplate } from './GridTemplate'
import { NewspaperTemplate } from './NewspaperTemplate'
import { SwissTemplate } from './SwissTemplate'
import { GradientTemplate } from './GradientTemplate'

export const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<TemplateProps>> = {
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  creative: CreativeTemplate,
  timeline: TimelineTemplate,
  corporate: CorporateTemplate,
  darktech: DarkTechTemplate,
  elegant: ElegantTemplate,
  compact: CompactTemplate,
  academic: AcademicTemplate,
  photobanner: PhotoBannerTemplate,
  grid: GridTemplate,
  newspaper: NewspaperTemplate,
  swiss: SwissTemplate,
  gradient: GradientTemplate,
}

export type { TemplateProps } from './shared'
