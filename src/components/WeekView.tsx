import type { KidId } from '../types'
import { useAppStore } from '../store/useAppStore'
import { getWeekRange, toDateKey, weekLabel, isFuture, WEEKDAY_ZH, todayKey } from '../utils/date'
import { computeRangeStats, dayRate } from '../utils/stats'
import { getHeartTier } from '../utils/rewards'
import HeartRow from './HeartRow'

export default function WeekView({ kidId }: { kidId: KidId }) {
  const records = useAppStore((s) => s.records)
  const days = getWeekRange(new Date())
  const stats = computeRangeStats(records, kidId, days)
  const tier = getHeartTier(stats.rate)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="font-display text-lg font-bold text-slate-600">本週 This Week</p>
        <p className="text-sm text-slate-400">{weekLabel(days)}</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const key = toDateKey(d)
          const future = isFuture(d)
          const rate = future ? null : dayRate(records, kidId, key)
          const isToday = key === todayKey()
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-slate-400">{WEEKDAY_ZH[i]}</span>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-sm font-bold ${
                  isToday ? 'border-theme-500' : 'border-transparent'
                } ${
                  future
                    ? 'bg-slate-50 text-slate-300'
                    : rate === 100
                      ? 'bg-theme-400 text-white'
                      : rate && rate > 0
                        ? 'bg-theme-100 text-theme-700'
                        : 'bg-slate-100 text-slate-300'
                }`}
              >
                {future ? '' : rate === 100 ? '💖' : d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-2 rounded-3xl bg-theme-50 px-6 py-4">
        <HeartRow hearts={tier.hearts} />
        <p className="font-display font-bold text-theme-700">{tier.labelZh}</p>
        <p className="text-xs font-medium text-slate-400">{tier.labelEn}</p>
        <p className="text-xs text-slate-400">
          完成率 {stats.rate}%・全勤 {stats.fullDays} 天
        </p>
      </div>
    </div>
  )
}
