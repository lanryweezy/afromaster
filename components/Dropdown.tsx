import React from 'react';

interface DropdownProps<T extends string | number> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: T[];
  value: T;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  optionDisplayNames?: Record<T, string>; // Optional map for display names if different from values
}

const Dropdown = <T extends string | number,>({
  label,
  options,
  value,
  onChange,
  optionDisplayNames,
  className,
  ...props
}: DropdownProps<T>): React.ReactElement => {
  return (
    <div className={`w-full ${className || ''}`}>
      <label htmlFor={(props as { id?: string }).id || label} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <select
        id={(props as { id?: string }).id || label}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionDisplayNames ? optionDisplayNames[option] : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;