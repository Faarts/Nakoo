import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function ProfileGuard() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Memuat profil...</p>
      </div>
    );
  }

  // Jika profile kosong, paksa ke /setup-profile
  // Kecuali jika memang sedang berada di /setup-profile
  if (!profile && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />;
  }
  
  // Jika profile sudah ada tapi mencoba akses /setup-profile, arahkan ke /home
  // (Asumsi: edit profil dilakukan di dalam aplikasi, bukan di halaman setup awal)
  if (profile && location.pathname === '/setup-profile') {
     return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
