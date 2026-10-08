import React from 'react';

function Spinner({ size = 'md', className = '' }) {
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg
      className={`${dim} animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'lg', 
  className = '', 
  icon: Icon,
  fullWidth = true,
  loading = false,
  disabled = false,
  ...props 
}) {
  const baseStyles = [
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-[160ms] ease-out',
    'active:scale-[0.96]',
    'hover:-translate-y-0.5',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:hover:translate-y-0 disabled:active:scale-100',
    'cursor-pointer',
    'select-none',
  ].join(' ');

  const variants = {
    primary:   'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35 active:brightness-95',
    auth:      'bg-white text-neutral-800 border-[1.5px] border-[#F5F0EA] hover:bg-neutral-50 hover:border-neutral-200 shadow-xs hover:shadow-md',
    secondary: 'bg-transparent text-primary-600 border border-primary-400 hover:bg-primary-50 shadow-none hover:shadow-sm',
    danger:    'bg-nakoo-red-500 text-white hover:bg-nakoo-red-600 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30',
  };

  const sizes = {
    sm:   'py-2 px-4 text-sm rounded-xl gap-1.5',
    md:   'py-2.5 px-5 text-base rounded-2xl gap-2',
    lg:   'py-3 px-6 text-base rounded-full gap-2',
    auth: 'py-3 px-6 text-base rounded-2xl gap-2',
  };

  const widthClass  = fullWidth ? 'w-full' : '';
  const variantClass = variants[variant] || variants.primary;
  const sizeClass   = variant === 'auth' ? sizes.auth : (sizes[size] || sizes.lg);

  return (
    <button 
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'sm' ? 'sm' : 'md'} />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
