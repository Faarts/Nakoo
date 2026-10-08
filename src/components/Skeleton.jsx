import React from 'react';

export function Skeleton({ type = 'text', className = '' }) {
  const baseClass = "bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer-sweep rounded-xl";
  
  const types = {
    card: "w-full h-48 rounded-2xl",
    text: "w-3/4 h-4 rounded-md",
    avatar: "w-12 h-12 rounded-full",
    chip: "w-16 h-8 rounded-full",
  };

  const typeClass = types[type] || types.text;

  return (
    <div className={`${baseClass} ${typeClass} ${className}`} aria-hidden="true" />
  );
}
