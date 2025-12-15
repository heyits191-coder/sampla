import React from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { XCircle } from 'lucide-react';

export const Comparison: React.FC = () => {
  return (
    <section id="comparison" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Practice vs Reality"
          subtitle="Understand the difference before you start."
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Left: Practice */}
            <div className="bg-slate-50 p-8 rounded-none border border-slate-200 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Standard Practice</h3>
                    <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded">Comfort Zone</div>
                </div>
                
                {/* Visual UI Simulation */}
                <div className="space-y-6 font-mono text-xs select-none pointer-events-none grayscale opacity-60">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">I</div>
                        <div className="bg-white border border-slate-200 p-3 w-3/4 text-slate-500">
                            Tell me about a challenge you faced?
                        </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">U</div>
                        <div className="bg-white border border-slate-200 p-3 w-full text-slate-400 italic">
                            (Speaking uninterrupted for 5 minutes...)
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">Result: False Confidence</p>
                </div>
            </div>

            {/* Right: ZELVORA */}
            <div className="bg-white p-8 rounded-none border-2 border-slate-900 shadow-xl relative">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Zelvora</h3>
                    <div className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded">Real Pressure</div>
                </div>

                {/* Visual UI Simulation */}
                <div className="space-y-6 font-mono text-xs select-none">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">HR</div>
                        <div className="bg-slate-50 p-3 w-3/4 text-slate-900 border-l-2 border-slate-900">
                           Your resume says "Expert in React". Explain reconciliation.
                        </div>
                    </div>

                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900">U</div>
                        <div className="relative w-full">
                            <div className="bg-white border border-slate-200 p-3 w-3/4 ml-auto text-slate-400 relative overflow-hidden">
                                Well, it's basically when...
                                {/* Interruption Overlay */}
                                <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center gap-2 text-red-600 font-bold border border-red-100">
                                    <XCircle size={14} /> STOP. BE SPECIFIC.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-sm text-slate-900 font-bold">Result: Real Assessment</p>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Early Termination Risk</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};