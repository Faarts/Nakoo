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
import { RecipeDetail } from './pages/RecipeDetail'
import { ActivityDetail } from './pages/ActivityDetail'
import { SetupProfile } from './pages/SetupProfile'

import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/OfflineIndicator'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="mx-auto max-w-md bg-white min-h-screen relative">
              <OfflineIndicator />
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/setup-profile" element={<SetupProfile />} />
              <Route path="/design" element={<DesignPreview />} />

              {/* Rute Publik Tanpa Layout (Full Screen) */}
              <Route path="/explore/menu/:id" element={<RecipeDetail />} />
              <Route path="/explore/activity/:id" element={<ActivityDetail />} />

              {/* Rute Publik dengan Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore/menu" element={<ExploreMenu />} />
                <Route path="/explore/activity" element={<ExploreActivity />} />
              </Route>

              {/* Protected Routes (Harus Login) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
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
    </ErrorBoundary>
  )
}

export default App
