import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Settings, LogOut, Info, LogIn } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/nako-logo.svg';

export function TopBar({ className = '', isLoggedIn = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className={`relative z-50 flex items-center justify-between px-4 py-3 bg-transparent ${className}`}>
        {/* Logo */}
        <img src={logo} alt="Nakoo Logo" className="h-6 w-auto relative z-10" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsMenuOpen(false);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white text-nakooGreen-600 hover:bg-neutral-50 active:scale-95 transition-all relative shadow-[inset_0_4px_12px_white]"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 text-nakoo-green-500" strokeWidth={2.5} />
            {/* Notification Badge */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsNotificationOpen(false);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white text-nakooGreen-600 hover:bg-neutral-50 active:scale-95 transition-all"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-nakoo-green-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dropdown Modals */}
        {isNotificationOpen && (
          <div className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-800">Notifikasi</h3>
            </div>
            <div className="flex flex-col p-2 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-3 items-start p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                   <Bell className="w-5 h-5 text-primary-500" />
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  <p className="text-sm font-medium text-neutral-800">Waktunya Makan Siang!</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Menu Pasta Daging Sapi Sayuran sudah menanti si kecil.</p>
                  <span className="text-[10px] text-neutral-400 mt-2 block">10 menit yang lalu</span>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-white rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                   <Info className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  <p className="text-sm font-medium text-neutral-800">Aktivitas Baru Tersedia</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Cek rekomendasi aktivitas sensorik terbaru untuk usia 2 tahun.</p>
                  <span className="text-[10px] text-neutral-400 mt-2 block">2 jam yang lalu</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="p-2 flex flex-col">
              {isLoggedIn ? (
                <>
                  <button className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all group w-full text-left">
                    <div className="p-2 bg-neutral-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all group-active:scale-95 duration-300">
                      <User className="w-5 h-5 text-nakoo-green-600" />
                    </div>
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">Profil Anak</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all group w-full text-left">
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
