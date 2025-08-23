
import React from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: () => void;
  enabledLabel: string;
  disabledLabel: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isEnabled, 
  onToggle, 
  enabledLabel, 
  disabledLabel,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'max-w-[200px] h-8',
      text: 'text-xs px-3 py-1',
      padding: 'p-0.5'
    },
    md: {
      container: 'max-w-[260px] h-10',
      text: 'text-sm px-4 py-2',
      padding: 'p-1'
    },
    lg: {
      container: 'max-w-[300px] h-12',
      text: 'text-base px-5 py-2.5',
      padding: 'p-1.5'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div 
      onClick={disabled ? undefined : onToggle} 
      className={`relative cursor-pointer flex items-center bg-slate-800/50 backdrop-blur-sm rounded-2xl w-full ${sizes.container} ${sizes.padding} justify-center border border-slate-700/50 hover:border-slate-600 transition-all duration-300 shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'} group`}
      role="switch"
      aria-checked={isEnabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Sliding background */}
      <div 
        className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500 ease-out shadow-lg ${isEnabled ? 'shadow-orange-500/50' : 'shadow-orange-500/30'} ${disabled ? 'opacity-50' : ''}`}
        style={{ 
          transform: isEnabled ? 'translateX(calc(100% + 4px))' : 'translateX(0%)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl opacity-50 blur-sm"></div>
      </div>
      
      {/* Labels */}
      <span 
        className={`relative ${sizes.text} rounded-xl transition-all duration-300 w-1/2 text-center font-medium z-10 ${
          !isEnabled 
            ? 'text-white drop-shadow-sm' 
            : 'text-slate-400 group-hover:text-slate-300'
        }`}
      >
        {disabledLabel}
      </span>
      <span 
        className={`relative ${sizes.text} rounded-xl transition-all duration-300 w-1/2 text-center font-medium z-10 ${
          isEnabled 
            ? 'text-white drop-shadow-sm' 
            : 'text-slate-400 group-hover:text-slate-300'
        }`}
      >
        {enabledLabel}
      </span>
      
      {/* Focus ring */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500/20 ring-offset-2 ring-offset-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
};

export default ToggleSwitch;
