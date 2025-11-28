import React from 'react';

interface DropdownProps<T extends string | number> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string;
  options: T[];
  value: T;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  optionDisplayNames?: Record<T, string>;
}

const Dropdown = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  optionDisplayNames,
  className = '',
  ...props
}: DropdownProps<T>): React.ReactElement => {
  return (
    <div className={`w-full group ${className}`}>
      <label htmlFor={props.id || label} className="block text-sm font-medium text-slate-400 mb-2 group-hover:text-primary transition-colors duration-200">
        {label}
      </label>
      <div className="relative">
        <select
          id={props.id || label}
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-slate-900/50 backdrop-blur-sm border border-slate-700 text-slate-100 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer hover:bg-slate-800 hover:border-slate-600"
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-900 text-slate-200 py-2">
              {optionDisplayNames ? optionDisplayNames[option] : option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;