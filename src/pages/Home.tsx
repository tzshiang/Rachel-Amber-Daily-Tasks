import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KIDS } from '../data/kids'

const cardTheme = {
  pink: {
    bg: 'bg-gradient-to-br from-[#ffe0ee] to-[#ffbfdd]',
    ring: 'hover:ring-[#f8408c]',
    text: 'text-[#b8145d]',
    button: 'bg-[#f8408c] hover:bg-[#e12173]',
  },
  purple: {
    bg: 'bg-gradient-to-br from-[#ece0ff] to-[#d9c1ff]',
    ring: 'hover:ring-[#8a44ed]',
    text: 'text-[#5a17a8]',
    button: 'bg-[#8a44ed] hover:bg-[#7226d1]',
  },
} as const

export default function Home() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-10 bg-gradient-to-b from-amber-50 via-white to-violet-50 px-6 py-12">
      <div className="text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-slate-700">
          安安樂樂 <span className="text-theme-500">每日任務打卡</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500 font-medium">
          Rachel &amp; Amber's Daily Task Check-in ✨ 選一個是你的名字吧！
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        {KIDS.map((kid, i) => {
          const t = cardTheme[kid.color]
          return (
            <motion.div
              key={kid.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
            >
              <Link
                to={`/kid/${kid.id}`}
                className={`group flex w-64 flex-col items-center gap-4 rounded-[2.5rem] ${t.bg} p-8 shadow-lg ring-4 ring-transparent transition ${t.ring} hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className="text-7xl drop-shadow-sm transition group-hover:scale-110">
                  {kid.mascot}
                </span>
                <span className={`font-display text-3xl font-bold ${t.text}`}>
                  {kid.nameZh}
                </span>
                <span className={`font-display text-xl font-semibold ${t.text} opacity-80`}>
                  {kid.nameEn}
                </span>
                <span
                  className={`mt-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow ${t.button}`}
                >
                  開始打卡 Let's go!
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <Link
        to="/parent"
        className="mt-6 text-sm font-semibold text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-600"
      >
        👨‍👩‍👧‍👧 爸爸媽媽後台 Parent Dashboard
      </Link>
    </div>
  )
}
