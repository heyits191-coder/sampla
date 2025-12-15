import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">The Reality</h2>
        <p className="text-2xl sm:text-3xl font-medium text-slate-900 leading-relaxed">
          "ZELVORA is an <span className="text-slate-900 font-bold border-b-2 border-slate-900">evaluation engine</span>. We simulate the pressure of the hiring decision. If you are not ready, the system will reject you."
        </p>
      </div>
    </section>
  );
};