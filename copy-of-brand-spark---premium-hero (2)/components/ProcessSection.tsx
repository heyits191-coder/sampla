
import React, { useEffect, useRef, useState } from 'react';

const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.55;

      stepsRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.top < triggerPoint && rect.bottom > triggerPoint) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      title: "Clarity",
      line: "Establishing the fundamental growth constraints and brand architecture.",
      details: ["Positioning", "Friction Audit", "Stack Review"]
    },
    {
      title: "System Design",
      line: "Architecting connected workflows across content, web, and automation layers.",
      details: ["User Journeys", "Content Logic", "API Design"]
    },
    {
      title: "Execution",
      line: "Deploying high-fidelity brand assets through AI-native delivery protocols.",
      details: ["Rapid Dev", "Ads UGC", "Logic Hook"]
    },
    {
      title: "Scale",
      line: "Iterative optimization based on real-time performance and system health.",
      details: ["Creative Beta", "Vitals", "Growth Loop"]
    }
  ];

  return (
    <section className="bg-white py-48 md:py-64 px-8 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32">
          
          {/* Static Header */}
          <div className="md:col-span-5 relative">
            <div className="sticky top-48">
              <span className="text-[#9370DB] text-[11px] font-bold tracking-[0.4em] uppercase mb-10 block opacity-60">
                Process
              </span>
              <h2 className="text-[#1D1D1F] text-[56px] md:text-[72px] font-semibold leading-[1] tracking-tight mb-12">
                Designed <br/>for <span className="italic font-light opacity-80">Speed.</span>
              </h2>
              <p className="text-[#1D1D1F]/40 text-[18px] font-light max-w-[340px] leading-relaxed">
                Clear protocols eliminate friction. Systems ensure quality. Speed creates scale.
              </p>
              
              {/* Dynamic Number indicator */}
              <div className="mt-20 flex items-baseline space-x-4">
                <span className="text-[64px] font-light text-[#1D1D1F]/5 tracking-tighter">0{activeStep + 1}</span>
                <div className="h-[1px] w-12 bg-[#9370DB]/20"></div>
              </div>
            </div>
          </div>

          {/* Scrolling Steps */}
          <div className="md:col-span-7 pl-4 md:pl-20 border-l border-[#1D1D1F]/5 relative">
             {/* Progress line overlay */}
             <div className="absolute left-[-1px] top-0 h-full w-[1px] bg-transparent">
                <div 
                  className="w-full bg-[#9370DB] transition-all duration-[800ms] ease-out" 
                  style={{ height: `${((activeStep + 0.5) / steps.length) * 100}%` }}
                />
             </div>

             <div className="flex flex-col space-y-48 md:space-y-72 py-10">
               {steps.map((step, index) => {
                 const isActive = activeStep === index;
                 return (
                   <div 
                     key={index} 
                     ref={el => { stepsRefs.current[index] = el; }}
                     className={`transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'opacity-100 translate-x-4' : 'opacity-10 scale-[0.98]'}`}
                   >
                     <h3 className="text-[#1D1D1F] text-[36px] md:text-[48px] font-medium tracking-tight mb-8">
                        {step.title}
                     </h3>
                     <p className="text-[#1D1D1F] text-[20px] md:text-[24px] font-light leading-snug mb-10 max-w-[500px]">
                        {step.line}
                     </p>
                     <ul className="flex flex-wrap gap-4">
                        {step.details.map((d, i) => (
                          <li key={i} className="px-4 py-2 border border-purple-100/50 rounded-full text-[10px] font-bold tracking-widest uppercase text-purple-300">
                             {d}
                          </li>
                        ))}
                     </ul>
                   </div>
                 );
               })}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
