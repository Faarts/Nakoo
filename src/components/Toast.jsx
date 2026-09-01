import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';

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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {toast && <ToastItem toast={toast} onDismiss={dismissToast} />}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const styles = {
    success: 'bg-emerald-600 border-emerald-500 shadow-emerald-500/20',
    error: 'bg-nakoo-red-500 border-red-400 shadow-red-500/20',
    info: 'bg-nakoo-blue-500 border-blue-400 shadow-blue-500/20',
  };

  const Icons = {
    success: Check,
    error: X,
    info: Info,
  };

  const colorClass = styles[toast.type] || styles.info;
  const Icon = Icons[toast.type] || Icons.info;

  return (
    <div 
      className={`fixed top-4 left-4 right-4 max-w-md mx-auto z-[60] flex flex-col rounded-2xl shadow-xl text-white ${colorClass} border overflow-hidden animate-slide-up-fade transition-all duration-300 backdrop-blur-md`}
      role="alert"
    >
      <div className="flex items-center justify-between p-3.5 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-bounce-once">
            <Icon className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold leading-tight">{toast.message}</span>
        </div>
        <button 
          onClick={onDismiss}
          className="p-1.5 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white/80 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Animated countdown timer line */}
      <div className="w-full h-1 bg-black/15 overflow-hidden">
        <div 
          className="h-full bg-white/60 transition-all ease-linear"
          style={{
            animation: 'toastProgress 3000ms linear forwards'
          }}
        />
      </div>
      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
