import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconUpload, IconCog, IconPlay, IconDownload, IconCheck } from '../constants';

const WorkflowProgress: React.FC = () => {
  const { currentPage } = useAppContext();

  const steps = [
    { page: AppPage.UPLOAD, label: 'Upload', icon: IconUpload },
    { page: AppPage.SETTINGS, label: 'Settings', icon: IconCog },
    { page: AppPage.PROCESSING, label: 'Processing', icon: IconCog },
    { page: AppPage.PREVIEW, label: 'Preview', icon: IconPlay },
    { page: AppPage.DOWNLOAD, label: 'Download', icon: IconDownload }
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
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Vertical layout */}
      <div className="block sm:hidden">
        <div className="flex flex-col space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-primary text-white ring-2 ring-primary/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <IconCheck className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <div className="text-xs text-slate-400 mt-1">Current step</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary text-white ring-4 ring-primary/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <IconCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <div className="text-sm text-slate-400">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
