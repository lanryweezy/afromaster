import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface StatusMessageProps {
  type: 'info' | 'error' | 'success' | 'loading';
  message: string;
  className?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, className }) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;

  switch (type) {
    case 'info':
      bgColor = 'bg-blue-900/20';
      textColor = 'text-blue-400';
      icon = <span className="text-blue-400 mr-2">ℹ️</span>; // Info icon
      break;
    case 'error':
      bgColor = 'bg-red-900/20';
      textColor = 'text-red-400';
      icon = <span className="text-red-400 mr-2">❌</span>; // Error icon
      break;
    case 'success':
      bgColor = 'bg-green-900/20';
      textColor = 'text-green-400';
      icon = <span className="text-green-400 mr-2">✅</span>; // Success icon
      break;
    case 'loading':
      bgColor = 'bg-slate-800/50';
      textColor = 'text-slate-300';
      icon = <LoadingSpinner size="sm" className="mr-2" />; // Loading spinner
      break;
    default:
      bgColor = 'bg-slate-800/50';
      textColor = 'text-slate-300';
      break;
  }

  return (
    <div className={`mt-6 p-4 backdrop-blur-md border rounded-lg text-left animate-fadeIn ${bgColor} ${className}`}>
      <div className="flex items-center mb-2">
        {icon}
        <h4 className={`text-md font-semibold ${textColor}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
      </div>
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
};

export default StatusMessage;
