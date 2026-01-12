
import React, { useEffect, useRef, useState } from 'react';

const CTASection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-64 px-8 bg-white relative overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Ambient background dynamics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(147,112,219,0.06)_0%,transparent_60%)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-purple-100/50 to-transparent"></div>
      
      <div className={`max-w-[900px] w-full z-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      }`}>
        <span className="text-[#9370DB] text-[11px] font-bold tracking-[0.5em] uppercase mb-12 block opacity-60">
          Collaboration
        </span>

        <h2 className="text-[#1D1D1F] text-[56px] md:text-[88px] font-semibold leading-[0.95] tracking-tighter mb-12">
          Ready to <br/> <span className="italic font-light italic-accent opacity-80">Design</span> the future?
        </h2>

        <p className="text-[#1D1D1F]/40 text-[18px] md:text-[24px] font-light max-w-[540px] mx-auto leading-relaxed mb-20">
          We only take on 3 new partners per quarter to ensure system integrity.
        </p>

        <div className="flex flex-col items-center space-y-12">
          <button className="relative group px-12 py-6 bg-[#1D1D1F] text-white text-[14px] font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:bg-[#9370DB] hover:shadow-[0_20px_40px_rgba(147,112,219,0.3)] hover:-translate-y-1">
            <span className="relative z-10">Request Briefing</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <a href="#" className="group text-[11px] text-[#1D1D1F]/30 font-bold tracking-[0.4em] uppercase relative pb-1">
             Discover our work
             <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-purple-200 group-hover:w-full transition-all duration-500"></div>
          </a>
        </div>
      </div>

      {/* Finishing Touch */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-purple-100/40 to-transparent"></div>
    </section>
  );
};

export default CTASection;
