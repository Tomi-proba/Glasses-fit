import type { CSSProperties } from 'react'
import type { CVData, TemplateId } from '../types'
import { TEMPLATE_COMPONENTS } from './templates'

const PREVIEW_SCALE = 0.72
const PAGE_W = 794
const PAGE_H = 1123

interface Props {
  data: CVData
  templateId: TemplateId
}

export function PreviewPane({ data, templateId }: Props) {
  const Comp = TEMPLATE_COMPONENTS[templateId]
  return (
    <div className="flex justify-center overflow-auto rounded-2xl bg-neutral-200 p-6 dark:bg-neutral-950">
      <div
        id="printable-cv"
        className="preview-frame shrink-0 overflow-hidden rounded-sm shadow-xl"
        style={{ '--pw': `${PAGE_W * PREVIEW_SCALE}px`, '--ph': `${PAGE_H * PREVIEW_SCALE}px` } as CSSProperties}
      >
        <div
          className="preview-scale"
          style={{ '--scale': PREVIEW_SCALE, width: PAGE_W, height: PAGE_H } as CSSProperties}
        >
          <Comp data={data} />
        </div>
      </div>
    </div>
  )
}
