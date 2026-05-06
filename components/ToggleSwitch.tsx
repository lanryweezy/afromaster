
import React from 'react';

const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void; enabledLabel: string; disabledLabel: string; }> = ({ isEnabled, onToggle, enabledLabel, disabledLabel }) => (
    <div onClick={onToggle} className="relative cursor-pointer flex items-center p-1 bg-slate-900 rounded-full w-full max-w-[260px] sm:w-60 justify-center">
        <div className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-300 ease-in-out`}
            style={{ transform: isEnabled ? 'translateX(100%)' : 'translateX(0%)' }}
        ></div>
        <span className={`relative px-4 py-1.5 text-sm rounded-full transition-colors w-1/2 text-center ${!isEnabled ? 'text-white' : 'text-slate-400'}`}>{disabledLabel}</span>
        <span className={`relative px-4 py-1.5 text-sm rounded-full transition-colors w-1/2 text-center ${isEnabled ? 'text-white' : 'text-slate-400'}`}>{enabledLabel}</span>
    </div>
);

export default ToggleSwitch;
