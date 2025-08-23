import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { IconCheckCircle, IconXCircle, IconInfo, IconExclamationTriangle } from '../constants';

interface StatusMessageProps {
  type: 'info' | 'error' | 'success' | 'loading' | 'warning';
  message: string;
  className?: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  type, 
  message, 
  className, 
  title, 
  dismissible = false, 
  onDismiss 
}) => {
  const configs = {
    info: {
      bgColor: 'bg-blue-900/20 border-blue-500/30',
      textColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      icon: <IconInfo className="w-5 h-5 text-blue-400" />,
      glowColor: 'shadow-blue-500/20'
    },
    error: {
      bgColor: 'bg-red-900/20 border-red-500/30',
      textColor: 'text-red-400',
      titleColor: 'text-red-300',
      icon: <IconXCircle className="w-5 h-5 text-red-400" />,
      glowColor: 'shadow-red-500/20'
    },
    success: {
      bgColor: 'bg-green-900/20 border-green-500/30',
      textColor: 'text-green-400',
      titleColor: 'text-green-300',
      icon: <IconCheckCircle className="w-5 h-5 text-green-400" />,
      glowColor: 'shadow-green-500/20'
    },
    warning: {
      bgColor: 'bg-yellow-900/20 border-yellow-500/30',
      textColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
      icon: <IconExclamationTriangle className="w-5 h-5 text-yellow-400" />,
      glowColor: 'shadow-yellow-500/20'
    },
    loading: {
      bgColor: 'bg-slate-800/30 border-slate-600/30',
      textColor: 'text-slate-300',
      titleColor: 'text-slate-200',
      icon: <LoadingSpinner size="sm" className="!w-5 !h-5" />,
      glowColor: 'shadow-slate-500/20'
    }
  };

  const config = configs[type];

  return (
    <div className={`relative backdrop-blur-xl border rounded-2xl p-5 animate-scale-in group hover:scale-[1.02] transition-all duration-300 ${config.bgColor} ${config.glowColor} shadow-lg hover:shadow-xl ${className || ''}`}>
      {/* Decorative gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-base font-semibold mb-1 ${config.titleColor}`}>
                {title || type.charAt(0).toUpperCase() + type.slice(1)}
              </h4>
              <p className={`text-sm leading-relaxed ${config.textColor}`}>
                {message}
              </p>
            </div>
          </div>
          
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-200 transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
              aria-label="Dismiss"
            >
              <IconXCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusMessage;
