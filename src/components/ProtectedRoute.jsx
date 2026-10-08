import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function ProtectedRoute() {
  const location = useLocation();
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Memuat...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect ke login jika belum ada session
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (!profile && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" state={{ from: location.pathname + location.search }} replace />;
  }
  return <Outlet />;
}
