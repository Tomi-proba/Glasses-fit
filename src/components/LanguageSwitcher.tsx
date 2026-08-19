import { LOCALES, type Locale } from '../i18n/translations'

interface Props {
  value: Locale
  onChange: (locale: Locale) => void
}

export function LanguageSwitcher({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Locale)}
      aria-label="Language"
      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.nativeName}
        </option>
      ))}
    </select>
  )
}
