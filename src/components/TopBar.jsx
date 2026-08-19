import React from 'react';
import { Bell, Menu } from 'lucide-react';
import logo from '../assets/nako-logo.svg';

export function TopBar({ onMenuClick, onNotificationClick, className = '' }) {
  return (
    <header className={`flex items-center justify-between px-4 py-3 bg-transparent ${className}`}>
      {/* Logo */}
      <img src={logo} alt="Nakoo Logo" className="h-8 w-auto" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={onNotificationClick}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-nakooGreen-600 hover:bg-neutral-50 active:scale-95 transition-all"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <button 
          type="button"
          onClick={onMenuClick}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-nakooGreen-600 hover:bg-neutral-50 active:scale-95 transition-all"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
