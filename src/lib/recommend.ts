import { CATALOG } from '../data/catalog'
import { FIT_REASON } from '../data/faceShapeFit'
import type { Frame, FaceShape, GlassesType, Look } from '../types'

const MAX_RECOMMENDATIONS = 3

export interface Recommendation {
  frame: Frame
  reason: string
}

export interface RecommendationResult {
  picks: Recommendation[]
  /** True when nothing in the (real, non-invented) catalog matched — never fabricate a pick to fill this. */
  noExactMatch: boolean
}

function reasonFor(frame: Frame, faceShape: FaceShape): string {
  return (
    FIT_REASON[frame.frameShape]?.[faceShape] ??
    `${frame.frameShape} frames are a classic match for a ${faceShape} face shape.`
  )
}

export function getRecommendations(
  brandId: string,
  type: GlassesType,
  look: Look,
  faceShape: FaceShape | null,
): RecommendationResult {
  // Step 1: brand + style preference filters the real catalog first.
  let candidates = CATALOG.filter((f) => f.brand === brandId && f.type === type && f.looks.includes(look))
  if (candidates.length === 0) {
    // No exact look match for this brand/type — widen to brand + type only,
    // still real products, never invented ones.
    candidates = CATALOG.filter((f) => f.brand === brandId && f.type === type)
  }

  if (candidates.length === 0) {
    return { picks: [], noExactMatch: true }
  }

  // Step 2: face-shape fit narrows it down to only frames actually suited
  // to the detected/chosen face shape.
  const suited = faceShape ? candidates.filter((f) => f.suitedFor.includes(faceShape)) : candidates

  if (suited.length === 0) {
    return { picks: [], noExactMatch: true }
  }

  const picks = suited.slice(0, MAX_RECOMMENDATIONS).map((frame) => ({
    frame,
    reason: faceShape ? reasonFor(frame, faceShape) : 'A strong style match for your selections.',
  }))

  return { picks, noExactMatch: false }
}
