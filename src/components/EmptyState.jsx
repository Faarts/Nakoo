import React from 'react';
import { Button } from './Button';

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 animate-slide-up-fade ${className}`}>
      {icon && (
        <div className="text-[80px] leading-none mb-4 animate-float-subtle select-none" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-neutral-800">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-neutral-500 mt-2 max-w-[280px]">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <div className="mt-6 w-full max-w-[200px]">
          <Button onClick={onAction} variant="primary" fullWidth>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
