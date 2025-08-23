import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div 
      className={`bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transition-all duration-300 ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;