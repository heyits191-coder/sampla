import React from 'react';
import { Bot, Users, ArrowRight } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

export const Experience: React.FC = () => {
  return (
    <section id="modes" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Interview Modes" 
          subtitle="Select your evaluation environment."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: AI HR */}
          <div className="group relative bg-white border border-slate-200 hover:border-slate-900 p-8 h-80 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center">
                        <Bot size={24} />
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Strict Evaluation</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">AI HR Interview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    Full autonomous interview. The AI acts as a strict Hiring Manager, analyzing your resume and drilling down into your experience.
                </p>
            </div>
            <div className="flex items-center text-sm font-bold text-slate-900 group-hover:underline">
                Enter Mode <ArrowRight size={16} className="ml-2" />
            </div>
          </div>

          {/* Card 2: Peer */}
          <div className="group relative bg-white border border-slate-200 hover:border-slate-900 p-8 h-80 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-100 text-slate-900 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Human + AI Brain</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Friend + AI Evaluation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    A friend conducts the interview while ZELVORA silently listens, analyzes, and generates the final HR report.
                </p>
            </div>
            <div className="flex items-center text-sm font-bold text-slate-900 group-hover:underline">
                Enter Mode <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};