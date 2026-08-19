import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const baseStyles = "text-[10px] font-medium px-2 py-1 rounded-full flex items-center w-fit";
  
  const variants = {
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-nakooBlue-50 text-nakooBlue-600",
    primary: "bg-primary-50 text-primary-600",
    default: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
