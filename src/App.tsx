import { useState } from 'react'
import type { AppStep, FaceShape, GlassesType, Look } from './types'
import { ProgressSteps } from './components/ProgressSteps'
import { StepBrand } from './components/StepBrand'
import { StepType } from './components/StepType'
import { StepLook } from './components/StepLook'
import { StepPhoto } from './components/StepPhoto'
import { Results } from './components/Results'

interface Selection {
  brandId: string | null
  type: GlassesType | null
  look: Look | null
  photo: string | null
  faceShape: FaceShape | null
}

const INITIAL_SELECTION: Selection = {
  brandId: null,
  type: null,
  look: null,
  photo: null,
  faceShape: null,
}

function App() {
  const [step, setStep] = useState<AppStep>('brand')
  const [selection, setSelection] = useState<Selection>(INITIAL_SELECTION)

  function restart() {
    setSelection(INITIAL_SELECTION)
    setStep('brand')
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          👓 Glasses Fit
        </p>
      </header>

      <ProgressSteps current={step} />

      {step === 'brand' && (
        <StepBrand
          onSelect={(brandId) => {
            setSelection((s) => ({ ...s, brandId }))
            setStep('type')
          }}
        />
      )}

      {step === 'type' && (
        <StepType
          onBack={() => setStep('brand')}
          onSelect={(type) => {
            setSelection((s) => ({ ...s, type }))
            setStep('look')
          }}
        />
      )}

      {step === 'look' && (
        <StepLook
          onBack={() => setStep('type')}
          onSelect={(look) => {
            setSelection((s) => ({ ...s, look }))
            setStep('photo')
          }}
        />
      )}

      {step === 'photo' && (
        <StepPhoto
          onBack={() => setStep('look')}
          onComplete={(photo, faceShape) => {
            setSelection((s) => ({ ...s, photo, faceShape }))
            setStep('results')
          }}
        />
      )}

      {step === 'results' && selection.brandId && selection.type && selection.look && (
        <Results
          brandId={selection.brandId}
          type={selection.type}
          look={selection.look}
          faceShape={selection.faceShape}
          photo={selection.photo}
          onRestart={restart}
          onChangeShape={() => setStep('photo')}
        />
      )}
    </div>
  )
}

export default App
