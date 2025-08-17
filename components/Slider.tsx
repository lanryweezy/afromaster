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
}

const Slider: React.FC<SliderProps> = ({ label, min, max, step, value, onChange, name, id, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <label htmlFor={id || name} className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
        <span>{label}</span>
        <span className="text-primary font-mono bg-slate-800 px-2 py-0.5 rounded">
          {value.toFixed(unit === 'dB' ? 1 : 0)}{unit}
        </span>
      </label>
      <div className="relative flex items-center">
        <div className="relative w-full h-2 rounded-full bg-slate-700">
            <div 
            className="absolute h-2 rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
            ></div>
            <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            name={name}
            id={id || name}
            className="w-full h-2 bg-transparent appearance-none cursor-pointer absolute top-0 left-0
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-4
                        [&::-webkit-slider-thumb]:border-primary
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:ease-in-out
                        [&::-webkit-slider-thumb]:focus:scale-150
                        
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-4
                        [&::-moz-range-thumb]:border-primary
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:transition-transform
                        [&::-moz-range-thumb]:duration-150
                        [&::-moz-range-thumb]:ease-in-out
                        [&::-moz-range-thumb]:focus:scale-150
            "
            />
        </div>
      </div>
    </div>
  );
};

export default Slider;
