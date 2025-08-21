import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={`text-center mb-12 animate-on-scroll ${className || ''}`}>
      <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gradient-primary">{title}</h2>
      <p className="mt-3 text-slate-300 max-w-2xl mx-auto">{description}</p>
    </div>
  );
};

export default SectionHeader;
