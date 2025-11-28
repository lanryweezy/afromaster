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
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ label, min, max, step, value, onChange, name, id, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full group">
      <label htmlFor={id || name} className="flex justify-between items-center text-sm font-medium text-slate-400 mb-3 group-hover:text-primary transition-colors">
        <span>{label}</span>
        <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded-md min-w-[3rem] text-center border border-slate-700">
          {value.toFixed(unit === 'dB' ? 1 : 0)}{unit}
        </span>
      </label>
      <div className="relative flex items-center h-6">
        {/* Track */}
        <div className="absolute w-full h-2 rounded-full bg-slate-800 border border-slate-700/50 overflow-hidden">
             {/* Fill */}
            <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out"
            style={{ width: `${percentage}%` }}
            ></div>
        </div>
        
        {/* Thumb (Input) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          name={name}
          id={id || name}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Visual Thumb (Follows percentage) */}
         <div 
            className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-primary pointer-events-none transition-all duration-100 ease-out transform -translate-x-1/2 group-hover:scale-110"
            style={{ left: `${percentage}%` }}
         ></div>
      </div>
    </div>
  );
};

export default Slider;