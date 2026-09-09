import type { Recommendation } from '../lib/recommend'
import { FRAME_SHAPE_LABELS } from '../data/faceShapeFit'
import { FrameGlyph } from './FrameGlyph'

interface Props {
  recommendation: Recommendation
}

export function FrameCard({ recommendation }: Props) {
  const { frame, reason } = recommendation

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-center rounded-xl bg-neutral-50 py-6 dark:bg-neutral-950">
        <FrameGlyph frame={frame} className="h-20 w-auto" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{frame.name}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{FRAME_SHAPE_LABELS[frame.frameShape]}</p>
        </div>
        <span className="whitespace-nowrap font-semibold text-neutral-900 dark:text-neutral-50">
          {frame.price !== null ? `$${frame.price}` : 'Price varies'}
        </span>
      </div>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{frame.note}</p>

      <p className="mt-3 inline-flex items-start gap-1.5 self-start rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        ✓ {reason}
      </p>

      <a
        href={frame.productUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        View real product ↗
      </a>
    </div>
  )
}
