import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconUpload, IconCog, IconPlay, IconDownload, IconCheck, IconSparkles } from '../constants';

const WorkflowProgress: React.FC = () => {
  const { currentPage } = useAppContext();

  const steps = [
    { page: AppPage.UPLOAD, label: 'Upload', icon: IconUpload, description: 'Share your creation' },
    { page: AppPage.SETTINGS, label: 'Settings', icon: IconCog, description: 'Define your sound' },
    { page: AppPage.PROCESSING, label: 'Processing', icon: IconSparkles, description: 'AI magic happening' },
    { page: AppPage.PREVIEW, label: 'Preview', icon: IconPlay, description: 'Feel the difference' },
    { page: AppPage.DOWNLOAD, label: 'Download', icon: IconDownload, description: 'Get your master' }
  ];

  const getCurrentStepIndex = () => {
    const stepIndex = steps.findIndex(step => step.page === currentPage);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  // Only show on workflow pages
  if (![AppPage.UPLOAD, AppPage.SETTINGS, AppPage.PROCESSING, AppPage.PREVIEW, AppPage.DOWNLOAD].includes(currentPage)) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-12">
      {/* Mobile: Vertical layout */}
      <div className="block sm:hidden">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col space-y-4">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={index} className="flex items-center space-x-4 group">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 mt-8 w-0.5 h-8 bg-gradient-to-b from-slate-600 to-slate-700"></div>
                  )}
                  
                  {/* Step indicator */}
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                        : isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white ring-4 ring-orange-500/30 shadow-lg shadow-orange-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border-2 border-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <IconCheck className="w-6 h-6" />
                    ) : (
                      <step.icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                    )}
                    
                    {/* Glow effect for active step */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 opacity-50 blur-lg animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-base font-semibold transition-colors ${
                        isActive ? 'text-orange-400' : isCompleted ? 'text-green-400' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className={`text-sm mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.description}
                    </div>
                    {isActive && (
                      <div className="text-xs text-orange-500 mt-2 font-medium animate-pulse">
                        ● Active
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:block">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={index} className="flex items-center group">
                  <div className="flex flex-col items-center">
                    {/* Step indicator */}
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-110'
                          : isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white ring-4 ring-orange-500/30 shadow-lg shadow-orange-500/30 scale-110'
                          : 'bg-slate-800 text-slate-500 border-2 border-slate-600 hover:border-slate-500 hover:scale-105'
                      }`}
                    >
                      {isCompleted ? (
                        <IconCheck className="w-8 h-8" />
                      ) : (
                        <step.icon className={`w-8 h-8 ${isActive ? 'animate-bounce' : ''}`} />
                      )}
                      
                      {/* Glow effect for active step */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 opacity-50 blur-lg animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Step label and description */}
                    <div className="mt-3 text-center">
                      <div
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? 'text-orange-400' : isCompleted ? 'text-green-400' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="flex flex-col items-center mx-4">
                      <div
                        className={`w-20 h-1 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' : 'bg-slate-700'
                        }`}
                      >
                        {/* Animated progress line for active step */}
                        {index === currentStepIndex - 1 && (
                          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse shadow-lg shadow-orange-500/30"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Progress stats */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            <span className="text-slate-400">Completed: {currentStepIndex}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse"></div>
            <span className="text-slate-400">Current: {steps[currentStepIndex]?.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <span className="text-slate-400">Remaining: {steps.length - currentStepIndex - 1}</span>
          </div>
        </div>
        
        {/* Overall progress bar */}
        <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 mt-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-slate-500">
          {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
