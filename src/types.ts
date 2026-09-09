export type GlassesType = 'sunglasses' | 'regular'

export type Look = 'everyday' | 'classic' | 'flashy' | 'sporty'

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'

export type FrameShape =
  | 'round'
  | 'square'
  | 'rectangle'
  | 'aviator'
  | 'cat-eye'
  | 'browline'
  | 'oversized'
  | 'geometric'
  | 'rimless'

export interface Brand {
  id: string
  name: string
  tagline: string
  accent: string
}

export interface Frame {
  id: string
  brand: string
  name: string
  type: GlassesType
  looks: Look[]
  frameShape: FrameShape
  suitedFor: FaceShape[]
  accentColor: string
  price: number | null
  note: string
  productUrl: string
  image: string | null
}

/** Raw entry as written by scripts/generate-products.mjs into products.json. */
export interface ProductRecord {
  brand: string
  modelName: string
  frameShape: FrameShape
  type: GlassesType
  price: number | null
  image: string | null
  productUrl: string
  note: string
}

export interface LookOption {
  id: Look
  label: string
  description: string
  icon: string
}

export type AppStep = 'brand' | 'type' | 'look' | 'photo' | 'results'

export interface FaceMeasurements {
  widthToHeight: number
  jawToCheek: number
  foreheadToCheek: number
}
