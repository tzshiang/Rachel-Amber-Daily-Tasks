import type { HeartTier } from '../types'

const TIERS: HeartTier[] = [
  { hearts: 5, labelZh: '超級全勤小主人！', labelEn: 'Superstar Champion!' },
  { hearts: 4, labelZh: '好棒棒，快滿分了！', labelEn: 'Amazing job!' },
  { hearts: 3, labelZh: '表現不錯，繼續加油！', labelEn: 'Great effort!' },
  { hearts: 2, labelZh: '有進步，再努力一下！', labelEn: 'Keep going!' },
  { hearts: 1, labelZh: '跨出了第一步！', labelEn: 'Nice start!' },
  { hearts: 0, labelZh: '明天再一起加油吧！', labelEn: 'Let’s try again tomorrow!' },
]

/** rate is a 0-100 completion percentage. */
export const getHeartTier = (rate: number): HeartTier => {
  if (rate >= 100) return TIERS[0]
  if (rate >= 80) return TIERS[1]
  if (rate >= 60) return TIERS[2]
  if (rate >= 40) return TIERS[3]
  if (rate > 0) return TIERS[4]
  return TIERS[5]
}

export const MAX_HEARTS = 5
