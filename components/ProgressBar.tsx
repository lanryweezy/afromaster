
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'green' | 'blue' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-r from-orange-500 to-red-600',
      glow: 'shadow-orange-500/50',
      text: 'text-orange-400'
    },
    green: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      glow: 'shadow-green-500/50',
      text: 'text-green-400'
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/50',
      text: 'text-blue-400'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-500 to-violet-600',
      glow: 'shadow-purple-500/50',
      text: 'text-purple-400'
    }
  };

  const sizeClasses = {
    sm: {
      height: 'h-2',
      text: 'text-xs',
      radius: 'rounded-lg'
    },
    md: {
      height: 'h-3',
      text: 'text-sm',
      radius: 'rounded-xl'
    },
    lg: {
      height: 'h-4',
      text: 'text-base',
      radius: 'rounded-2xl'
    }
  };

  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <p className={`font-medium text-slate-300 ${sizes.text}`}>
              {label}
            </p>
          )}
          {showPercentage && (
            <span className={`${colors.text} ${sizes.text} font-mono font-semibold`}>
              {clampedProgress.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`relative w-full bg-slate-700/50 ${sizes.height} ${sizes.radius} overflow-hidden shadow-inner`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-inherit"></div>
        
        {/* Progress fill */}
        <div
          className={`${sizes.height} ${sizes.radius} ${colors.bg} ${colors.glow} shadow-lg transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Animated shine effect */}
          {animated && clampedProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
          )}
          
          {/* Glow effect */}
          <div className={`absolute inset-0 ${colors.bg} opacity-50 blur-sm rounded-inherit`}></div>
          
          {/* Progress text inside bar for larger sizes */}
          {size === 'lg' && clampedProgress > 20 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {clampedProgress.toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Pulsing effect when complete */}
        {clampedProgress >= 100 && animated && (
          <div className={`absolute inset-0 ${colors.bg} opacity-30 animate-pulse ${sizes.radius}`}></div>
        )}
      </div>
      
      {/* Completion indicator */}
      {clampedProgress >= 100 && (
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center space-x-2 text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;