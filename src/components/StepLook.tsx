import { LOOKS } from '../data/looks'
import type { Look } from '../types'
import { StepShell } from './StepShell'

interface Props {
  onSelect: (look: Look) => void
  onBack: () => void
}

export function StepLook({ onSelect, onBack }: Props) {
  return (
    <StepShell title="What look are you going for?" subtitle="Pick one — you can always come back and try another." onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LOOKS.map((look) => (
          <button
            key={look.id}
            onClick={() => onSelect(look.id)}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-4xl">{look.icon}</span>
            <span>
              <span className="block text-lg font-semibold text-neutral-900 dark:text-neutral-50">{look.label}</span>
              <span className="block text-sm text-neutral-500 dark:text-neutral-400">{look.description}</span>
            </span>
          </button>
        ))}
      </div>
    </StepShell>
  )
}
