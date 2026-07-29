import type { CompletionRecords, KidId } from '../types'
import { TASKS } from '../data/tasks'
import { toDateKey, isFuture } from './date'

export interface RangeStats {
  totalDone: number
  totalPossible: number
  rate: number
  fullDays: number
}

export const dayRate = (records: CompletionRecords, kidId: KidId, key: string): number => {
  const day = records[kidId]?.[key]
  if (!day) return 0
  const done = TASKS.filter((t) => day[t.id]).length
  return Math.round((done / TASKS.length) * 100)
}

export const computeRangeStats = (
  records: CompletionRecords,
  kidId: KidId,
  days: Date[],
): RangeStats => {
  const pastDays = days.filter((d) => !isFuture(d))
  let totalDone = 0
  let fullDays = 0

  for (const d of pastDays) {
    const key = toDateKey(d)
    const day = records[kidId]?.[key]
    if (!day) continue
    const done = TASKS.filter((t) => day[t.id]).length
    totalDone += done
    if (done === TASKS.length) fullDays += 1
  }

  const totalPossible = pastDays.length * TASKS.length
  const rate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0

  return { totalDone, totalPossible, rate, fullDays }
}
