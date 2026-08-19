import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DICTS, type Dict, type Locale } from './translations'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dict
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function detectDefaultLocale(): Locale {
  const supported: Locale[] = ['en', 'hu', 'fr', 'zh', 'es', 'de']
  for (const lang of navigator.languages ?? [navigator.language]) {
    const code = lang.slice(0, 2).toLowerCase()
    if (supported.includes(code as Locale)) return code as Locale
  }
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('cv-builder:locale', detectDefaultLocale())

  return <LocaleContext.Provider value={{ locale, setLocale, t: DICTS[locale] }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
