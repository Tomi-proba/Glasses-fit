export function formatRange(start: string, end: string, current?: boolean, presentLabel = 'Present'): string {
  const endLabel = current ? presentLabel : end
  if (start && endLabel) return `${start} — ${endLabel}`
  return start || endLabel || ''
}
