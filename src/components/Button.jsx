import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'lg', 
  className = '', 
  icon: Icon,
  fullWidth = true,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out active:scale-[0.96] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 cursor-pointer shadow-xs hover:shadow-md";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-primary/40",
    auth: "bg-white text-neutral-800 border-[1.5px] border-[#F5F0EA] hover:bg-neutral-50 hover:border-neutral-200",
    secondary: "bg-transparent text-primary-600 border border-primary-400 hover:bg-primary-50",
    danger: "bg-nakoo-red-500 text-white hover:bg-nakoo-red-600",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm rounded-xl",
    md: "py-2.5 px-5 text-base rounded-2xl",
    lg: "py-3 px-6 text-base rounded-full",
    auth: "py-3 px-6 text-base rounded-2xl" // khusus untuk tombol auth Apple/Google
  };

  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = variants[variant] || variants.primary;
  
  // Custom logic untuk Auth Button
  const sizeClass = variant === 'auth' ? sizes.auth : (sizes[size] || sizes.lg);

  return (
    <button 
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}
