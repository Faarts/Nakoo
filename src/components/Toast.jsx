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
    success: 'bg-nakoo-green-500',
    error: 'bg-nakoo-red-500',
    info: 'bg-nakoo-blue-500',
  };

  const Icons = {
    success: Check,
    error: X,
    info: Info,
  };

  const bgColor = styles[toast.type] || styles.info;
  const Icon = Icons[toast.type] || Icons.info;

  return (
    <div 
      className={`fixed top-4 left-4 right-4 z-[60] flex items-center justify-between p-3 rounded-xl shadow-lg text-white ${bgColor} animate-in slide-in-from-top-4 fade-in duration-300`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button 
        onClick={onDismiss}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
