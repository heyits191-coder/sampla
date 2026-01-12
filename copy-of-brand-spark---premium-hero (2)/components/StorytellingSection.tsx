
import React, { useEffect, useRef, useState } from 'react';

const StorytellingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height - windowHeight;
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: "Website Design",
      subtitle: "High-performance digital experiences built for authority, clarity, and conversion.",
      visual: <WebsiteVisual />
    },
    {
      title: "UGC Videos",
      subtitle: "Creator-driven content systems engineered to fuel your brand's growth loops.",
      visual: <UgcVisual />
    },
    {
      title: "Automation Systems",
      subtitle: "Intelligent AI workflows that multiply your output and eliminate operational friction.",
      visual: <AiVisual />
    },
    {
      title: "Performance Growth",
      subtitle: "Algorithmic performance marketing built on data and creative iteration.",
      visual: <PerformanceVisual />
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#FAFAFA]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,112,219,0.03)_0%,transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-purple-100/20 blur-[180px] rounded-full animate-ambient"></div>
        
        <div className="max-w-[1440px] w-full h-full px-8 md:px-24 flex items-center z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 items-center w-full">
            
            {/* Editorial Content Column */}
            <div className="relative">
              {services.map((service, index) => {
                const isActive = Math.floor(scrollProgress * 3.99) === index;
                return (
                  <div 
                    key={index}
                    className={`transition-all duration-[1200ms] cubic-bezier(0.19, 1, 0.22, 1) ${
                      isActive ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-16 blur-sm pointer-events-none'
                    }`}
                    style={{ position: index === 0 ? 'relative' : 'absolute', top: 0, left: 0, width: '100%' }}
                  >
                    <div className="flex items-center space-x-6 mb-10 opacity-40">
                      <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#9370DB]">0{index + 1}</span>
                      <div className="w-12 h-[1px] bg-[#9370DB]"></div>
                      <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#1D1D1F]">Protocol</span>
                    </div>
                    <h2 className="text-[#1D1D1F] text-[56px] md:text-[84px] font-semibold leading-[0.95] tracking-tighter mb-10">
                      {service.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? 'italic font-light opacity-70 italic-accent' : ''}>{word} </span>
                      ))}
                    </h2>
                    <p className="text-[#1D1D1F]/40 text-[18px] md:text-[24px] font-light max-w-[480px] leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Visual Column */}
            <div className="relative h-[60vh] flex items-center justify-center">
              {services.map((service, index) => {
                const isActive = Math.floor(scrollProgress * 3.99) === index;
                return (
                  <div 
                    key={index}
                    className="absolute inset-0 transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1) flex items-center justify-center"
                    style={{ 
                      opacity: isActive ? 1 : 0,
                      transform: `scale(${isActive ? 1 : 0.85}) rotate(${isActive ? 0 : 4}deg) translateY(${isActive ? 0 : 100}px)`,
                      filter: `blur(${isActive ? 0 : 40}px)`
                    }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                       {service.visual}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Weighted Pagination Indicators */}
        <div className="absolute right-12 md:right-20 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-12">
           {services.map((_, i) => (
             <div key={i} className={`group cursor-pointer relative`}>
                <div className={`w-1 transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${Math.floor(scrollProgress * 3.99) === i ? 'h-12 bg-[#9370DB]' : 'h-4 bg-[#1D1D1F]/10'}`} />
                <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 ${Math.floor(scrollProgress * 3.99) === i ? 'opacity-40 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                  0{i + 1}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const WebsiteVisual: React.FC = () => (
  <div className="w-full max-w-[480px] aspect-[14/10] bg-white rounded-[32px] shadow-[0_100px_180px_-40px_rgba(147,112,219,0.12)] border border-white/80 p-12 relative overflow-hidden group">
    {/* Refined Grid Lines */}
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
      style={{ backgroundImage: `linear-gradient(#9370DB 1px, transparent 1px), linear-gradient(90deg, #9370DB 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
    />
    
    <div className="relative h-full flex flex-col space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-24 h-2 bg-[#9370DB]/20 rounded-full" />
        <div className="flex space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#9370DB]/10 border border-[#9370DB]/5" />
          <div className="w-6 h-6 rounded-full bg-[#9370DB]/10 border border-[#9370DB]/5" />
        </div>
      </div>

      {/* Hero Skeleton with Subtle Float */}
      <div className="flex-1 bg-gradient-to-br from-[#9370DB]/5 to-transparent rounded-2xl border border-[#9370DB]/10 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-1000">
        {/* Abstract Geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#9370DB]/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#9370DB]/5 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#9370DB]/30"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#9370DB]/30"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="grid grid-cols-4 gap-4 h-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#9370DB]/5 rounded-xl border border-[#9370DB]/5" />
        ))}
      </div>
    </div>
  </div>
);

const UgcVisual: React.FC = () => (
  <div className="relative w-full max-w-[480px] h-[60vh] flex items-center justify-center">
    {/* Floating Dynamic Panels */}
    <div className="relative flex -space-x-20 items-center">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="w-[180px] md:w-[220px] aspect-[9/16] bg-white border border-white/80 rounded-[40px] shadow-[0_60px_100px_rgba(147,112,219,0.1)] overflow-hidden relative transition-all duration-[1200ms] cubic-bezier(0.19, 1, 0.22, 1) group"
          style={{ 
            transform: `rotate(${i === 1 ? -6 : i === 2 ? 0 : 6}deg) translateY(${i === 2 ? -40 : 20}px)`,
            zIndex: i === 2 ? 20 : 10
          }}
        >
          {/* Internal Content hints */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#9370DB]/5 via-white/50 to-transparent"></div>
          
          {/* Abstract Soundwave/Timeline */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[70%] h-24 flex items-end justify-center space-x-1.5 opacity-30">
             {[...Array(8)].map((_, idx) => (
               <div 
                 key={idx} 
                 className="w-1.5 bg-[#9370DB] rounded-full"
                 style={{ 
                   height: `${30 + Math.random() * 70}%`,
                   animation: `wave-dance 1.5s ease-in-out infinite alternate`,
                   animationDelay: `${idx * 0.1}s`
                 }}
               />
             ))}
          </div>

          {/* Floating 'Play' Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-12 h-12 rounded-full border border-[#9370DB]/20 flex items-center justify-center bg-white/40 backdrop-blur-md">
                <div className="w-0 h-0 border-l-[8px] border-l-[#9370DB]/60 border-y-[6px] border-y-transparent ml-1"></div>
             </div>
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes wave-dance {
        from { height: 20%; transform: scaleY(0.8); }
        to { height: 80%; transform: scaleY(1.1); }
      }
    `}</style>
  </div>
);

const AiVisual: React.FC = () => (
  <div className="w-full max-w-[480px] aspect-square flex items-center justify-center relative group">
    {/* Central Intelligent Core */}
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Orbital Rings */}
      <div className="absolute inset-0 border border-[#9370DB]/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
      <div className="absolute inset-8 border border-[#9370DB]/10 border-dashed rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
      <div className="absolute inset-16 border border-[#9370DB]/5 rounded-full animate-[spin_10s_linear_infinite]"></div>

      {/* Main Core Node */}
      <div className="w-20 h-20 bg-white rounded-full shadow-[0_30px_60px_rgba(147,112,219,0.25)] border border-[#9370DB]/10 flex items-center justify-center z-10">
        <div className="w-6 h-6 bg-[#9370DB] rounded-full animate-pulse shadow-[0_0_30px_rgba(147,112,219,0.6)]"></div>
      </div>

      {/* Orbiting Satellite Nodes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div 
          key={deg}
          className="absolute w-2.5 h-2.5 bg-[#9370DB]/40 rounded-full"
          style={{ 
            transform: `rotate(${deg}deg) translateX(110px)`,
          }}
        >
          {/* Subtle Connection Beam */}
          <div className="absolute top-1/2 right-full w-[110px] h-[1px] bg-gradient-to-l from-[#9370DB]/20 to-transparent origin-right"></div>
        </div>
      ))}

      {/* Moving Ambient Data Particles */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-[#9370DB]/30 rounded-full animate-particle"
          style={{ 
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
    <style>{`
      @keyframes particle {
        0% { transform: translate(0, 0); opacity: 0; }
        50% { opacity: 0.6; }
        100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
      }
    `}</style>
  </div>
);

const PerformanceVisual: React.FC = () => (
  <div className="w-full max-w-[480px] aspect-[14/10] bg-white rounded-[40px] shadow-[0_100px_180px_-40px_rgba(147,112,219,0.12)] border border-white/80 p-16 flex flex-col justify-between relative overflow-hidden group">
    {/* Data Horizon Lines */}
    <div className="absolute inset-0 flex flex-col justify-between py-16 px-16 pointer-events-none opacity-[0.05]">
       {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-[1px] bg-[#9370DB]" />)}
    </div>

    {/* Primary Growth Curve (SVG) */}
    <div className="absolute inset-0 flex items-center justify-center p-16">
      <svg className="w-full h-48 opacity-[0.15]" viewBox="0 0 400 200">
        <path 
          d="M0,180 Q100,160 150,100 T300,40 T450,20" 
          fill="none" 
          stroke="#9370DB" 
          strokeWidth="3" 
          strokeDasharray="8 8"
          className="animate-[dash_20s_linear_infinite]"
        />
      </svg>
    </div>

    {/* Dynamic Bar Indicators */}
    <div className="relative flex items-end justify-between space-x-4 h-full z-10">
      {[40, 65, 55, 85, 75, 100, 90].map((h, i) => (
        <div 
          key={i} 
          className="flex-1 bg-gradient-to-t from-[#9370DB]/5 to-[#9370DB]/20 rounded-t-2xl relative transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) hover:bg-[#9370DB]/30" 
          style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}
        >
          {/* Accent Cap */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#9370DB]/40 rounded-full" />
        </div>
      ))}
    </div>

    {/* Metadata Accents */}
    <div className="absolute bottom-6 left-12 right-12 flex justify-between">
       <div className="w-12 h-1 bg-[#9370DB]/10 rounded-full" />
       <div className="w-24 h-1 bg-[#9370DB]/10 rounded-full" />
    </div>

    <style>{`
      @keyframes dash {
        to { stroke-dashoffset: -200; }
      }
    `}</style>
  </div>
);

export default StorytellingSection;
