export type KidId = 'rachel' | 'amber'
export type KidColor = 'pink' | 'purple'

export interface Kid {
  id: KidId
  nameZh: string
  nameEn: string
  color: KidColor
  mascot: string
}

export interface Task {
  id: string
  nameZh: string
  nameEn: string
  icon: string
}

/** date is an ISO day string, e.g. "2026-07-29" */
export type DateKey = string

/** records[kidId][date][taskId] = true when completed */
export type CompletionRecords = Record<KidId, Record<DateKey, Record<string, boolean>>>

export interface HeartTier {
  hearts: number
  labelZh: string
  labelEn: string
}
