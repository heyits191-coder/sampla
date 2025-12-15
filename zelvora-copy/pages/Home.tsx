import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, FileText, Cpu, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20 mb-8">
            Enterprise Grade Interview Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Prepare for <span className="text-emerald-500">real</span> interviews.<br />
            Not practice questions.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
            ZELVORA simulates real HR interviews using AI intelligence, ATS resume screening, and structured corporate evaluation protocols.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/interview" className="rounded-sm bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all">
              Start Interview
            </Link>
            <Link to="/platform" className="text-sm font-semibold leading-6 text-white flex items-center group">
              See How It Works <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-slate-900/50 py-10 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-4">
              <div className="flex justify-center mb-3"><FileText className="text-blue-500 h-6 w-6" /></div>
              <h3 className="text-white font-semibold">Resume Screened</h3>
              <p className="text-slate-400 text-sm mt-1">Interviews tailored to your actual CV, just like an ATS.</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-3"><Cpu className="text-emerald-500 h-6 w-6" /></div>
              <h3 className="text-white font-semibold">AI HR Director</h3>
              <p className="text-slate-400 text-sm mt-1">Dynamic questioning logic based on your responses.</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-3"><BarChart3 className="text-purple-500 h-6 w-6" /></div>
              <h3 className="text-white font-semibold">Placement Standard</h3>
              <p className="text-slate-400 text-sm mt-1">Used by professionals for high-stakes preparation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why ZELVORA is Different</h2>
            <p className="mt-4 text-slate-400">We don't do "mock" interviews. We do simulations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* The Old Way */}
            <div className="bg-slate-900/40 rounded-xl p-8 border border-red-900/20">
              <h3 className="text-xl font-bold text-slate-300 mb-6 border-b border-slate-800 pb-4">Standard Practice Apps</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-400">Randomized question banks without context</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-400">Soft, coaching-style feedback</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-400">Gamified streaks and badges</span>
                </li>
                 <li className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-400">No pressure simulation</span>
                </li>
              </ul>
            </div>

            {/* The Zelvora Way */}
            <div className="bg-slate-900 rounded-xl p-8 border border-emerald-500/20 shadow-2xl shadow-emerald-900/10">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">The ZELVORA Platform</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-200">Resume-based deep probing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-200">Real corporate HR evaluation metrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-200">Pressure testing & cross-questioning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-200">Detailed post-interview analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-emerald-900/10 border-t border-emerald-900/20">
         <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl font-semibold text-white mb-6">Ready to test yourself against corporate standards?</h2>
            <Link to="/dashboard" className="inline-block bg-slate-100 text-slate-900 px-8 py-3 rounded-sm font-bold hover:bg-white transition-colors">
              Access Platform
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
