import React from 'react';

export function Badge({ children, variant = 'default', icon, className = '' }) {
  const baseStyles = "text-[10px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 w-fit transition-all duration-200";
  
  const variants = {
    red: "bg-red-50 text-red-600 border border-red-100",
    yellow: "bg-orange-50 text-orange-700 border border-orange-100",
    blue: "bg-nakoo-blue-50 text-nakoo-blue-600 border border-nakoo-blue-100",
    green: "bg-nakoo-green-50 text-nakoo-green-700 border border-nakoo-green-100",
    primary: "bg-primary-50 text-primary-700 border border-primary-100",
    glass: "bg-white/85 backdrop-blur-md text-neutral-800 shadow-xs border border-white/40",
    default: "bg-neutral-100 text-neutral-600 border border-neutral-200/60",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
