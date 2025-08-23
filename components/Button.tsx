import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}, ref) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'bg-transparent text-gray-300 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-gray-400';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-red-500/20';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-green-500/20';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'xl':
        return 'px-8 py-4 text-xl';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-300 ease-out
    transform-gpu
    relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent
    ${!isDisabled && !isLoading ? 'hover:-translate-y-0.5 active:translate-y-0' : ''}
  `;

  const combinedClasses = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {/* Shimmer Effect */}
      {variant === 'primary' && !isDisabled && (
        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
      )}
      
      {/* Left Icon */}
      {leftIcon && !isLoading && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      
      {/* Button Text */}
      <span className="relative z-10">{children}</span>
      
      {/* Right Icon */}
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
          {rightIcon}
        </span>
      )}
      
      {/* Glow Effect for Primary Buttons */}
      {variant === 'primary' && !isDisabled && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;