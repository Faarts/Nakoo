import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/nako-logo.svg';

export function TopBar({ className = '', isLoggedIn = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className={`relative z-50 flex items-center justify-between px-5 py-5 bg-transparent ${className}`}>
        {/* Logo */}
        <Link to="/" aria-label="Nakoo, beranda" className="block w-12 h-10 overflow-hidden"><img src={logo} alt="" className="h-9 w-auto max-w-none" /></Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsMenuOpen(false);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white text-nakoo-green-600 hover:bg-neutral-50 active:scale-95 transition-all relative shadow-inner-white"
            aria-label="Notifikasi" aria-expanded={isNotificationOpen}
          >
            <Bell className="w-5 h-5 text-nakoo-green-500" strokeWidth={2.5} />
            {/* Notification Badge */}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsNotificationOpen(false);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white text-nakoo-green-600 hover:bg-neutral-50 active:scale-95 transition-all"
            aria-label="Menu" aria-expanded={isMenuOpen}
          >
            <Menu className="w-5 h-5 text-nakoo-green-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dropdown Modals */}
        {isNotificationOpen && (
          <div className="absolute right-4 top-16 w-80 max-w-[calc(100vw-40px)] bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-800">Notifikasi</h3>
            </div>
            <div className="p-6 text-center">
              <Bell className="size-8 mx-auto mb-3 text-nakoo-green-500" />
              <p className="text-sm font-medium">Belum ada notifikasi baru</p>
              <p className="text-xs text-neutral-500 mt-2">Rencana si kecil dapat dilihat di Beranda.</p>
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="p-2 flex flex-col">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/my-page');
                    }}
                    className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all group w-full text-left cursor-pointer"
                  >
                    <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all group-active:scale-95 duration-300">
                      <User className="w-5 h-5 text-nakoo-green-600" />
                    </div>
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">Profil Anak</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/my-page');
                    }}
                    className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all group w-full text-left cursor-pointer"
                  >
                    <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all group-active:scale-95 duration-300">
                      <Settings className="w-5 h-5 text-neutral-500" />
                    </div>
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">Pengaturan Akun</span>
                  </button>
                  <hr className="my-1 border-neutral-100" />
                  <button 
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all group w-full text-left"
                  >
                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all group-active:scale-95 duration-300">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">Keluar</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="flex items-center gap-3 p-3 text-nakoo-green-600 hover:bg-nakoo-green-50 rounded-xl transition-all group w-full text-left"
                >
                  <div className="p-2 bg-nakoo-green-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all group-active:scale-95 duration-300">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">Masuk / Daftar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop */}
      {(isNotificationOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 animate-in fade-in duration-200"
          onClick={() => {
            setIsNotificationOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
}
