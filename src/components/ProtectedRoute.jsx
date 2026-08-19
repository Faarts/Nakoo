import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Memuat...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect ke login jika belum ada session
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
