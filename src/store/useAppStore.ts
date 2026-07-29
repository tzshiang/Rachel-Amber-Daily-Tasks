import { create } from 'zustand'
import type { CompletionRecords, DateKey, KidId } from '../types'
import { supabase } from '../lib/supabaseClient'

type Status = 'idle' | 'loading' | 'ready' | 'error'

interface AppState {
  records: CompletionRecords
  parentPin: string
  status: Status
  errorMessage: string | null
  init: () => Promise<void>
  toggleTask: (kidId: KidId, date: DateKey, taskId: string) => Promise<void>
  setParentPin: (pin: string) => Promise<void>
}

const emptyKidRecords = { rachel: {}, amber: {} } as CompletionRecords

const withToggled = (
  records: CompletionRecords,
  kidId: KidId,
  date: DateKey,
  taskId: string,
  done: boolean,
): CompletionRecords => ({
  ...records,
  [kidId]: {
    ...records[kidId],
    [date]: { ...records[kidId]?.[date], [taskId]: done },
  },
})

export const useAppStore = create<AppState>()((set, get) => ({
  records: emptyKidRecords,
  parentPin: '0000',
  status: 'idle',
  errorMessage: null,

  init: async () => {
    if (!supabase) {
      set({
        status: 'error',
        errorMessage: '尚未設定 Supabase，資料無法讀取或保存。',
      })
      return
    }

    set({ status: 'loading', errorMessage: null })

    try {
      const [completionsRes, settingsRes] = await Promise.all([
        supabase.from('task_completions').select('kid_id, date, task_id'),
        supabase.from('app_settings').select('parent_pin').eq('id', 1).single(),
      ])

      if (completionsRes.error || settingsRes.error) {
        set({
          status: 'error',
          errorMessage: '無法連線到雲端資料庫，請檢查網路連線後重新整理。',
        })
        return
      }

      let records = emptyKidRecords
      for (const row of completionsRes.data ?? []) {
        const kidId = row.kid_id as KidId
        if (!records[kidId]) continue
        records = withToggled(records, kidId, row.date, row.task_id, true)
      }

      set({
        records,
        parentPin: settingsRes.data?.parent_pin ?? '0000',
        status: 'ready',
      })
    } catch {
      set({
        status: 'error',
        errorMessage: '無法連線到雲端資料庫，請檢查網路連線後重新整理。',
      })
    }
  },

  toggleTask: async (kidId, date, taskId) => {
    if (!supabase) return
    const wasDone = Boolean(get().records[kidId]?.[date]?.[taskId])
    const nextDone = !wasDone

    set((state) => ({
      records: withToggled(state.records, kidId, date, taskId, nextDone),
      errorMessage: null,
    }))

    const { error } = nextDone
      ? await supabase.from('task_completions').upsert({ kid_id: kidId, date, task_id: taskId })
      : await supabase
          .from('task_completions')
          .delete()
          .match({ kid_id: kidId, date, task_id: taskId })

    if (error) {
      // Revert the optimistic update and surface the failure.
      set((state) => ({
        records: withToggled(state.records, kidId, date, taskId, wasDone),
        errorMessage: '打卡儲存失敗，請檢查網路連線後再試一次。',
      }))
    }
  },

  setParentPin: async (pin) => {
    if (!supabase) return
    const previousPin = get().parentPin
    set({ parentPin: pin, errorMessage: null })

    const { error } = await supabase.from('app_settings').update({ parent_pin: pin }).eq('id', 1)

    if (error) {
      set({ parentPin: previousPin, errorMessage: '密碼更新失敗，請檢查網路連線後再試一次。' })
    }
  },
}))
