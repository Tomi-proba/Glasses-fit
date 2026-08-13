import type { LookOption } from '../types'

// Capped at 4 by design.
export const LOOKS: LookOption[] = [
  {
    id: 'everyday',
    label: 'Everyday',
    description: 'Comfortable, low-key, goes with anything',
    icon: '🌤️',
  },
  {
    id: 'classic',
    label: 'Classic',
    description: 'Timeless, polished, office-ready',
    icon: '🎩',
  },
  {
    id: 'flashy',
    label: 'Flashy',
    description: 'Bold shapes, statement colors',
    icon: '✨',
  },
  {
    id: 'sporty',
    label: 'Sporty',
    description: 'Active, durable, secure fit',
    icon: '🏃',
  },
]
