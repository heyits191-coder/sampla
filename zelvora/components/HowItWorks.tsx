import React from 'react';
import { AlertCircle, Play, Pause, XCircle } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Practice vs Real Interview"
          subtitle="Understand the difference before you start."
        />

        {/* SECTION 1: VISUAL COMPARISON */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
            
            {/* Left: Practice */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale-[0.3] hover:grayscale-0">
                <div className="text-center mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Standard Practice Platform</h3>
                    <div className="text-sm font-medium text-slate-600">Friendly Environment</div>
                </div>
                
                {/* Visual UI Simulation */}
                <div className="space-y-6 font-mono text-xs select-none pointer-events-none">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">😊</div>
                        <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none w-3/4 text-slate-600">
                            Tell me about a challenge you faced recently?
                        </div>
                    </div>
                    
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">You</div>
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tr-none w-full text-slate-500">
                            <div className="h-2 w-[90%] bg-slate-300 rounded mb-2"></div>
                            <div className="h-2 w-[80%] bg-slate-300 rounded mb-2"></div>
                            <div className="h-2 w-[95%] bg-slate-300 rounded mb-2"></div>
                            <div className="h-2 w-[85%] bg-slate-300 rounded"></div>
                            <span className="text-[10px] text-slate-400 mt-2 block italic">(Speaking uninterrupted for 5 mins...)</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">😊</div>
                        <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none w-3/4 text-slate-600">
                             That was great! Here is a small tip...
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Outcome: False Confidence
                    </span>
                </div>
            </div>

            {/* Right: ZELVORA */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    Zelvora Mode
                </div>
                
                <div className="text-center mb-8">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Real Interview Simulation</h3>
                    <div className="text-sm font-medium text-slate-900 flex items-center justify-center gap-2">
                         <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Strict AI HR
                    </div>
                </div>

                {/* Visual UI Simulation */}
                <div className="space-y-6 font-mono text-xs select-none">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">HR</div>
                        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none w-3/4 text-slate-900 border-l-2 border-slate-900 shadow-sm relative group cursor-help">
                            Your resume claims you optimized the API latency by 40%. <strong>How exactly did you measure that?</strong>
                            {/* Micro Cue */}
                            <span className="absolute -top-6 left-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Resume-Aware Questioning
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900">You</div>
                        <div className="relative w-full">
                            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tr-none w-3/4 ml-auto text-slate-400 relative overflow-hidden">
                                Well, we just kinda noticed it felt faster...
                                {/* Interruption Overlay */}
                                <div className="absolute inset-0 bg-red-50/95 flex items-center justify-center gap-2 text-red-700 font-bold border border-red-100 animate-pulse">
                                    <XCircle size={14} /> INTERRUPTION
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">HR</div>
                        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none w-full text-slate-900 border-l-2 border-slate-900 shadow-sm">
                             I need data, not feelings. If you cannot explain the metrics, we cannot proceed.
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Interview Status</span>
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                        TERMINATED EARLY
                    </span>
                </div>
            </div>
        </div>

        {/* SECTION 2: DEMO VIDEO */}
        <div id="demo" className="max-w-4xl mx-auto scroll-mt-24">
             <div className="text-center mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Platform Demo</h3>
                <h2 className="text-2xl font-bold text-slate-900">We provide decisions, not coaching.</h2>
             </div>
             
             <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-2xl group border-4 border-slate-900">
                <video 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    controls
                    playsInline
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                >
                    {/* Placeholder video that represents a tech/interview context */}
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Video Visual Overlays (Simulating what's happening inside) */}
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 pointer-events-none">
                     <div className="flex items-center gap-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Resume Upload
                     </div>
                     <div className="flex items-center gap-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Interruption Event
                     </div>
                     <div className="flex items-center gap-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Final Verdict
                     </div>
                </div>
             </div>
             
             <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                    * The video demonstrates the strict "AI HR" mode.
                </p>
             </div>
        </div>

      </div>
    </section>
  );
};