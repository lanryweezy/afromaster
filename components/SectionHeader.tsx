import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, className = '' }) => {
  return (
    <div className={`section-header ${className}`}>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">{title}</h2>
      <p className="text-lg text-slate-300 max-w-3xl mx-auto">{description}</p>
    </div>
  );
};

export default SectionHeader;