import type { FaceShape, FrameShape } from '../types'

// Classic optician heuristics: which face shapes each frame silhouette flatters.
export const FRAME_SHAPE_SUITABILITY: Record<FrameShape, FaceShape[]> = {
  round: ['square', 'diamond', 'oblong'],
  square: ['round', 'oval', 'heart'],
  rectangle: ['round', 'oval'],
  aviator: ['heart', 'oval', 'diamond'],
  'cat-eye': ['round', 'square', 'diamond'],
  browline: ['oval', 'round', 'diamond'],
  oversized: ['oblong', 'heart', 'oval'],
  geometric: ['round', 'oval'],
  rimless: ['square', 'round', 'heart', 'diamond'],
}

export const FACE_SHAPE_LABELS: Record<FaceShape, string> = {
  oval: 'Oval',
  round: 'Round',
  square: 'Square',
  heart: 'Heart',
  diamond: 'Diamond',
  oblong: 'Oblong',
}

export const FACE_SHAPE_DESCRIPTIONS: Record<FaceShape, string> = {
  oval: 'Balanced proportions with a gently rounded jaw — most frame shapes suit you.',
  round: 'Soft curves and similar width/height — angular frames add definition.',
  square: 'A strong jaw and forehead of similar width — rounded frames soften the angles.',
  heart: 'A wider forehead tapering to a narrower chin — bottom-light frames balance it out.',
  diamond: 'Narrow forehead and jaw with wide cheekbones — frames with detail at the brow work well.',
  oblong: 'Longer than it is wide — taller or oversized frames shorten the look.',
}

export const FRAME_SHAPE_LABELS: Record<FrameShape, string> = {
  round: 'Round',
  square: 'Square',
  rectangle: 'Rectangle',
  aviator: 'Aviator',
  'cat-eye': 'Cat-Eye',
  browline: 'Browline',
  oversized: 'Oversized',
  geometric: 'Geometric',
  rimless: 'Rimless',
}
