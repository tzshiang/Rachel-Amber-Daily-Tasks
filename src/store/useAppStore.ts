import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompletionRecords, DateKey, KidId } from '../types'

interface AppState {
  records: CompletionRecords
  parentPin: string
  toggleTask: (kidId: KidId, date: DateKey, taskId: string) => void
  setParentPin: (pin: string) => void
}

const emptyKidRecords = { rachel: {}, amber: {} } as CompletionRecords

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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

      setParentPin: (pin) => set({ parentPin: pin }),
    }),
    {
      name: 'rachel-amber-daily-tasks',
    },
  ),
)
