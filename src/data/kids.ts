import type { Kid } from '../types'

export const KIDS: Kid[] = [
  { id: 'rachel', nameZh: '安安', nameEn: 'Rachel', color: 'pink', mascot: '🐰' },
  { id: 'amber', nameZh: '樂樂', nameEn: 'Amber', color: 'purple', mascot: '🦄' },
]

export const getKid = (id: string | undefined) => KIDS.find((k) => k.id === id)
