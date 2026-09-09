import type { Frame, GlassesType, Look, ProductRecord } from '../types'
import { FRAME_SHAPE_SUITABILITY } from './faceShapeFit'
import { BRANDS } from './brands'
import productsData from './products.json'

const ACCENT_BY_BRAND = new Map(BRANDS.map((b) => [b.id, b.accent]))

// products.json has no "look" tag (real retailers don't categorize by mood),
// so we derive it from brand positioning + frame shape + price — sporty
// brands read sporty, higher-priced/statement shapes read flashy, simple
// low-cost frames read everyday, and heritage shapes read classic. Most
// frames get two tags so they still surface under a couple of look filters.
function deriveLooks(brand: string, frameShape: string, type: GlassesType, price: number | null): Look[] {
  const looks = new Set<Look>()

  if (brand === 'oakley') looks.add('sporty')
  if (brand === 'warbyparker') looks.add('everyday')
  if (brand === 'gucci' || brand === 'tomford') looks.add('flashy')
  if (brand === 'persol' || brand === 'oliverpeoples') looks.add('classic')

  if (frameShape === 'aviator' || frameShape === 'browline') looks.add('classic')
  if (frameShape === 'oversized' || frameShape === 'cat-eye' || frameShape === 'geometric') looks.add('flashy')
  if (frameShape === 'round' || frameShape === 'square') looks.add('everyday')
  if (frameShape === 'rectangle' && type === 'sunglasses') looks.add('sporty')

  if (price !== null && price <= 150) looks.add('everyday')
  if (price !== null && price >= 350) looks.add('flashy')

  if (looks.size === 0) looks.add('everyday')
  return Array.from(looks)
}

function toFrame(product: ProductRecord, index: number): Frame {
  return {
    id: `${product.brand}-${index}`,
    brand: product.brand,
    name: product.modelName,
    type: product.type,
    looks: deriveLooks(product.brand, product.frameShape, product.type, product.price),
    frameShape: product.frameShape,
    suitedFor: FRAME_SHAPE_SUITABILITY[product.frameShape],
    accentColor: ACCENT_BY_BRAND.get(product.brand) ?? '#404040',
    price: product.price,
    note: product.note,
    productUrl: product.productUrl,
    image: product.image,
  }
}

export const CATALOG: Frame[] = (productsData as ProductRecord[]).map(toFrame)
