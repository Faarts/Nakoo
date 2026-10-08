import { ScrollToPage } from './components/ScrollToPage'
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
<<<<<<< HEAD
=======
import { ActivityDetail } from './pages/ActivityDetail'
import { SetupProfile } from './pages/SetupProfile'
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc

import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/OfflineIndicator'
import { ToastProvider } from './components/Toast'

function App() {
  return (
<<<<<<< HEAD
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="mx-auto max-w-md bg-white min-h-screen relative">
            <Routes>
              <Route path="/login" element={<Login />} />
=======
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ScrollToPage />
            <div className="mx-auto max-w-md bg-white min-h-screen relative">
              <OfflineIndicator />
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}><Route path="/setup-profile" element={<SetupProfile />} /></Route>
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc
              <Route path="/design" element={<DesignPreview />} />

              {/* Rute Publik Tanpa Layout (Full Screen) */}
              <Route path="/explore/menu/:id" element={<RecipeDetail />} />
<<<<<<< HEAD
=======
              <Route path="/explore/activity/:id" element={<ActivityDetail />} />
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc

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
