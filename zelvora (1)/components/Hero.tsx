import React from 'react';
import { ArrowRight, AlertCircle, PlayCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onStartClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-200 border border-slate-300 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-slate-900 mr-2"></span>
              Strict Evaluation Protocol
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              This is not <br />
              interview practice. <br />
              <span className="text-slate-500">This is interview evaluation.</span>
            </h1>
            
            <p className="text-lg text-slate-700 mb-8 leading-relaxed max-w-lg">
              ZELVORA simulates the actual hiring decision. Expect strict judgment, interruptions, and early termination if you do not meet the standard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="group" onClick={onStartClick}>
                Start Interview
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                className="group text-slate-600 border-slate-300 hover:bg-slate-100 flex items-center gap-2"
                onClick={scrollToDemo}
              >
                <PlayCircle size={16} />
                Watch 30-sec demo
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-x-4">
              <div className="h-px w-12 bg-slate-300"></div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                We evaluate capability, not effort.
              </span>
            </div>
          </div>

          <div className="relative lg:h-full flex items-center justify-center">
            {/* Minimalist Abstract Representation of Interview */}
            <div className="relative w-full max-w-lg aspect-square bg-white rounded-none shadow-2xl border border-slate-200 p-8 flex flex-col justify-between overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-100 opacity-50 blur-3xl"></div>

               <div className="relative z-10 space-y-6">
                 {/* Interviewer Bubble */}
                 <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">HR</div>
                   <div className="space-y-2 max-w-[80%]">
                      <div className="p-3 bg-slate-100 text-sm text-slate-800 font-medium border-l-2 border-slate-800">
                        "That answer is generic. I need you to explain the specific trade-offs you made in that architecture."
                      </div>
                   </div>
                 </div>

                 {/* Candidate Bubble (Active) */}
                 <div className="flex flex-row-reverse gap-4">
                   <div className="w-10 h-10 bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-900 text-xs font-bold">YOU</div>
                   <div className="space-y-2 max-w-[80%]">
                      <div className="h-16 bg-white border border-slate-200 p-3 flex items-center justify-center">
                        <div className="flex space-x-1 items-center">
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                   </div>
                 </div>
                 
                 {/* Analysis Block */}
                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Judgment</span>
                      <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> SCRUTINY ACTIVE
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 mb-2">
                      <div className="bg-slate-900 h-1 w-[60%]"></div>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Detecting: Scripted Response (Match: 85%)
                    </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};