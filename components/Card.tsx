import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string; // e.g., 'max-w-md', 'max-w-2xl'
  shadow?: string; // e.g., 'shadow-xl', 'shadow-2xl'
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  maxWidth = 'max-w-2xl', // Default to the larger size
  shadow = 'shadow-2xl', // Default to the larger shadow
}) => {
  return (
    <div className={`${maxWidth} mx-auto p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl ${shadow} card-accent ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
