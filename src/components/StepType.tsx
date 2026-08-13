import type { GlassesType } from '../types'
import { StepShell } from './StepShell'

interface Props {
  onSelect: (type: GlassesType) => void
  onBack: () => void
}

const OPTIONS: { id: GlassesType; label: string; description: string; icon: string }[] = [
  { id: 'sunglasses', label: 'Sunglasses', description: 'Tinted lenses for outdoors', icon: '🕶️' },
  { id: 'regular', label: 'Regular glasses', description: 'Clear lenses, everyday or prescription', icon: '👓' },
]

export function StepType({ onSelect, onBack }: Props) {
  return (
    <StepShell title="Sunglasses or regular glasses?" onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-5xl">{opt.icon}</span>
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{opt.label}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{opt.description}</span>
          </button>
        ))}
      </div>
    </StepShell>
  )
}
