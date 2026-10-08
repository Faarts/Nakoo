import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 animate-in slide-in-from-top-full duration-300 shadow-md">
      <WifiOff className="w-4 h-4" />
      <span className="text-xs font-bold">Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
    </div>
  );
}
