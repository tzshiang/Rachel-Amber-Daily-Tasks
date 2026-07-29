import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompletionRecords, DateKey, KidId } from '../types'
import { TASKS } from '../data/tasks'

interface AppState {
  records: CompletionRecords
  parentPin: string
  toggleTask: (kidId: KidId, date: DateKey, taskId: string) => void
  isTaskDone: (kidId: KidId, date: DateKey, taskId: string) => boolean
  dayCompletionRate: (kidId: KidId, date: DateKey) => number
  isDayFull: (kidId: KidId, date: DateKey) => boolean
  setParentPin: (pin: string) => void
}

const emptyKidRecords = { rachel: {}, amber: {} } as CompletionRecords

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      records: emptyKidRecords,
      parentPin: '0000',

      toggleTask: (kidId, date, taskId) => {
        set((state) => {
          const kidRecords = state.records[kidId] ?? {}
          const dayRecord = kidRecords[date] ?? {}
          const nextDay = { ...dayRecord, [taskId]: !dayRecord[taskId] }
          return {
            records: {
              ...state.records,
              [kidId]: { ...kidRecords, [date]: nextDay },
            },
          }
        })
      },

      isTaskDone: (kidId, date, taskId) => {
        return Boolean(get().records[kidId]?.[date]?.[taskId])
      },

      dayCompletionRate: (kidId, date) => {
        const day = get().records[kidId]?.[date]
        if (!day) return 0
        const done = TASKS.filter((t) => day[t.id]).length
        return Math.round((done / TASKS.length) * 100)
      },

      isDayFull: (kidId, date) => {
        const day = get().records[kidId]?.[date]
        if (!day) return false
        return TASKS.every((t) => day[t.id])
      },

      setParentPin: (pin) => set({ parentPin: pin }),
    }),
    {
      name: 'rachel-amber-daily-tasks',
    },
  ),
)
