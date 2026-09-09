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

// One factual, specific reason per (frame shape, face shape) pair that
// FRAME_SHAPE_SUITABILITY actually allows — used as the required "why this
// fits your face shape" sentence in recommendations.
export const FIT_REASON: Partial<Record<FrameShape, Partial<Record<FaceShape, string>>>> = {
  round: {
    square: 'Round lenses soften a strong, angular jawline.',
    diamond: 'The curved lens line balances your wide cheekbones.',
    oblong: 'A round shape breaks up a longer face with soft curves.',
  },
  square: {
    round: 'Sharp corners add definition that a round face lacks on its own.',
    oval: 'The structured edges add contrast to balanced, oval proportions.',
    heart: 'A squared bottom edge balances a wider forehead.',
  },
  rectangle: {
    round: 'Straight top and bottom lines add angles a round face is missing.',
    oval: 'The elongated shape follows oval proportions without overwhelming them.',
  },
  aviator: {
    heart: 'The wide top bar balances a narrower chin.',
    oval: 'The teardrop shape suits nearly any oval proportion.',
    diamond: 'The brow-level width complements prominent cheekbones.',
  },
  'cat-eye': {
    round: 'Upswept corners add lift and angles to soft, round features.',
    square: 'The curved lens softens a strong jawline while keeping definition up top.',
    diamond: 'The flared top edge echoes and flatters wide cheekbones.',
  },
  browline: {
    oval: 'The bold top bar adds structure to balanced, oval proportions.',
    round: 'A heavier brow line adds angles that a round face lacks.',
    diamond: 'The strong upper line draws focus and balances wide cheekbones.',
  },
  oversized: {
    oblong: 'Extra lens height shortens the look of a longer face.',
    heart: 'The wider lower edge balances a narrower chin.',
    oval: 'Oversized lenses have room to suit well-balanced proportions.',
  },
  geometric: {
    round: 'Angular facets add definition a round face doesn’t have on its own.',
    oval: 'Faceted lenses add visual interest without disrupting balanced proportions.',
  },
  rimless: {
    square: 'The lack of a heavy frame softens a strong jawline.',
    round: 'A barely-there rim avoids adding extra width to round features.',
    heart: 'A light, rimless build keeps the focus off a narrower chin.',
    diamond: 'Minimal framing lets prominent cheekbones stay the focal point.',
  },
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
