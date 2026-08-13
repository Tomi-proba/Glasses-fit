import type { AppStep } from '../types'

const STEPS: { id: AppStep; label: string }[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'type', label: 'Type' },
  { id: 'look', label: 'Look' },
  { id: 'photo', label: 'Photo' },
  { id: 'results', label: 'Results' },
]

export function ProgressSteps({ current }: { current: AppStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'upcoming'
        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ' +
                  (state === 'done'
                    ? 'bg-violet-600 text-white'
                    : state === 'active'
                      ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-600 dark:bg-violet-950 dark:text-violet-300'
                      : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600')
                }
              >
                {state === 'done' ? '✓' : i + 1}
              </div>
              <span
                className={
                  'text-xs font-medium ' +
                  (state === 'upcoming'
                    ? 'text-neutral-400 dark:text-neutral-600'
                    : 'text-neutral-700 dark:text-neutral-300')
                }
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={
                  'h-px w-6 sm:w-10 ' + (i < currentIndex ? 'bg-violet-600' : 'bg-neutral-200 dark:bg-neutral-800')
                }
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
