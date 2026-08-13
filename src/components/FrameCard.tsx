import type { Recommendation } from '../lib/recommend'
import { FACE_SHAPE_LABELS, FRAME_SHAPE_LABELS } from '../data/faceShapeFit'
import type { FaceShape } from '../types'
import { FrameGlyph } from './FrameGlyph'

interface Props {
  recommendation: Recommendation
  faceShape: FaceShape | null
}

export function FrameCard({ recommendation, faceShape }: Props) {
  const { frame, matchesFaceShape } = recommendation

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-center rounded-xl bg-neutral-50 py-6 dark:bg-neutral-950">
        <FrameGlyph frame={frame} className="h-20 w-auto" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{frame.name}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {FRAME_SHAPE_LABELS[frame.frameShape]} · {frame.color}
          </p>
        </div>
        <span className="whitespace-nowrap font-semibold text-neutral-900 dark:text-neutral-50">${frame.price}</span>
      </div>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{frame.blurb}</p>

      {matchesFaceShape && faceShape && (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          ✓ Great match for your {FACE_SHAPE_LABELS[faceShape].toLowerCase()} face
        </p>
      )}
    </div>
  )
}
