import { BRANDS } from '../data/brands'
import { LOOKS } from '../data/looks'
import { FACE_SHAPE_DESCRIPTIONS, FACE_SHAPE_LABELS } from '../data/faceShapeFit'
import { getRecommendations } from '../lib/recommend'
import type { FaceShape, GlassesType, Look } from '../types'
import { FrameCard } from './FrameCard'

interface Props {
  brandId: string
  type: GlassesType
  look: Look
  faceShape: FaceShape | null
  photo: string | null
  onRestart: () => void
  onChangeShape: () => void
}

export function Results({ brandId, type, look, faceShape, photo, onRestart, onChangeShape }: Props) {
  const brand = BRANDS.find((b) => b.id === brandId)!
  const lookOption = LOOKS.find((l) => l.id === look)!
  const { picks, noExactMatch } = getRecommendations(brandId, type, look, faceShape)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        {photo && (
          <img
            src={photo}
            alt="You"
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-white shadow dark:ring-neutral-800"
          />
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Your {brand.name} picks
          </h1>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {type === 'sunglasses' ? '🕶️ Sunglasses' : '👓 Regular glasses'}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {lookOption.icon} {lookOption.label}
            </span>
            {faceShape && (
              <button
                onClick={onChangeShape}
                className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-300"
              >
                {FACE_SHAPE_LABELS[faceShape]} face · change
              </button>
            )}
          </div>
          {faceShape && (
            <p className="mt-3 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
              {FACE_SHAPE_DESCRIPTIONS[faceShape]}
            </p>
          )}
        </div>
      </div>

      {noExactMatch ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No exact match in {brand.name}'s real catalog for this face shape, type, and style combination — we don't
          invent a frame to fill this. Try another brand, type, or style.
        </p>
      ) : (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {faceShape ? `Best matches for your ${FACE_SHAPE_LABELS[faceShape].toLowerCase()} face` : 'Top picks'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {picks.map((rec) => (
              <FrameCard key={rec.frame.id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={onRestart}
          className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          Start over
        </button>
      </div>
    </div>
  )
}
