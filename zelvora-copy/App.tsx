import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, ShieldCheck } from 'lucide-react';
import Home from './pages/Home';
import Platform from './pages/Platform';
import Interview from './pages/Interview';
import Reports from './pages/Reports';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import Dashboard from './pages/Dashboard';

// --- Layout Components ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <ShieldCheck className="h-8 w-8 text-emerald-500 mr-2" />
            <span className="text-2xl font-bold tracking-tight text-white">ZELVORA</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/platform" className={`${isActive('/platform') ? 'text-white' : 'text-slate-400 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Platform</Link>
              <Link to="/reports" className={`${isActive('/reports') ? 'text-white' : 'text-slate-400 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Reports</Link>
              <Link to="/pricing" className={`${isActive('/pricing') ? 'text-white' : 'text-slate-400 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Pricing</Link>
              <Link to="/team" className={`${isActive('/team') ? 'text-white' : 'text-slate-400 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Team</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm font-medium">Log In</Link>
            <button className="bg-slate-100 text-slate-900 px-5 py-2 rounded-sm text-sm font-semibold hover:bg-white transition-all">
              Sign Up
            </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none">
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/platform" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Platform</Link>
            <Link to="/reports" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Reports</Link>
            <Link to="/pricing" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
            <Link to="/team" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</Link>
             <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-950 border-t border-slate-900 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4">
             <ShieldCheck className="h-6 w-6 text-emerald-600 mr-2" />
             <span className="text-xl font-bold text-white">ZELVORA</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enterprise-grade interview intelligence. <br/>
            Practice here. Perform in real interviews.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Platform</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">AI HR Interview</a></li>
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Resume Gatekeeper</a></li>
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Analytics</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Company</h3>
          <ul className="mt-4 space-y-2">
            <li><Link to="/team" className="text-slate-400 hover:text-emerald-500 text-sm">Our Team</Link></li>
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Careers</a></li>
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Legal</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-slate-900 pt-8 text-center">
        <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} Zelvora Intelligence. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/team" element={<Team />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
