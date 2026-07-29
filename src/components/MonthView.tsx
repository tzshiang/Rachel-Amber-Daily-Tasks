import type { KidId } from '../types'
import { useAppStore } from '../store/useAppStore'
import { getMonthRange, toDateKey, monthLabel, isFuture, todayKey } from '../utils/date'
import { computeRangeStats, dayRate } from '../utils/stats'
import { getHeartTier } from '../utils/rewards'
import HeartRow from './HeartRow'

export default function MonthView({ kidId }: { kidId: KidId }) {
  const records = useAppStore((s) => s.records)
  const today = new Date()
  const days = getMonthRange(today)
  const stats = computeRangeStats(records, kidId, days)
  const tier = getHeartTier(stats.rate)

  const leadingBlanks = (days[0].getDay() + 6) % 7 // Monday-start offset

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="font-display text-lg font-bold text-slate-600">本月 This Month</p>
        <p className="text-sm text-slate-400">{monthLabel(today)}</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {['一', '二', '三', '四', '五', '六', '日'].map((w) => (
          <span key={w} className="text-center text-xs font-semibold text-slate-400">
            {w}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {days.map((d) => {
          const key = toDateKey(d)
          const future = isFuture(d)
          const rate = future ? null : dayRate(records, kidId, key)
          const isToday = key === todayKey()
          return (
            <div
              key={key}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 text-xs font-bold ${
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
