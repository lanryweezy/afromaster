
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {label && <p className="text-sm text-white mb-1 text-center">{label}</p>}
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="bg-primary h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
          style={{ width: `${clampedProgress}%` }}
        >
          {clampedProgress > 10 && (
             <span className="text-xs font-medium text-white">{`${clampedProgress.toFixed(0)}%`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;