import { useEffect, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { detectFaceShape, loadImage } from '../lib/faceShape'
import { FACE_SHAPE_DESCRIPTIONS, FACE_SHAPE_LABELS } from '../data/faceShapeFit'
import type { FaceShape } from '../types'
import { StepShell } from './StepShell'

interface Props {
  onComplete: (photoDataUrl: string | null, faceShape: FaceShape | null) => void
  onBack: () => void
}

type Status = 'idle' | 'detecting' | 'detected' | 'failed'

const SHAPE_ICONS: Record<FaceShape, string> = {
  oval: '🥚',
  round: '⚪',
  square: '◼️',
  heart: '💗',
  diamond: '💎',
  oblong: '▯',
}

export function StepPhoto({ onComplete, onBack }: Props) {
  const camera = useCamera()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'choose' | 'camera' | 'preview' | 'manual'>('choose')
  const [photo, setPhoto] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [detectedShape, setDetectedShape] = useState<FaceShape | null>(null)
  const [showManualPicker, setShowManualPicker] = useState(false)

  useEffect(() => {
    if (mode !== 'camera') camera.stop()
  }, [mode, camera])

  useEffect(() => {
    if (status !== 'detecting' || !photo) return
    let cancelled = false
    ;(async () => {
      try {
        const img = await loadImage(photo)
        const result = await detectFaceShape(img)
        if (cancelled) return
        if (result) {
          setDetectedShape(result.shape)
          setStatus('detected')
        } else {
          setStatus('failed')
        }
      } catch {
        if (!cancelled) setStatus('failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [status, photo])

  function applyPhoto(dataUrl: string) {
    setPhoto(dataUrl)
    setMode('preview')
    setStatus('detecting')
    setDetectedShape(null)
    setShowManualPicker(false)
  }

  function handleCapture() {
    const dataUrl = camera.capture()
    if (dataUrl) applyPhoto(dataUrl)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => applyPhoto(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function retake() {
    setMode('choose')
    setPhoto(null)
    setStatus('idle')
    setDetectedShape(null)
    setShowManualPicker(false)
  }

  return (
    <StepShell
      title="Add a photo"
      subtitle="Processed entirely in your browser — your photo is never uploaded anywhere."
      onBack={onBack}
    >
      {mode === 'choose' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMode('camera')
                camera.start()
              }}
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              📷 Use camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              🖼️ Upload photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="user" hidden onChange={handleFile} />
          </div>
          <p className="max-w-sm text-center text-xs text-neutral-400">
            Tip: face the camera directly in even lighting, with hair off your forehead, for the most accurate result.
          </p>
          <button
            onClick={() => setMode('manual')}
            className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Skip the photo — I already know my face shape
          </button>
        </div>
      )}

      {mode === 'manual' && (
        <div className="flex flex-col items-center gap-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Which best describes your face shape?</p>
          <div className="grid w-full max-w-lg grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(FACE_SHAPE_LABELS) as FaceShape[]).map((shape) => (
              <button
                key={shape}
                onClick={() => onComplete(null, shape)}
                className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span className="text-2xl">{SHAPE_ICONS[shape]}</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {FACE_SHAPE_LABELS[shape]}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setMode('choose')}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Use a photo instead
          </button>
        </div>
      )}

      {mode === 'camera' && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-900">
            <video ref={camera.videoRef} className="h-full w-full -scale-x-100 object-cover" playsInline muted />
          </div>
          {camera.error && <p className="text-sm text-red-500">{camera.error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleCapture}
              disabled={!camera.active}
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-50"
            >
              Capture
            </button>
            <button
              onClick={retake}
              className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {mode === 'preview' && photo && (
        <div className="flex flex-col items-center gap-5">
          <img src={photo} alt="Your photo" className="aspect-square w-full max-w-sm rounded-2xl object-cover" />

          {status === 'detecting' && (
            <p className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
              Analyzing your face shape…
            </p>
          )}

          {status === 'detected' && detectedShape && !showManualPicker && (
            <div className="w-full max-w-sm rounded-2xl border border-violet-200 bg-violet-50 p-5 text-center dark:border-violet-900 dark:bg-violet-950">
              <p className="text-sm text-violet-700 dark:text-violet-300">We estimate your face shape is</p>
              <p className="mt-1 text-2xl font-semibold text-violet-900 dark:text-violet-100">
                {SHAPE_ICONS[detectedShape]} {FACE_SHAPE_LABELS[detectedShape]}
              </p>
              <p className="mt-2 text-sm text-violet-700/80 dark:text-violet-300/80">
                {FACE_SHAPE_DESCRIPTIONS[detectedShape]}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  onClick={() => onComplete(photo, detectedShape)}
                  className="rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-700"
                >
                  Looks right — continue
                </button>
                <button
                  onClick={() => setShowManualPicker(true)}
                  className="rounded-xl border border-violet-300 px-5 py-2.5 font-medium text-violet-700 dark:border-violet-800 dark:text-violet-300"
                >
                  Not quite — pick manually
                </button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <p className="max-w-sm text-center text-sm text-amber-600 dark:text-amber-400">
              We couldn't automatically detect a face in this photo. Select your face shape below to continue.
            </p>
          )}

          {(status === 'failed' || showManualPicker) && (
            <div className="grid w-full max-w-lg grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(FACE_SHAPE_LABELS) as FaceShape[]).map((shape) => (
                <button
                  key={shape}
                  onClick={() => onComplete(photo, shape)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <span className="text-2xl">{SHAPE_ICONS[shape]}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {FACE_SHAPE_LABELS[shape]}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button onClick={retake} className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100">
            Retake / choose a different photo
          </button>
        </div>
      )}
    </StepShell>
  )
}
