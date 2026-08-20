import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { useAuth } from '../lib/AuthContext';

export function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 relative pb-20">
      <TopBar isLoggedIn={!!user} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
