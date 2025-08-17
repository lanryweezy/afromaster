import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Theme } from '../types';

const themes: { name: Theme; gradient: string }[] = [
  { name: 'solar-flare', gradient: 'from-red-500 to-orange-500' },
  { name: 'nebula', gradient: 'from-indigo-500 to-sky-500' },
  { name: 'starlight', gradient: 'from-cyan-400 to-sky-200' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentTheme = themes.find(t => t.name === theme);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary transition-all flex items-center justify-center bg-slate-800"
        aria-label="Change theme"
      >
        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentTheme?.gradient}`}></div>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-lg shadow-2xl z-50 animate-fadeIn p-2">
          <p className="text-xs text-white px-2 py-1 font-semibold">CHOOSE THEME</p>
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => handleThemeChange(t.name)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-3 transition-colors ${
                theme === t.name ? 'bg-primary/30 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.gradient}`}></div>
              <span className="capitalize">{t.name.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
