import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconCheckCircle } from '../constants';

const WorkflowProgress: React.FC = () => {
  const { currentPage } = useAppContext();

  const steps = [
    { label: 'Upload', pages: [AppPage.UPLOAD] },
    { label: 'Settings', pages: [AppPage.SETTINGS] },
    { label: 'Process', pages: [AppPage.PROCESSING] },
    { label: 'Review', pages: [AppPage.PREVIEW] },
    { label: 'Export', pages: [AppPage.DOWNLOAD] },
  ];

  // Only show for main mastering flow
  const visiblePages = [AppPage.UPLOAD, AppPage.SETTINGS, AppPage.PROCESSING, AppPage.PREVIEW, AppPage.DOWNLOAD];
  if (!visiblePages.includes(currentPage)) return null;

  const currentStepIndex = steps.findIndex(step => step.pages.includes(currentPage));

  return (
    <div className="hidden md:flex items-center justify-between mb-12 relative px-4">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-700" 
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step, i) => {
        const isCompleted = i < currentStepIndex;
        const isActive = i === currentStepIndex;

        return (
          <div key={step.label} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-primary border-primary text-white' : isActive ? 'bg-slate-900 border-primary text-primary shadow-lg shadow-primary/20' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
              {isCompleted ? <IconCheckCircle className="w-6 h-6" /> : <span className="text-sm font-bold">{i + 1}</span>}
            </div>
            <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-primary' : 'text-slate-600'}`}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowProgress;