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
    <div className={`${maxWidth} mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${shadow} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
