import React from 'react';
import { Target, ShieldCheck, Zap, AlertTriangle, FileText, Ban, BrainCircuit, Gavel } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

export const Why: React.FC = () => {
  return (
    <section id="why" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 5: DIFFERENTIATORS */}
        <div className="mb-24">
            <SectionHeading title="Why Zelvora is Different" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
                
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-900">
                        <FileText size={28} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Resume-Aware</h3>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-900">
                        <Ban size={28} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Early Termination</h3>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-900">
                        <BrainCircuit size={28} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Anti-Ratta Logic</h3>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-900">
                        <Gavel size={28} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">HR-Style Verdicts</h3>
                </div>

            </div>
        </div>

        {/* SECTION 6: WHO THIS IS FOR */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white p-12">
             <h3 className="text-xl font-bold mb-8 text-center">Who This Is For</h3>
             <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="border-l-2 border-slate-700 pl-4">
                    <h4 className="font-bold text-white mb-1">Final Year Students</h4>
                    <p className="text-xs text-slate-400">Who need a reality check before placements.</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4">
                    <h4 className="font-bold text-white mb-1">Job Switchers</h4>
                    <p className="text-xs text-slate-400">Who want to test their readiness for top roles.</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4">
                    <h4 className="font-bold text-white mb-1">Career Changers</h4>
                    <p className="text-xs text-slate-400">Who need objective feedback on new skills.</p>
                </div>
             </div>
             
             <div className="flex items-center justify-center gap-2 text-xs text-slate-500 uppercase tracking-widest text-center border-t border-slate-800 pt-6">
                <AlertTriangle size={12} />
                If you are looking for encouragement, this is not for you.
             </div>
        </div>

      </div>
    </section>
  );
};