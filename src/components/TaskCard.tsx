import { motion } from 'framer-motion'
import type { Task } from '../types'

export default function TaskCard({
  task,
  done,
  onToggle,
}: {
  task: Task
  done: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-4 rounded-3xl border-2 p-4 text-left shadow-sm transition ${
        done
          ? 'border-theme-400 bg-theme-100'
          : 'border-theme-200 bg-white hover:border-theme-300'
      }`}
    >
      <span className="text-4xl">{task.icon}</span>
      <span className="flex-1">
        <span className="font-display block text-xl font-bold text-slate-700">
          {task.nameZh}
        </span>
        <span className="block text-sm font-medium text-slate-400">{task.nameEn}</span>
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold transition ${
          done
            ? 'border-theme-500 bg-theme-500 text-white'
            : 'border-theme-300 bg-white text-transparent'
        }`}
      >
        ✓
      </span>
    </motion.button>
  )
}
