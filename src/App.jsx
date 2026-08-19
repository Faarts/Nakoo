import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { ExploreMenu } from './pages/ExploreMenu'
import { ExploreActivity } from './pages/ExploreActivity'
import { MyPage } from './pages/MyPage'
import { DesignPreview } from './pages/DesignPreview'

import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
        <div className="mx-auto max-w-md bg-white min-h-screen shadow-lg relative">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/design" element={<DesignPreview />} />
            
            {/* Rute Publik dengan Layout */}
            <Route element={<Layout />}>
              <Route path="/explore/menu" element={<ExploreMenu />} />
              <Route path="/explore/activity" element={<ExploreActivity />} />
            </Route>

            {/* Protected Routes (Harus Login) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/my-page" element={<MyPage />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </ToastProvider>
  )
}

export default App
