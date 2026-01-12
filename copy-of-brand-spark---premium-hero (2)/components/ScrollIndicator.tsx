
import React from 'react';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
      <div className="w-[1px] h-12 bg-gradient-to-b from-[#9370DB] to-transparent opacity-40 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[#9370DB] -translate-y-full animate-[scroll_3s_infinite_ease-in-out]"></div>
      </div>
      <span className="text-[10px] font-normal tracking-[0.2em] uppercase text-[#1D1D1F]/30 select-none">Scroll</span>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;
