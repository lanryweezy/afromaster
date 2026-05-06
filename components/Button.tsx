import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "relative font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95 overflow-hidden";

  const variantStyles = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-transparent",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 shadow-md",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-700",
    glass: "bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 hover:border-white/20 shadow-lg"
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Glossy overlay effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
      )}
      
      {isLoading && loadingSpinner}
      {leftIcon && !isLoading && <span className="mr-2.5">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {rightIcon && !isLoading && <span className="ml-2.5">{rightIcon}</span>}
    </button>
  );
};

export default Button;