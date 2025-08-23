
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  color?: 'primary' | 'white' | 'green' | 'blue';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className = '', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-[5px]',
  };

  const colorClasses = {
    primary: 'border-orange-500 border-t-transparent',
    white: 'border-white/30 border-t-white',
    green: 'border-green-500 border-t-transparent',
    blue: 'border-blue-500 border-t-transparent'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        ></div>
        
        {/* Glow effect for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <div
            className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin opacity-30 blur-sm`}
          ></div>
        )}
        
        {/* Pulsing dot in center for extra visual appeal */}
        {size !== 'sm' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      {text && (
        <p className={`mt-3 text-slate-300 ${textSizes[size]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;