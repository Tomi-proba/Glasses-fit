import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { FaceMeasurements, FaceShape } from '../types'

// Self-hosted (see public/mediapipe and public/models) so face detection works
// fully offline and no photo or frame ever leaves the browser over the network.
const WASM_BASE = `${import.meta.env.BASE_URL}mediapipe/wasm`
const MODEL_URL = `${import.meta.env.BASE_URL}models/face_landmarker.task`

let landmarkerPromise: Promise<FaceLandmarker> | null = null

async function createLandmarker(delegate: 'GPU' | 'CPU') {
  const fileset = await FilesetResolver.forVisionTasks(WASM_BASE)
  return FaceLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    outputFaceBlendshapes: false,
    runningMode: 'IMAGE',
    numFaces: 1,
  })
}

function getLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarker('GPU').catch(() => createLandmarker('CPU'))
  }
  return landmarkerPromise
}

// Landmark indices from MediaPipe's 468-point face mesh topology.
const IDX = {
  foreheadTop: 10,
  chin: 152,
  cheekLeft: 234,
  cheekRight: 454,
  jawLeft: 172,
  jawRight: 397,
  foreheadLeft: 54,
  foreheadRight: 284,
}

interface Point {
  x: number
  y: number
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function classify(measurements: FaceMeasurements): FaceShape {
  const { widthToHeight, jawToCheek, foreheadToCheek } = measurements
  const lengthToWidth = 1 / widthToHeight
  const widths = [foreheadToCheek, 1, jawToCheek] // cheek width normalized to 1
  const maxW = Math.max(...widths)
  const minW = Math.min(...widths)
  const widthsClose = (maxW - minW) / maxW < 0.08

  if (lengthToWidth >= 1.55) return 'oblong'
  if (foreheadToCheek < 0.9 && jawToCheek < 0.9) return 'diamond'
  if (foreheadToCheek > jawToCheek * 1.12) return 'heart'
  if (widthsClose) return lengthToWidth <= 1.08 ? 'round' : 'square'
  return 'oval'
}

export interface FaceShapeResult {
  shape: FaceShape
  measurements: FaceMeasurements
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = src
  })
}

export async function detectFaceShape(image: HTMLImageElement): Promise<FaceShapeResult | null> {
  const landmarker = await getLandmarker()
  const result = landmarker.detect(image)
  const points = result.faceLandmarks?.[0]
  if (!points || points.length === 0) return null

  const faceHeight = dist(points[IDX.foreheadTop], points[IDX.chin])
  const cheekWidth = dist(points[IDX.cheekLeft], points[IDX.cheekRight])
  const jawWidth = dist(points[IDX.jawLeft], points[IDX.jawRight])
  const foreheadWidth = dist(points[IDX.foreheadLeft], points[IDX.foreheadRight])

  if (faceHeight === 0 || cheekWidth === 0) return null

  const measurements: FaceMeasurements = {
    widthToHeight: cheekWidth / faceHeight,
    jawToCheek: jawWidth / cheekWidth,
    foreheadToCheek: foreheadWidth / cheekWidth,
  }

  return { shape: classify(measurements), measurements }
}
