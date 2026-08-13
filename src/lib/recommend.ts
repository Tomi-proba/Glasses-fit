import { CATALOG } from '../data/catalog'
import type { Frame, FaceShape, GlassesType, Look } from '../types'

export interface Recommendation {
  frame: Frame
  matchesFaceShape: boolean
}

export function getRecommendations(
  brandId: string,
  type: GlassesType,
  look: Look,
  faceShape: FaceShape | null,
): Recommendation[] {
  const candidates = CATALOG.filter((f) => f.brand === brandId && f.type === type && f.looks.includes(look))

  const ranked = candidates
    .map((frame) => ({
      frame,
      matchesFaceShape: faceShape ? frame.suitedFor.includes(faceShape) : false,
    }))
    .sort((a, b) => Number(b.matchesFaceShape) - Number(a.matchesFaceShape))

  if (ranked.length > 0) return ranked

  // No exact look match for this brand/type — widen to the brand + type only,
  // still favoring frames that suit the detected face shape.
  const fallback = CATALOG.filter((f) => f.brand === brandId && f.type === type)
    .map((frame) => ({
      frame,
      matchesFaceShape: faceShape ? frame.suitedFor.includes(faceShape) : false,
    }))
    .sort((a, b) => Number(b.matchesFaceShape) - Number(a.matchesFaceShape))

  return fallback
}
