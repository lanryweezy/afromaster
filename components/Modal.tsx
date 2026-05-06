import React, { ReactNode, useEffect } from 'react';
import { IconXCircle } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md p-6 text-white transform transition-all animate-slideInUp"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-heading font-semibold text-primary-focus">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Close modal"
          >
            <IconXCircle className="w-7 h-7" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
