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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 ease-out pb-safe">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 w-full">
          <div className="w-10 h-1 bg-neutral-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-800">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
        
        {/* Optional Action Area (Sticky Bottom) */}
        {action && (
          <div className="px-4 py-4 border-t border-neutral-100 bg-white">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
