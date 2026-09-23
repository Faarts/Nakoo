import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Check, X, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { id, message, type: 'success' | 'error' | 'info' }

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {toast && <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const DURATION = 3500; // ms
  const [exiting, setExiting] = useState(false);
  const exitTimerRef  = useRef(null);
  const autoTimerRef  = useRef(null);

  const triggerDismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    exitTimerRef.current = setTimeout(() => {
      onDismiss();
    }, 220);
  }, [exiting, onDismiss]);

  // Auto-dismiss after DURATION
  useEffect(() => {
    autoTimerRef.current = setTimeout(triggerDismiss, DURATION);
    return () => {
      clearTimeout(autoTimerRef.current);
      clearTimeout(exitTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const styles = {
    success: { bg: 'bg-emerald-600',     border: 'border-emerald-500', shadow: 'shadow-emerald-500/20' },
    error:   { bg: 'bg-nakoo-red-500',   border: 'border-red-400',     shadow: 'shadow-red-500/20'     },
    info:    { bg: 'bg-nakoo-blue-600',  border: 'border-blue-400',    shadow: 'shadow-blue-500/20'    },
  };

  const icons = {
    success: Check,
    error:   AlertCircle,
    info:    Info,
  };

  const s    = styles[toast.type] || styles.info;
  const Icon = icons[toast.type]  || icons.info;

  return (
    <div
      className={`
        fixed left-4 right-4 max-w-md mx-auto z-[60]
        flex flex-col rounded-3xl shadow-xl text-white
        ${s.bg} ${s.border} ${s.shadow}
        border overflow-hidden backdrop-blur-md
        ${exiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      /* Position above the bottom nav (72px) + safe area padding */
      style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between p-3.5 gap-3">
        {/* Icon + message */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-bounce-once">
            <Icon className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-sm font-semibold leading-snug">{toast.message}</span>
        </div>

        {/* Dismiss */}
        <button
          onClick={triggerDismiss}
          aria-label="Tutup notifikasi"
          className="p-1.5 rounded-full hover:bg-white/20 active:scale-90 transition-all shrink-0 text-white/80 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown progress bar */}
      <div className="w-full h-1 bg-black/15 overflow-hidden">
        <div
          className="h-full bg-white/60"
          style={{ animation: `toastProgress ${DURATION}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}
