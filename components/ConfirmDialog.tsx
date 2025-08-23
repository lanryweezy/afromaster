import React, { useEffect } from 'react';
import Button from './Button';
import { IconXCircle, IconSparkles, IconCheckCircle, IconExclamationTriangle } from '../constants';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  loading = false
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  const configs = {
    success: {
      icon: <IconCheckCircle className="w-12 h-12 text-green-400" />,
      bgColor: 'bg-green-900/20 border-green-500/30',
      glowColor: 'shadow-green-500/20',
      confirmColor: 'green'
    },
    warning: {
      icon: <IconExclamationTriangle className="w-12 h-12 text-yellow-400" />,
      bgColor: 'bg-yellow-900/20 border-yellow-500/30',
      glowColor: 'shadow-yellow-500/20',
      confirmColor: 'primary'
    },
    danger: {
      icon: <IconXCircle className="w-12 h-12 text-red-400" />,
      bgColor: 'bg-red-900/20 border-red-500/30',
      glowColor: 'shadow-red-500/20',
      confirmColor: 'danger'
    },
    info: {
      icon: <IconSparkles className="w-12 h-12 text-blue-400" />,
      bgColor: 'bg-blue-900/20 border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
      confirmColor: 'primary'
    }
  };

  const config = configs[type];

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div 
        className={`relative bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md text-white transform transition-all animate-scale-in overflow-hidden ${config.bgColor} ${config.glowColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 rounded-2xl pointer-events-none opacity-50"></div>
        
        {/* Header with icon */}
        <div className="relative z-10 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-bounce-in">
              {config.icon}
            </div>
          </div>
          
          <h2 className="text-2xl font-heading font-bold text-white mb-3">
            {title}
          </h2>
          
          <p className="text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            onClick={onConfirm}
            variant={config.confirmColor as any}
            className="flex-1"
            isLoading={loading}
          >
            {confirmText}
          </Button>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 rounded-2xl blur-sm pointer-events-none opacity-50"></div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
