import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string; // e.g., 'max-w-md', 'max-w-2xl'
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  maxWidth = 'max-w-2xl', // Default to the larger size
}) => {
  return (
    <div className={`${maxWidth} mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
