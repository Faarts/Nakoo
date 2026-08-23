import React from 'react';

export function Badge({ children, variant = 'default', icon, className = '' }) {
  const baseStyles = "text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 w-fit";
  
  const variants = {
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-nakoo-blue-50 text-nakoo-blue-600",
    green: "bg-nakoo-green-50 text-nakoo-green-700",
    primary: "bg-primary-50 text-primary-600",
    glass: "bg-white/80 backdrop-blur-md text-neutral-800 shadow-sm",
    default: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
