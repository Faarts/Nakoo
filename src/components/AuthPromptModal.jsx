import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

export function AuthPromptModal({
  isOpen,
  onClose,
  title = "Masuk atau Daftar Terlebih Dahulu",
  message = "Untuk menambahkan resep atau aktivitas ke dalam rencana harian si kecil, Bunda perlu masuk atau membuat akun terlebih dahulu.",
  itemType = "item"
}) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleNavigateToAuth = (tab = 'masuk') => {
    onClose?.();
    navigate('/login', {
      state: {
        from: location.pathname,
        initialTab: tab
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Sheet Box */}
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-7 z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 border-t sm:border border-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="text-center pt-2 pb-1">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-400 via-primary-400 to-nakoo-green-400 p-0.5 shadow-lg shadow-orange-400/20 animate-float-subtle">
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-orange-500">
                <Lock className="w-8 h-8 text-orange-500 stroke-[2.2]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-nakoo-green-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 leading-snug mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto mb-5">
            {message}
          </p>
        </div>

        {/* Value Highlights */}
        <div className="bg-[#FFF9F3] border border-[#F6C6A0]/60 rounded-2xl p-3.5 mb-6 space-y-2 text-left">
          <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-nakoo-green-600 shrink-0" />
            <span>Simpan jadwal menu & stimulasi harian terstruktur</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-nakoo-green-600 shrink-0" />
            <span>Pantau alergi & kebutuhan nutrisi usia si kecil</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-nakoo-green-600 shrink-0" />
            <span>Tersinkronisasi otomatis di semua perangkat Bunda</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            type="button"
            onClick={() => handleNavigateToAuth('masuk')}
            fullWidth
            className="bg-[#FBB040] hover:bg-[#faa020] text-white shadow-md shadow-orange-400/30 py-3.5 text-sm font-bold active:scale-[0.98] transition-all cursor-pointer"
          >
            Masuk ke Akun
          </Button>

          <button
            type="button"
            onClick={() => handleNavigateToAuth('daftar')}
            className="w-full py-3.5 rounded-full border border-orange-200 bg-orange-50/50 hover:bg-orange-100/60 text-orange-900 font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer"
          >
            Daftar Akun Baru (Gratis)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-neutral-400 hover:text-neutral-600 font-medium transition-colors cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
