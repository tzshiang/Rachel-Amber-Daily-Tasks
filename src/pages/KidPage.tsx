import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getKid } from '../data/kids'
import { TASKS } from '../data/tasks'
import { useAppStore } from '../store/useAppStore'
import { todayKey } from '../utils/date'
import { celebrate } from '../utils/celebrate'
import TaskCard from '../components/TaskCard'
import WeekView from '../components/WeekView'
import MonthView from '../components/MonthView'
import type { KidId } from '../types'

const confettiColors: Record<'pink' | 'purple', string[]> = {
  pink: ['#f8408c', '#ff96c4', '#ffe0ee', '#ffffff'],
  purple: ['#8a44ed', '#bd96ff', '#ece0ff', '#ffffff'],
}

type Tab = 'today' | 'week' | 'month'

export default function KidPage() {
  const { kidId } = useParams()
  const kid = getKid(kidId)
  const [tab, setTab] = useState<Tab>('today')
  const toggleTask = useAppStore((s) => s.toggleTask)
  const isTaskDone = useAppStore((s) => s.isTaskDone)
  const isDayFull = useAppStore((s) =>
    kid ? s.isDayFull(kid.id, todayKey()) : false,
  )
  const wasFull = useRef(false)

  useEffect(() => {
    if (isDayFull && !wasFull.current && kid) {
      celebrate(confettiColors[kid.color])
    }
    wasFull.current = isDayFull
  }, [isDayFull, kid])

  if (!kid) return <Navigate to="/" replace />

  const date = todayKey()
  const kidIdTyped = kid.id as KidId

  return (
    <div data-theme={kid.color} className="min-h-full bg-theme-50 pb-16">
      <header className="bg-theme-500 px-6 py-6 text-white shadow">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link to="/" className="text-2xl" aria-label="回首頁">
            ←
          </Link>
          <div className="text-center">
            <p className="font-display text-2xl font-bold">
              {kid.mascot} {kid.nameZh} {kid.nameEn}
            </p>
            <p className="text-xs font-medium text-white/80">{date}</p>
          </div>
          <span className="w-6" />
        </div>
      </header>

      <nav className="mx-auto mt-6 flex max-w-md justify-center gap-2 px-6">
        {(
          [
            ['today', '今天', 'Today'],
            ['week', '本週', 'Week'],
            ['month', '本月', 'Month'],
          ] as const
        ).map(([value, zh, en]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${
              tab === value
                ? 'bg-theme-500 text-white shadow'
                : 'bg-white text-theme-600 hover:bg-theme-100'
            }`}
          >
            {zh} {en}
          </button>
        ))}
      </nav>

      <main className="mx-auto mt-6 max-w-md px-6">
        {tab === 'today' && (
          <div className="flex flex-col gap-3">
            {TASKS.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                done={isTaskDone(kidIdTyped, date, task.id)}
                onToggle={() => toggleTask(kidIdTyped, date, task.id)}
              />
            ))}
            {isDayFull && (
              <p className="mt-2 text-center font-display text-lg font-bold text-theme-700">
                🎉 今天全部完成了！好棒棒！ All done today! 🎉
              </p>
            )}
          </div>
        )}
        {tab === 'week' && <WeekView kidId={kidIdTyped} />}
        {tab === 'month' && <MonthView kidId={kidIdTyped} />}
      </main>
    </div>
  )
}
