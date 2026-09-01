import React from 'react';

export function Card({ children, className = '', highlight = false, interactive = false, ...props }) {
  const baseStyles = "bg-white rounded-2xl p-4 transition-all duration-300 ease-out";
  const highlightStyles = highlight ? "ring-2 ring-primary-400 bg-primary-50/70 shadow-xs" : "shadow-xs border border-neutral-100/80";
  const interactiveStyles = interactive ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0" : "";

  return (
    <div 
      className={`${baseStyles} ${highlightStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
