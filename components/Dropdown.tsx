import React from 'react';

interface DropdownProps<T extends string | number> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: T[];
  value: T;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  optionDisplayNames?: Record<T, string>; // Optional map for display names if different from values
  error?: string;
  helpText?: string;
}

const Dropdown = <T extends string | number,>({
  label,
  options,
  value,
  onChange,
  optionDisplayNames,
  className = '',
  error,
  helpText,
  ...props
}: DropdownProps<T>): React.ReactElement => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={props.id || label} className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={props.id || label}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-gradient-to-br from-slate-800 to-slate-900 border-2 text-slate-100 rounded-xl px-4 py-3 pr-10 shadow-lg focus:shadow-xl transition-all duration-300 cursor-pointer
            ${error 
              ? 'border-red-500/50 focus:border-red-400 focus:ring-4 focus:ring-red-500/20' 
              : 'border-slate-700/50 hover:border-slate-600 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
            } focus:outline-none`}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-800 text-slate-100 py-2">
              {optionDisplayNames ? optionDisplayNames[option] : option}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
      
      {helpText && !error && (
        <p className="mt-2 text-xs text-slate-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-400 font-medium animate-shake">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;