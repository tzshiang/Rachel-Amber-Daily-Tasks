import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getKid } from '../data/kids'
import type { KidColor } from '../types'
import { buildRandomQuestions, buildTableQuestions, type MathQuestion } from '../utils/math99'
import { getHeartTier } from '../utils/rewards'
import { celebrate, KID_CONFETTI_COLORS } from '../utils/celebrate'
import HeartRow from '../components/HeartRow'

const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9]
const RANDOM_QUESTION_COUNT = 20

type Stage =
  | { mode: 'menu' }
  | { mode: 'quiz'; label: string; questions: MathQuestion[] }
  | { mode: 'result'; label: string; total: number; correct: number }

export default function MathPracticePage() {
  const { kidId } = useParams()
  const kid = getKid(kidId)
  const [stage, setStage] = useState<Stage>({ mode: 'menu' })

  if (!kid) return <Navigate to="/" replace />

  return (
    <div data-theme={kid.color} className="min-h-full bg-theme-50 pb-16">
      <header className="bg-theme-500 px-6 py-6 text-white shadow">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link to={`/kid/${kid.id}`} className="text-2xl" aria-label="回打卡頁">
            ←
          </Link>
          <div className="text-center">
            <p className="font-display text-2xl font-bold">🔢 九九乘法表練習</p>
            <p className="text-xs font-medium text-white/80">
              {kid.mascot} {kid.nameZh} {kid.nameEn}
            </p>
          </div>
          <span className="w-6" />
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-md px-6">
        {stage.mode === 'menu' && (
          <MenuView
            onPickNumber={(n) =>
              setStage({ mode: 'quiz', label: `${n} 的乘法表`, questions: buildTableQuestions(n) })
            }
            onRandom={() =>
              setStage({
                mode: 'quiz',
                label: '亂數挑戰',
                questions: buildRandomQuestions(RANDOM_QUESTION_COUNT),
              })
            }
          />
        )}
        {stage.mode === 'quiz' && (
          <QuizView
            key={stage.label}
            label={stage.label}
            questions={stage.questions}
            onFinish={(correct) =>
              setStage({ mode: 'result', label: stage.label, total: stage.questions.length, correct })
            }
          />
        )}
        {stage.mode === 'result' && (
          <ResultView
            label={stage.label}
            total={stage.total}
            correct={stage.correct}
            kidColor={kid.color}
            onRetry={() => setStage({ mode: 'menu' })}
          />
        )}
      </main>
    </div>
  )
}

function MenuView({
  onPickNumber,
  onRandom,
}: {
  onPickNumber: (n: number) => void
  onRandom: () => void
}) {
  return (
    <div className="flex flex-col gap-7">
      <section>
        <h2 className="font-display mb-3 text-lg font-bold text-slate-700">選一個數字，練習它的乘法表</h2>
        <div className="grid grid-cols-4 gap-3">
          {NUMBERS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPickNumber(n)}
              className="rounded-2xl border-2 border-theme-200 bg-white py-4 font-display text-2xl font-bold text-theme-600 shadow-sm transition hover:border-theme-400 hover:bg-theme-100"
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-3 text-lg font-bold text-slate-700">或是來挑戰亂數題目</h2>
        <button
          type="button"
          onClick={onRandom}
          className="w-full rounded-2xl bg-theme-500 py-4 font-display text-xl font-bold text-white shadow hover:bg-theme-600"
        >
          🎲 亂數 {RANDOM_QUESTION_COUNT} 題挑戰
        </button>
      </section>
    </div>
  )
}

function QuizView({
  label,
  questions,
  onFinish,
}: {
  label: string
  questions: MathQuestion[]
  onFinish: (correct: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => () => {
    mountedRef.current = false
  }, [])

  const question = questions[index]

  const handlePick = (choice: number) => {
    if (picked !== null) return
    setPicked(choice)
    const isCorrect = choice === question.answer
    const nextCorrect = isCorrect ? correct + 1 : correct
    if (isCorrect) setCorrect(nextCorrect)

    setTimeout(() => {
      if (!mountedRef.current) return
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1)
        setPicked(null)
      } else {
        onFinish(nextCorrect)
      }
    }, 700)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>{label}</span>
          <span>
            {index + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-theme-100">
          <div
            className="h-full rounded-full bg-theme-500 transition-all"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="font-display text-4xl font-bold text-theme-700">
        {question.a} × {question.b} = ?
      </p>

      <div className="grid w-full grid-cols-2 gap-3">
        {question.choices.map((choice) => {
          const isPicked = picked === choice
          const isAnswer = choice === question.answer
          const showState = picked !== null
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handlePick(choice)}
              disabled={picked !== null}
              className={`rounded-2xl border-2 py-5 font-display text-2xl font-bold shadow-sm transition ${
                showState && isAnswer
                  ? 'border-green-400 bg-green-100 text-green-700'
                  : showState && isPicked
                    ? 'border-red-300 bg-red-100 text-red-600'
                    : 'border-theme-200 bg-white text-theme-600 hover:border-theme-400'
              }`}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ResultView({
  label,
  total,
  correct,
  kidColor,
  onRetry,
}: {
  label: string
  total: number
  correct: number
  kidColor: KidColor
  onRetry: () => void
}) {
  const rate = Math.round((correct / total) * 100)
  const tier = getHeartTier(rate)

  useEffect(() => {
    if (rate === 100) celebrate(KID_CONFETTI_COLORS[kidColor])
  }, [rate, kidColor])

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-lg font-bold text-slate-600">{label} 結果</p>
      <p className="font-display text-5xl font-bold text-theme-700">
        {correct} / {total}
      </p>
      <p className="text-sm text-slate-400">答對率 {rate}%</p>
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-theme-50 px-6 py-4">
        <HeartRow hearts={tier.hearts} />
        <p className="font-display font-bold text-theme-700">{tier.labelZh}</p>
        <p className="text-xs font-medium text-slate-400">{tier.labelEn}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-full bg-theme-500 px-6 py-2 text-sm font-bold text-white shadow hover:bg-theme-600"
      >
        再玩一次 Try Again
      </button>
    </div>
  )
}
