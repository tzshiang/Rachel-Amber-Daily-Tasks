import type { DateKey } from '../types'

export const toDateKey = (d: Date): DateKey => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const todayKey = (): DateKey => toDateKey(new Date())

export const addDays = (d: Date, n: number): Date => {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

/** Monday-start week containing the given date. */
export const getWeekRange = (d: Date): Date[] => {
  const dow = (d.getDay() + 6) % 7 // 0 = Monday
  const monday = addDays(d, -dow)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export const getMonthRange = (d: Date): Date[] => {
  const year = d.getFullYear()
  const month = d.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
}

export const weekLabel = (weekDays: Date[]): string => {
  const start = weekDays[0]
  const end = weekDays[weekDays.length - 1]
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(start)} - ${fmt(end)}`
}

export const monthLabel = (d: Date): string => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`

export const isFuture = (d: Date): boolean => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return d.getTime() > today.getTime()
}

export const WEEKDAY_ZH = ['一', '二', '三', '四', '五', '六', '日']
