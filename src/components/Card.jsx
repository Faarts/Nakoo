import React from 'react';

export function Card({ children, className = '', highlight = false, interactive = false, ...props }) {
  const baseStyles = "bg-white rounded-2xl p-4 transition-all duration-200";
  const highlightStyles = highlight ? "ring-2 ring-primary-300 bg-primary-50" : "shadow-sm";
  const interactiveStyles = interactive ? "cursor-pointer hover:shadow-md active:scale-[0.99]" : "";

  return (
    <div 
      className={`${baseStyles} ${highlightStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
