import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  onBack?: () => void
  children: ReactNode
}

export function StepShell({ title, subtitle, onBack, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 text-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
