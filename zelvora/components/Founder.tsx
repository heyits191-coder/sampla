import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';

export const Founder: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    // setTimeout to ensure the DOM has updated if switching from image to video
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, 100);
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2">
            
            {/* Media Area */}
            <div className="relative h-80 md:h-auto bg-slate-200 cursor-pointer group" onClick={!isPlaying ? handlePlay : undefined}>
              {!isPlaying ? (
                <>
                  <img 
                    src="https://picsum.photos/600/800?grayscale" 
                    alt="Priya Sharma" 
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-medium text-slate-900">
                    Watch Message
                  </div>
                </>
              ) : (
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Founder</h3>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Priya Sharma</h2>
              <p className="text-slate-600 font-medium mb-6">Founder – ZELVORA | NIT Jamshedpur</p>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  "I realized that students and professionals prepare for the *questions* but fail the *environment*."
                </p>
                <p>
                  At Zelvora, we are building the bridge between knowledge and delivery. My goal is to ensure no candidate fails simply because they were nervous.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                    <div className="text-xs text-slate-500">
                        Content Creator & Career Strategist
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};