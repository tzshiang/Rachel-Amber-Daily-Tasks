import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KIDS } from '../data/kids'
import { TASKS } from '../data/tasks'
import { useAppStore } from '../store/useAppStore'
import { todayKey } from '../utils/date'
import WeekView from '../components/WeekView'
import MonthView from '../components/MonthView'

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const parentPin = useAppStore((s) => s.parentPin)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (input === parentPin) {
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 px-6">
      <p className="text-4xl">🔒</p>
      <h1 className="font-display text-2xl font-bold text-slate-700">
        爸爸媽媽後台 Parent Dashboard
      </h1>
      <p className="text-sm text-slate-400">請輸入 4 碼密碼 (預設 0000)</p>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={input}
        onChange={(e) => {
          setInput(e.target.value.replace(/\D/g, ''))
          setError(false)
        }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className={`w-32 rounded-2xl border-2 px-4 py-2 text-center text-2xl tracking-[0.5em] outline-none ${
          error ? 'border-red-400' : 'border-slate-300 focus:border-slate-500'
        }`}
      />
      {error && <p className="text-sm text-red-500">密碼不對喔，再試一次！</p>}
      <button
        type="button"
        onClick={submit}
        className="rounded-full bg-slate-700 px-6 py-2 text-sm font-bold text-white hover:bg-slate-800"
      >
        進入 Enter
      </button>
      <Link to="/" className="mt-2 text-xs text-slate-400 underline">
        回首頁
      </Link>
    </div>
  )
}

function TodayChecklist({ kidId }: { kidId: (typeof KIDS)[number]['id'] }) {
  const records = useAppStore((s) => s.records)
  const date = todayKey()
  const dayRecord = records[kidId]?.[date] ?? {}
  const doneCount = TASKS.filter((t) => dayRecord[t.id]).length

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-2 flex items-center justify-between font-display font-bold text-slate-600">
        <span>今日進度 Today</span>
        <span className="text-theme-600">
          {doneCount} / {TASKS.length}
        </span>
      </p>
      <ul className="flex flex-col gap-1.5">
        {TASKS.map((task) => {
          const done = Boolean(dayRecord[task.id])
          return (
            <li key={task.id} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  done ? 'bg-theme-500 text-white' : 'bg-slate-100 text-slate-300'
                }`}
              >
                ✓
              </span>
              <span className={done ? 'text-slate-700' : 'text-slate-400'}>
                {task.icon} {task.nameZh}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function PinSettings() {
  const parentPin = useAppStore((s) => s.parentPin)
  const setParentPin = useAppStore((s) => s.setParentPin)
  const [next, setNext] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="font-display mb-2 font-bold text-slate-600">修改密碼 Change PIN</p>
      <div className="flex items-center gap-2">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder={parentPin}
          value={next}
          onChange={(e) => {
            setNext(e.target.value.replace(/\D/g, ''))
            setSaved(false)
          }}
          className="w-24 rounded-xl border-2 border-slate-200 px-3 py-1.5 text-center tracking-widest outline-none focus:border-slate-400"
        />
        <button
          type="button"
          disabled={next.length !== 4}
          onClick={() => {
            setParentPin(next)
            setNext('')
            setSaved(true)
          }}
          className="rounded-full bg-slate-700 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-30"
        >
          儲存
        </button>
      </div>
      {saved && <p className="mt-1 text-xs text-green-600">已更新！</p>}
    </div>
  )
}

export default function ParentDashboard() {
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />

  return (
    <div data-theme="parent" className="min-h-full bg-slate-50 pb-16">
      <header className="bg-theme-600 px-6 py-6 text-white shadow">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="text-2xl" aria-label="回首頁">
            ←
          </Link>
          <h1 className="font-display text-2xl font-bold">
            👨‍👩‍👧‍👧 爸爸媽媽後台 Parent Dashboard
          </h1>
          <span className="w-6" />
        </div>
      </header>

      <main className="mx-auto mt-8 grid max-w-4xl gap-8 px-6 sm:grid-cols-2">
        {KIDS.map((kid) => (
          <section
            key={kid.id}
            data-theme={kid.color}
            className="flex flex-col gap-4 rounded-3xl bg-theme-50 p-5"
          >
            <h2 className="font-display flex items-center gap-2 text-xl font-bold text-theme-700">
              {kid.mascot} {kid.nameZh} {kid.nameEn}
            </h2>
            <TodayChecklist kidId={kid.id} />
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <WeekView kidId={kid.id} />
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <MonthView kidId={kid.id} />
            </div>
          </section>
        ))}
      </main>

      <div className="mx-auto mt-8 max-w-4xl px-6">
        <PinSettings />
      </div>
    </div>
  )
}
