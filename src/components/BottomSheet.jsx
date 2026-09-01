import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  action 
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Sheet */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-[32px] shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300 ease-out pb-safe border-t border-neutral-100">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3.5 pb-1.5 w-full cursor-grab">
          <div className="w-12 h-1.5 bg-neutral-300 hover:bg-neutral-400 rounded-full transition-colors" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3.5 pt-1 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-800">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        
        {/* Optional Action Area (Sticky Bottom) */}
        {action && (
          <div className="px-5 py-4 border-t border-neutral-100 bg-white/95 backdrop-blur-sm">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
