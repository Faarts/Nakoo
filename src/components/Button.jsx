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
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-150 ease-in-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    auth: "bg-white text-neutral-800 border-[1.5px] border-[#F5F0EA] hover:bg-neutral-50",
    secondary: "bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50",
    danger: "bg-nakooRed-500 text-white hover:bg-nakooRed-600",
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
