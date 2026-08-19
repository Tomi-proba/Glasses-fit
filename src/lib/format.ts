export function formatRange(start: string, end: string, current?: boolean): string {
  const endLabel = current ? 'Present' : end
  if (start && endLabel) return `${start} — ${endLabel}`
  return start || endLabel || ''
}
