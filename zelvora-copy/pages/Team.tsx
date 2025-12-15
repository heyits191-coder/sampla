import React, { useState } from 'react';
import { Play, Linkedin, Twitter } from 'lucide-react';

const Team: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-950 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Minds Behind Zelvora</h2>
          <p className="text-slate-400">Built by engineers and HR veterans who hated the broken interview process.</p>
        </div>

        <div className="flex justify-center">
            {/* Interactive Founder Card */}
            <div 
                className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 transition-all duration-700 ease-in-out cursor-pointer group ${expanded ? 'w-full max-w-4xl' : 'w-full max-w-sm hover:border-emerald-500/50'}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className={`flex flex-col ${expanded ? 'md:flex-row' : ''}`}>
                    
                    {/* Visual / Video Area */}
                    <div className={`${expanded ? 'md:w-2/3 h-96' : 'h-80'} relative bg-slate-800`}>
                        <img 
                            src="https://picsum.photos/800/800" 
                            alt="Priya Sharma" 
                            className={`w-full h-full object-cover transition-opacity duration-500 ${expanded ? 'opacity-0 absolute' : 'opacity-100'}`}
                        />
                        {expanded ? (
                             <div className="absolute inset-0 bg-black flex items-center justify-center">
                                 {/* Mock Video Player */}
                                 <div className="text-center">
                                     <Play className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                                     <p className="text-slate-500 text-sm">Playing Founder Vision...</p>
                                     <p className="text-slate-700 text-xs mt-2">(Video simulation)</p>
                                 </div>
                             </div>
                        ) : (
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                                    <Play className="h-8 w-8 text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className={`p-8 flex flex-col justify-center ${expanded ? 'md:w-1/3 border-t md:border-t-0 md:border-l border-slate-800' : ''}`}>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Priya Sharma</h3>
                            <p className="text-emerald-500 font-medium mb-4">Founder & CEO</p>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                "I failed 12 interviews before landing my dream job. Not because I lacked skill, but because I lacked practice under pressure. Zelvora fixes that."
                            </p>
                            
                            <div className="flex space-x-4 mb-6">
                                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            </div>

                            <div className="space-y-2 text-xs text-slate-500 font-mono">
                                <p>• Ex-Google</p>
                                <p>• NIT Jamshedpur Alum</p>
                                <p>• 50k+ YouTube Subscribers</p>
                            </div>
                        </div>
                        
                        {!expanded && (
                             <p className="mt-8 text-xs text-center text-emerald-600 font-semibold uppercase tracking-wider animate-pulse">Click to Watch Story</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-16 text-center">
             <p className="text-slate-500 text-sm">Advisors from:</p>
             <div className="flex justify-center gap-8 mt-4 grayscale opacity-40">
                {/* Text based logos for simplicity */}
                <span className="font-bold text-xl text-white">Microsoft</span>
                <span className="font-bold text-xl text-white">Uber</span>
                <span className="font-bold text-xl text-white">Amazon</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Team;
