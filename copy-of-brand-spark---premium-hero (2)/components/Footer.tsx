
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white px-8 md:px-24 pt-56 pb-20">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Editorial Layout System */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 md:gap-8 items-start mb-48">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-[#1D1D1F]"></div>
              <span className="text-[24px] font-semibold tracking-tight text-[#1D1D1F]">Brand Spark</span>
            </div>
            <p className="text-[16px] md:text-[18px] font-light text-[#1D1D1F]/40 leading-relaxed max-w-[320px]">
              The premium design protocol for AI-native brand building and system-driven growth.
            </p>
            <div className="pt-8">
               <button className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#1D1D1F]/30 hover:text-[#9370DB] transition-colors duration-500">
                  Join the Protocol &rarr;
               </button>
            </div>
          </div>

          {/* Navigation Col */}
          <div className="md:col-span-4">
            <nav className="grid grid-cols-2 gap-x-12 gap-y-6">
               <FooterLink label="Perspective" />
               <FooterLink label="Systems" />
               <FooterLink label="Intelligence" />
               <FooterLink label="Briefing" />
               <FooterLink label="Journal" />
               <FooterLink label="Philosophy" />
            </nav>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 md:text-right flex flex-col md:items-end space-y-12">
            <div className="space-y-3">
              <p className="text-[14px] font-semibold text-[#1D1D1F]/70">Directed by Anushka</p>
              <a href="#" className="text-[12px] font-bold text-[#9370DB] tracking-[0.4em] uppercase hover:opacity-70 transition-opacity">Connect Private</a>
            </div>
            <div className="flex space-x-8 md:justify-end">
               <SocialLink label="Li" />
               <SocialLink label="Ig" />
               <SocialLink label="X" />
            </div>
          </div>
        </div>

        {/* Legal Authority Line */}
        <div className="pt-12 border-t border-[#1D1D1F]/5 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-12">
            <span className="text-[10px] font-bold text-[#1D1D1F]/20 tracking-[0.6em] uppercase">© 2025 Brand Spark</span>
            <span className="text-[10px] font-bold text-[#1D1D1F]/20 tracking-[0.6em] uppercase">Clarity Protocol V.25</span>
          </div>
          
          <div className="flex items-center space-x-10">
             <span className="text-[10px] font-bold text-[#1D1D1F]/40 uppercase tracking-[0.4em] hover:text-[#9370DB] transition-colors cursor-pointer">Privacy</span>
             <div className="w-1.5 h-1.5 rounded-full bg-[#9370DB]/20"></div>
             <span className="text-[10px] font-bold text-[#1D1D1F]/40 uppercase tracking-[0.4em]">Designed by Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ label: string }> = ({ label }) => (
  <a 
    href="#" 
    className="text-[13px] font-medium text-[#1D1D1F]/30 hover:text-[#1D1D1F] transition-all duration-700 uppercase tracking-[0.3em] relative group"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#9370DB]/40 transition-all duration-700 group-hover:w-full"></span>
  </a>
);

const SocialLink: React.FC<{ label: string }> = ({ label }) => (
  <a href="#" className="text-[11px] font-bold text-[#1D1D1F]/20 hover:text-[#9370DB] transition-colors duration-500 tracking-[0.2em] uppercase">
    {label}
  </a>
);

export default Footer;
