import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
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
  const baseStyles = "font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ease-in-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 relative overflow-hidden";

  const variantStyles = {
    primary: "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-400/30",
    secondary: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 shadow-lg shadow-red-500/20 hover:-translate-y-1 transition-all duration-300",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40 hover:shadow-lg transition-all duration-300"
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-2.5 text-base gap-2",
    lg: "px-8 py-3 text-lg gap-3",
  };

  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -top-10 -bottom-10 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 hover:opacity-100 hover:animate-shimmer transition-opacity duration-300"></div>
      )}
      
      {isLoading && loadingSpinner}
      {leftIcon && !isLoading && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && !isLoading && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;