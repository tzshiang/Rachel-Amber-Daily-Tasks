import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KidPage from './pages/KidPage'
import ParentDashboard from './pages/ParentDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kid/:kidId" element={<KidPage />} />
      <Route path="/parent" element={<ParentDashboard />} />
    </Routes>
  )
}

export default App
