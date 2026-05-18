import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ReverseEnginePage from './pages/ReverseEnginePage'
import EditorPage from './pages/EditorPage'
import GeneratorPage from './pages/GeneratorPage'
import MarketplacePage from './pages/MarketplacePage'
import AIStudioPage from './pages/AIStudioPage'

export type UserRole = 'merchant' | 'builder'

interface AppContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
  userRole: UserRole
  setUserRole: (v: UserRole) => void
  userName: string
}

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userRole: 'merchant',
  setUserRole: () => {},
  userName: '',
})

export const useApp = () => useContext(AppContext)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('merchant')
  const userName = userRole === 'merchant' ? '张商家' : '李构建师'

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, userName }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/" />} />
          <Route path="/reverse-engine" element={isLoggedIn ? <ReverseEnginePage /> : <Navigate to="/" />} />
          <Route path="/editor/:id" element={isLoggedIn ? <EditorPage /> : <Navigate to="/" />} />
          <Route path="/generator" element={isLoggedIn ? <GeneratorPage /> : <Navigate to="/" />} />
          <Route path="/ai-studio" element={isLoggedIn ? <AIStudioPage /> : <Navigate to="/" />} />
          <Route path="/marketplace" element={isLoggedIn ? <MarketplacePage /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  )
}

export default App
