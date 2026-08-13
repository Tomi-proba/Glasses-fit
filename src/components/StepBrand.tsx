import { BRANDS } from '../data/brands'
import { StepShell } from './StepShell'

interface Props {
  onSelect: (brandId: string) => void
}

export function StepBrand({ onSelect }: Props) {
  return (
    <StepShell title="Pick a brand" subtitle="We'll only recommend frames from this brand's lineup.">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {BRANDS.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span
              className="h-9 w-9 rounded-full"
              style={{ backgroundColor: brand.accent }}
              aria-hidden="true"
            />
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">{brand.name}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{brand.tagline}</span>
          </button>
        ))}
      </div>
    </StepShell>
  )
}
