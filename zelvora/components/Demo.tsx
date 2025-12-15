import React from 'react';
import { Play } from 'lucide-react';

export const Demo: React.FC = () => {
  return (
    <section id="demo" className="py-24 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-2xl font-bold tracking-tight text-white mb-12">
           This is not practice. This is decision-making.
        </h2>

        <div className="relative aspect-video bg-black rounded-sm overflow-hidden border border-slate-700 shadow-2xl group cursor-pointer">
            <video 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
            >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-left">
                <div className="flex gap-4 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                    <span>• Resume Analysis</span>
                    <span>• Interruption Events</span>
                    <span>• Final Verdict</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};