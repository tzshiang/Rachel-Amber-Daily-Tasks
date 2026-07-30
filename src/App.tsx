import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KidPage from './pages/KidPage'
import MathPracticePage from './pages/MathPracticePage'
import ParentDashboard from './pages/ParentDashboard'
import { useAppStore } from './store/useAppStore'
import { isSupabaseConfigured } from './lib/supabaseClient'

function SetupNotice() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <p className="text-4xl">🛠️</p>
      <h1 className="font-display text-xl font-bold text-slate-700">
        還沒有連接雲端資料庫
      </h1>
      <p className="max-w-sm text-sm text-slate-500">
        請在部署環境設定 <code className="rounded bg-slate-200 px-1">VITE_SUPABASE_URL</code> 和{' '}
        <code className="rounded bg-slate-200 px-1">VITE_SUPABASE_ANON_KEY</code> 這兩個環境變數後重新部署。
      </p>
    </div>
  )
}

function LoadErrorNotice({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <p className="text-4xl">😢</p>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-slate-700 px-6 py-2 text-sm font-bold text-white hover:bg-slate-800"
      >
        重新整理 Retry
      </button>
    </div>
  )
}

function App() {
  const status = useAppStore((s) => s.status)
  const errorMessage = useAppStore((s) => s.errorMessage)
  const init = useAppStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  if (!isSupabaseConfigured) return <SetupNotice />
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50">
        <p className="animate-pulse text-4xl">💖</p>
      </div>
    )
  }
  if (status === 'error') {
    return <LoadErrorNotice message={errorMessage ?? '發生錯誤'} onRetry={init} />
  }

  return (
    <>
      {errorMessage && (
        <div className="bg-red-500 px-4 py-2 text-center text-sm font-bold text-white">
          {errorMessage}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kid/:kidId" element={<KidPage />} />
        <Route path="/kid/:kidId/math" element={<MathPracticePage />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </>
  )
}

export default App
