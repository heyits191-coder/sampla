
import React, { useEffect, useState, useRef } from 'react';
import ScrollIndicator from './ScrollIndicator';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // We still use a small delay just to ensure the video source is ready, 
    // but we remove the 'movement' and 'blur' animations.
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full flex flex-col items-center justify-center relative z-10 px-6">
      {/* Fixed 16:9 Frame Container */}
      <div className="w-full max-w-[1100px]">
        <div 
          className={`relative w-full transition-opacity duration-1000 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ aspectRatio: '16 / 9' }}
        >
          {/* Subtle Outer Glow (No movement) */}
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(147,112,219,0.08)_0%,transparent_70%)] -z-10 opacity-50"></div>

          {/* Master Frame Construction */}
          <div className="relative w-full h-full p-[1px] bg-gradient-to-b from-white via-white/40 to-white/5 rounded-[20px] md:rounded-[32px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden group">
            
            {/* Internal Mask */}
            <div className="relative w-full h-full rounded-[19px] md:rounded-[31px] overflow-hidden bg-[#F2F2F2]">
              
              {/* BRAND SPARK LOGO OVERLAY - Integrated into the Video Frame */}
              <div className="absolute top-8 left-10 z-20 flex items-center space-x-3 pointer-events-none">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  <div className="absolute inset-0 rounded-full bg-white/40 animate-ping"></div>
                </div>
                <span className="text-[16px] font-bold tracking-tight text-white drop-shadow-md">Brand Spark</span>
              </div>

              {/* High-Performance Cinematic Video */}
              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source 
                  src="/videos/Ultrarealistic_cinematic_hero_1080p_20260110.mp4" 
                  type="video/mp4" 
                />
              </video>
              
              {/* Professional Overlay System (Fixed) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-40 mix-blend-overlay"></div>
              
              {/* UI Accents */}
              <div className="absolute top-8 right-10 flex flex-col items-end opacity-40">
                <span className="text-[8px] font-bold tracking-[0.5em] text-white uppercase mb-2">Agency Protocol</span>
                <div className="w-4 h-[1px] bg-white/60"></div>
              </div>

              <div className="absolute bottom-8 left-10 flex items-center space-x-4 opacity-30 group-hover:opacity-60 transition-all duration-700">
                <span className="text-[9px] uppercase tracking-[0.6em] text-white font-bold">2025 // Edition</span>
              </div>

              <div className="absolute bottom-8 right-10 flex items-center space-x-4 opacity-40">
                <div className="w-2 h-2 rounded-full border border-white/50"></div>
                <span className="text-[9px] uppercase tracking-[0.5em] text-white font-bold">Live System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Meta Narrative - Positioned Static Below */}
        <div className={`mt-14 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-6">
            <MetadataItem label="Clarity" />
            <MetadataItem label="Intelligence" />
            <MetadataItem label="Scale" />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

const MetadataItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="group cursor-default flex items-center space-x-3">
    <div className="w-1.5 h-1.5 rounded-full bg-[#9370DB]/20 group-hover:bg-[#9370DB] transition-all duration-500"></div>
    <span className="text-[11px] font-bold tracking-[0.7em] uppercase text-[#1D1D1F]/20 group-hover:text-[#1D1D1F] transition-all duration-700 relative">
      {label}
    </span>
  </div>
);

export default HeroSection;
