import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProfileGuard } from './components/ProfileGuard'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { ExploreMenu } from './pages/ExploreMenu'
import { ExploreActivity } from './pages/ExploreActivity'
import { MyPage } from './pages/MyPage'
import { SetupProfile } from './pages/SetupProfile'
import { DesignPreview } from './pages/DesignPreview'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mx-auto max-w-md bg-white min-h-screen shadow-lg relative pb-20">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/design" element={<DesignPreview />} />
            
            {/* Protected Routes (Harus Login) */}
            <Route element={<ProtectedRoute />}>
              
              {/* Setup Profile Route (belum punya profil) */}
              <Route path="/setup-profile" element={
                <ProfileGuard>
                  <SetupProfile />
                </ProfileGuard>
              } />

              {/* Rute Utama (Harus Login & Punya Profil) */}
              <Route element={<ProfileGuard />}>
                <Route path="/home" element={<Home />} />
                <Route path="/explore/menu" element={<ExploreMenu />} />
                <Route path="/explore/activity" element={<ExploreActivity />} />
                <Route path="/my-page" element={<MyPage />} />
              </Route>

            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
