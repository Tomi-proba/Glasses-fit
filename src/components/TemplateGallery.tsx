import { TEMPLATES } from '../data/templates'
import { SAMPLE_CV } from '../data/sampleData'
import { TEMPLATE_COMPONENTS } from './templates'
import type { TemplateId } from '../types'

const THUMB_SCALE = 0.19
const PAGE_W = 794
const PAGE_H = 1123

interface Props {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
}

export function TemplateGallery({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {TEMPLATES.map((t) => {
        const Comp = TEMPLATE_COMPONENTS[t.id]
        const active = t.id === selected
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={
              'flex shrink-0 flex-col items-center gap-2 rounded-xl p-2 text-left transition ' +
              (active
                ? 'bg-violet-100 ring-2 ring-violet-600 dark:bg-violet-950'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-900')
            }
          >
            <div
              className="overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm dark:border-neutral-700"
              style={{ width: PAGE_W * THUMB_SCALE, height: PAGE_H * THUMB_SCALE }}
            >
              <div style={{ width: PAGE_W, height: PAGE_H, transform: `scale(${THUMB_SCALE})`, transformOrigin: 'top left' }}>
                <Comp data={SAMPLE_CV} />
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{t.name}</span>
          </button>
        )
      })}
    </div>
  )
}
