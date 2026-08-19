import React from 'react';

export function Input({ 
  label, 
  error, 
  icon: Icon, 
  variant = 'default', // 'default' (boxed) atau 'underline' (untuk form login)
  className = '',
  ...props 
}) {
  const isUnderline = variant === 'underline';
  
  const baseWrapperStyles = "relative flex items-center";
  const underlineWrapperStyles = "border-b border-neutral-200 focus-within:border-primary-400 focus-within:border-b-2 transition-colors duration-150";
  const defaultWrapperStyles = `bg-white border rounded-xl p-[12px] focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-colors duration-150 ${error ? 'border-nakooRed-400 ring-2 ring-nakooRed-100' : 'border-neutral-200'}`;

  const wrapperClass = isUnderline ? underlineWrapperStyles : defaultWrapperStyles;

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className={`${baseWrapperStyles} ${wrapperClass}`}>
        {Icon && (
          <Icon className={`w-5 h-5 ${isUnderline ? 'text-nakooIcon mr-3' : 'text-nakooIcon mr-2 absolute left-[12px]'}`} />
        )}
        
        <input 
          className={`w-full bg-transparent text-base text-neutral-800 placeholder:text-neutral-400 outline-none ${
            isUnderline ? 'h-12 py-3' : 'py-0'
          } ${Icon && !isUnderline ? 'pl-8' : ''}`}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-xs text-nakooRed-500 mt-1">{error}</span>
      )}
    </div>
  );
}
