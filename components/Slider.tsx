import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id?: string;
  unit?: string; // e.g., 'dB'
  color?: 'primary' | 'green' | 'blue' | 'purple';
}

const Slider: React.FC<SliderProps> = ({ label, min, max, step, value, onChange, name, id, unit, color = 'primary' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const colorClasses = {
    primary: {
      track: 'bg-gradient-to-r from-orange-500 to-red-600',
      thumb: 'border-orange-500 shadow-orange-500/50',
      value: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    },
    green: {
      track: 'bg-gradient-to-r from-green-500 to-emerald-600',
      thumb: 'border-green-500 shadow-green-500/50',
      value: 'text-green-400 bg-green-500/10 border-green-500/30'
    },
    blue: {
      track: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      thumb: 'border-blue-500 shadow-blue-500/50',
      value: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    purple: {
      track: 'bg-gradient-to-r from-purple-500 to-violet-600',
      thumb: 'border-purple-500 shadow-purple-500/50',
      value: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="w-full group">
      <label htmlFor={id || name} className="flex justify-between items-center text-sm font-medium text-slate-300 mb-3">
        <span className="font-semibold">{label}</span>
        <span className={`font-mono px-3 py-1 rounded-lg border transition-all duration-300 ${colors.value}`}>
          {value.toFixed(unit === 'dB' ? 1 : 0)}{unit}
        </span>
      </label>
      <div className="relative flex items-center">
        <div className="relative w-full h-3 rounded-full bg-slate-700/50 shadow-inner">
            {/* Progress track */}
            <div 
              className={`absolute h-3 rounded-full transition-all duration-300 ease-out ${colors.track} shadow-lg`}
              style={{ width: `${percentage}%` }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-full ${colors.track} opacity-50 blur-sm`}></div>
            </div>
            
            {/* Input slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onChange}
              name={name}
              id={id || name}
              className={`w-full h-3 bg-transparent appearance-none cursor-pointer absolute top-0 left-0 z-10
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:border-3
                          [&::-webkit-slider-thumb]:${colors.thumb.split(' ')[0]}
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:${colors.thumb.split(' ')[1]}
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-200
                          [&::-webkit-slider-thumb]:ease-out
                          [&::-webkit-slider-thumb]:hover:scale-125
                          [&::-webkit-slider-thumb]:hover:shadow-xl
                          [&::-webkit-slider-thumb]:active:scale-110
                          [&::-webkit-slider-thumb]:cursor-grab
                          [&::-webkit-slider-thumb]:active:cursor-grabbing
                          
                          [&::-moz-range-thumb]:appearance-none
                          [&::-moz-range-thumb]:w-6
                          [&::-moz-range-thumb]:h-6
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-white
                          [&::-moz-range-thumb]:border-3
                          [&::-moz-range-thumb]:${colors.thumb.split(' ')[0]}
                          [&::-moz-range-thumb]:shadow-lg
                          [&::-moz-range-thumb]:transition-all
                          [&::-moz-range-thumb]:duration-200
                          [&::-moz-range-thumb]:ease-out
                          [&::-moz-range-thumb]:hover:scale-125
                          [&::-moz-range-thumb]:active:scale-110
                          [&::-moz-range-thumb]:cursor-grab
                          [&::-moz-range-thumb]:active:cursor-grabbing
                          
                          focus:outline-none
                          focus:ring-4
                          focus:ring-orange-500/20
              `}
            />
        </div>
        
        {/* Value markers */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-slate-500">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
