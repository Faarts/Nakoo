import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { useAuth } from '../lib/AuthContext';

export function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col app-surface app-layout relative">
      <TopBar isLoggedIn={!!user} />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
