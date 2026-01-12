
import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StorytellingSection from './components/StorytellingSection';
import ProofSection from './components/ProofSection';
import ProcessSection from './components/ProcessSection';
import FounderSection from './components/FounderSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section Container - Using fixed aspect ratio logic */}
        <section className="h-screen min-h-[700px] ambient-gradient flex items-center justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-100/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-50/40 blur-[120px] rounded-full"></div>
          
          <HeroSection />
        </section>

        {/* Immersive Services Storytelling Section */}
        <StorytellingSection />

        {/* Proof & Credibility Section */}
        <ProofSection />

        {/* Process Section (How We Work) */}
        <ProcessSection />

        {/* Founder Section */}
        <FounderSection />

        {/* Final CTA Section */}
        <CTASection />

        {/* Premium Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default App;
