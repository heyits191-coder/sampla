
import React, { useEffect, useRef, useState } from 'react';

const FounderSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full min-h-screen bg-[#FAFAFA] py-32 md:py-64 px-8 md:px-24 flex items-center justify-center overflow-hidden relative"
    >
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-[2000ms] ease-out -z-10"
        style={{
          background: `radial-gradient(800px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(147, 112, 219, 0.08), transparent 80%)`
        }}
      ></div>

      <div className="max-w-[1440px] w-full grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-0 items-center">
        
        {/* Left Column: Visual Composition (Span 5) */}
        <div className={`md:col-span-5 relative transition-all duration-[2000ms] cubic-bezier(0.19, 1, 0.22, 1) ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}>
          
          {/* Subtle Moving Brand Accent (Purple Halo) */}
          <div className="absolute -top-20 -left-20 w-[140%] h-[140%] pointer-events-none -z-10 select-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(147,112,219,0.15)_0%,transparent_70%)] blur-[80px] animate-subtle-drift"></div>
          </div>

          {/* Layered Image Frame with Parallax and Float */}
          <div 
            className="relative group transition-transform duration-700 ease-out animate-float"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg) translateZ(20px)`
            }}
          >
            {/* Soft Outer Border/Shadow */}
            <div className="absolute -inset-6 border border-[#1D1D1F]/5 rounded-[40px] transition-all duration-1000 group-hover:scale-[1.05] group-hover:border-[#9370DB]/20"></div>
            
            {/* Main Image Container with Curve */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0] rounded-[32px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-700 group-hover:shadow-[0_80px_140px_-30px_rgba(147,112,219,0.2)]">
              <img 
                src="file_00000000536c7207a7135aa9bdc296a8.png" 
                alt="Anushka - Founder of Brand Spark"
                className="w-full h-full object-cover grayscale-[20%] brightness-[1.02] transition-transform duration-[12000ms] ease-out group-hover:scale-110"
              />
              
              {/* Subtle Linear Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40"></div>
              
              {/* Internal Glass Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            </div>
            
            {/* Signature Accent */}
            <div className="absolute -bottom-8 -right-8 bg-white/90 py-5 px-8 shadow-2xl rounded-2xl border border-white/50 backdrop-blur-md hidden md:block transition-all duration-700 hover:-translate-y-3">
               <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#1D1D1F]/40 block mb-1">Signed</span>
               <span className="font-serif italic text-2xl text-[#1D1D1F]">Anushka.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Copy (Span 6, Offset 1) */}
        <div className="md:col-span-6 md:col-start-7 flex flex-col items-start justify-center">
          <div className={`transition-all duration-[1200ms] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center space-x-6 mb-12">
               <span className="text-[#9370DB] text-[11px] font-bold tracking-[0.6em] uppercase">Founder-led</span>
               <div className="w-12 h-px bg-[#1D1D1F]/10"></div>
               <span className="text-[#1D1D1F]/30 text-[11px] font-bold tracking-[0.6em] uppercase">AI-native</span>
            </div>

            <h2 className="text-[#1D1D1F] text-[44px] md:text-[68px] font-semibold leading-[0.98] tracking-tighter mb-12">
              “I design systems where <span className="italic-accent font-light opacity-70">logic</span> meets beauty.”
            </h2>

            <div className="space-y-8 mb-20 max-w-[500px]">
              <p className="text-[#1D1D1F]/50 text-[18px] md:text-[22px] font-light leading-relaxed">
                Brand Spark is the intersection of high-fidelity design and algorithmic scale. We build the infrastructure that allows elite founders to focus on their vision, not their friction.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                 <div className="group/stat">
                   <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9370DB] block mb-2 transition-transform duration-500 group-hover/stat:-translate-y-1">Strategy</span>
                   <p className="text-[13px] text-[#1D1D1F]/60 font-medium">Growth Engineering</p>
                 </div>
                 <div className="group/stat">
                   <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9370DB] block mb-2 transition-transform duration-500 group-hover/stat:-translate-y-1">Systems</span>
                   <p className="text-[13px] text-[#1D1D1F]/60 font-medium">AI Protocols</p>
                 </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex flex-col">
                <span className="text-[20px] font-semibold text-[#1D1D1F] tracking-tight">Anushka</span>
                <span className="text-[11px] font-bold text-[#1D1D1F]/20 uppercase tracking-[0.4em] mt-1">Founder & Lead Strategist</span>
              </div>
              
              <div className="h-10 w-px bg-[#1D1D1F]/10"></div>
              
              <a 
                href="https://instagram.com/anushka.hustle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="flex items-center space-x-3 transition-opacity duration-500 opacity-40 hover:opacity-100">
                  <svg className="w-5 h-5 fill-[#1D1D1F]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848 0-3.204.012-3.584.07-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">@anushka.hustle</span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#9370DB]/40 transition-all duration-500 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editorial Vertical Detail */}
      <div className="absolute right-12 bottom-12 hidden md:flex flex-col items-center space-y-6">
         <span className="text-[9px] font-bold tracking-[0.8em] uppercase text-[#1D1D1F]/10 [writing-mode:vertical-lr]">Perspective 04</span>
         <div className="w-px h-12 bg-[#1D1D1F]/5"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) perspective(1000px); }
          50% { transform: translateY(-15px) perspective(1000px); }
        }
        @keyframes subtle-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          33% { transform: translate(10px, -15px) scale(1.05); opacity: 1; }
          66% { transform: translate(-15px, 10px) scale(0.95); opacity: 0.7; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-subtle-drift {
          animation: subtle-drift 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FounderSection;
