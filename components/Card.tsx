import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string; // e.g., 'max-w-md', 'max-w-2xl'
  shadow?: string; // e.g., 'shadow-xl', 'shadow-2xl'
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  maxWidth = 'max-w-2xl', // Default to the larger size
  shadow = 'shadow-2xl', // Default to the larger shadow
  style,
}) => {
  return (
    <div 
      className={`${maxWidth} mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${shadow} hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden ${className || ''}`}
      style={style}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
