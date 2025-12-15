import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, align = 'center' }) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`mb-12 ${alignClass} max-w-3xl mx-auto`}>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};