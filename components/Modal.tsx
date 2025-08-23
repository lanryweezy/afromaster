import React, { ReactNode, useEffect } from 'react';
import { IconXCircle } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className={`relative bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 w-full ${sizeClasses[size]} text-white transform transition-all animate-scale-in overflow-hidden`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 rounded-2xl pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 id="modal-title" className="text-2xl font-heading font-bold text-gradient-primary">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 p-2 rounded-lg hover:scale-110 group"
            aria-label="Close modal"
          >
            <IconXCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          {children}
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 rounded-2xl blur-sm pointer-events-none opacity-50"></div>
      </div>
    </div>
  );
};

export default Modal;
