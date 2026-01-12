
import React, { useEffect, useRef, useState } from 'react';

const ProofSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<'clients' | 'systems' | 'automation'>('clients');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / (rect.height - windowHeight), 0), 1);
      setScrollProgress(progress);

      if (progress < 0.35) setActiveSection('clients');
      else if (progress < 0.7) setActiveSection('systems');
      else setActiveSection('automation');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const narrative = {
    clients: {
      eyebrow: "Case Briefs",
      title: "Silent Delivery.",
      desc: "Confidence through outcomes, not promises. We partner with leaders defining the next era of high-output brands."
    },
    systems: {
      eyebrow: "Infrastructure",
      title: "Built Logic.",
      desc: "Scalable frameworks engineered to support exponential growth without breaking the operational core."
    },
    automation: {
      eyebrow: "Intelligence",
      title: "Stealth Ops.",
      desc: "Private AI protocols powering proprietary brand automation and 24/7 efficiency loops."
    }
  };

  return (
    <div ref={containerRef} className="relative h-[450vh] bg-white">
      {/* Editorial Shadow Falloff */}
      <div className="absolute top-0 right-0 w-[45%] h-screen bg-[#FBFBFF] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-screen bg-gradient-to-tr from-purple-50/10 to-transparent -z-10"></div>

      <div className="sticky top-0 h-screen w-full flex overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-32 h-full items-center">
          
          {/* Narrative Column */}
          <div className="relative z-10 hidden md:block">
            <div className="flex flex-col space-y-12 max-w-[480px]">
              <div className="flex items-center space-x-4">
                <span className="text-[#9370DB] text-[11px] font-bold tracking-[0.5em] uppercase opacity-60">
                  {narrative[activeSection].eyebrow}
                </span>
                <div className="w-8 h-[1px] bg-[#9370DB]/20"></div>
              </div>
              
              <h2 className="text-[#1D1D1F] text-[64px] md:text-[84px] font-semibold leading-[0.95] tracking-tighter transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1)">
                {narrative[activeSection].title}
              </h2>
              
              <p className="text-[#1D1D1F]/40 text-[20px] md:text-[24px] font-light leading-relaxed transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1)">
                {narrative[activeSection].desc}
              </p>
              
              {/* Weighted Progress Bar */}
              <div className="pt-20 flex items-center space-x-8">
                <div className="w-[200px] h-[1.5px] bg-[#1D1D1F]/5 relative overflow-hidden rounded-full">
                  <div 
                    className="absolute inset-y-0 left-0 bg-[#9370DB] transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1)"
                    style={{ width: `${scrollProgress * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-20 transition-all duration-500">
                  Phase {activeSection === 'clients' ? '01' : activeSection === 'systems' ? '02' : '03'}
                </span>
              </div>
            </div>
          </div>

          {/* Perspective Column */}
          <div className="relative h-[75vh] w-full flex items-center justify-center">
            
            {/* PART 1: Partner Ledger */}
            <div 
              className="absolute inset-0 flex flex-col justify-center space-y-12 transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1)"
              style={{ 
                opacity: activeSection === 'clients' ? 1 : 0,
                transform: `translateY(${activeSection === 'clients' ? 0 : -80}px) scale(${activeSection === 'clients' ? 1 : 0.95})`,
                filter: `blur(${activeSection === 'clients' ? 0 : 20}px)`,
                pointerEvents: activeSection === 'clients' ? 'auto' : 'none'
              }}
            >
              <ClientRow name="Aartique" service="Digital Identity Protocol" />
              <ClientRow name="PSV Design" service="Architecture Strategy" />
              <ClientRow name="Mentorshala" service="Ad Logic Infrastructure" />
              <ClientRow name="Stealth Partner" service="Proprietary UGC System" badge="NDA" />
            </div>

            {/* PART 2: System Blueprint */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.19, 1, 0.22, 1)"
              style={{ 
                opacity: activeSection === 'systems' ? 1 : 0,
                transform: `translateY(${activeSection === 'systems' ? 0 : 80}px) scale(${activeSection === 'systems' ? 1 : 0.92})`,
                filter: `blur(${activeSection === 'systems' ? 0 : 20}px)`,
                pointerEvents: activeSection === 'systems' ? 'auto' : 'none'
              }}
            >
              <div className="grid grid-cols-2 gap-10 w-full max-w-[580px]">
                <SystemCard title="Design Core" type="Architecture" icon="◈" />
                <SystemCard title="Growth Engine" type="Algorithm" icon="◉" />
                <SystemCard title="Content Ops" type="Pipeline" icon="◎" />
                <SystemCard title="AI Intelligence" type="Automation" icon="◇" />
              </div>
            </div>

            {/* PART 3: Automation Terminal */}
            <div 
              className="absolute inset-0 flex flex-col justify-center transition-all duration-[1200ms] cubic-bezier(0.19, 1, 0.22, 1)"
              style={{ 
                opacity: activeSection === 'automation' ? 1 : 0,
                transform: `translateY(${activeSection === 'automation' ? 0 : 80}px) scale(${activeSection === 'automation' ? 1 : 0.92})`,
                filter: `blur(${activeSection === 'automation' ? 0 : 20}px)`,
                pointerEvents: activeSection === 'automation' ? 'auto' : 'none'
              }}
            >
              <div className="bg-white/90 backdrop-blur-3xl border border-white/80 p-14 rounded-[40px] shadow-[0_120px_200px_-50px_rgba(147,112,219,0.2)] relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-16">
                   <div className="flex items-center space-x-4">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></div>
                     <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#1D1D1F]/30">Intelligence Layer</span>
                   </div>
                   <div className="px-4 py-1.5 bg-[#1D1D1F] text-white text-[10px] font-bold rounded-full tracking-[0.3em] uppercase">Private</div>
                 </div>
                 <div className="space-y-10">
                   <AutomationItem label="Synthesized Brand Narrative" status="Active" />
                   <AutomationItem label="Predictive Scale Logic" status="Proprietary" />
                   <AutomationItem label="Multi-Agent Execution" status="Operational" />
                 </div>
                 {/* Internal Ambient Glow */}
                 <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-100/30 blur-[120px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-125"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ClientRow: React.FC<{ name: string; service: string; badge?: string }> = ({ name, service, badge }) => (
  <div className="group border-b border-[#1D1D1F]/5 pb-12 transition-all duration-1000 hover:pl-8">
    <div className="flex items-end justify-between mb-4">
      <h3 className="text-[#1D1D1F] text-[40px] md:text-[52px] font-medium tracking-tighter group-hover:text-[#9370DB] transition-all duration-700">
        {name}
      </h3>
      {badge && <span className="text-[10px] font-bold tracking-[0.5em] text-[#9370DB] uppercase mb-4 border border-[#9370DB]/20 px-3 py-1 rounded-full">{badge}</span>}
    </div>
    <p className="text-[#1D1D1F]/30 text-[14px] font-bold uppercase tracking-[0.4em] transition-colors group-hover:text-[#1D1D1F]/50">{service}</p>
  </div>
);

const SystemCard: React.FC<{ title: string; type: string; icon: string }> = ({ title, type, icon }) => (
  <div className="bg-[#FAFAFA] border border-white/60 p-10 rounded-[32px] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(147,112,219,0.1)] transition-all duration-1000 group flex flex-col justify-between aspect-square cursor-default">
    <div className="text-[24px] text-[#9370DB]/30 group-hover:text-[#9370DB] transition-colors duration-700">{icon}</div>
    <div>
      <span className="text-[11px] font-bold text-purple-300 uppercase tracking-[0.3em] mb-3 block opacity-60">{type}</span>
      <h4 className="text-[24px] font-medium text-[#1D1D1F] tracking-tight">{title}</h4>
    </div>
  </div>
);

const AutomationItem: React.FC<{ label: string; status: string }> = ({ label, status }) => (
  <div className="flex justify-between items-center group/item cursor-default">
    <div className="flex items-center space-x-8">
      <div className="w-[1.5px] h-5 bg-purple-200 group-hover/item:h-10 group-hover/item:bg-[#9370DB] transition-all duration-700"></div>
      <span className="text-[18px] text-[#1D1D1F]/50 font-light group-hover/item:text-[#1D1D1F] transition-all duration-700">{label}</span>
    </div>
    <span className="text-[11px] font-bold text-purple-300/40 tracking-widest uppercase transition-colors group-hover/item:text-purple-400">{status}</span>
  </div>
);

export default ProofSection;
