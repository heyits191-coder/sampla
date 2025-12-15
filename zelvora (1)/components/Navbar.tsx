import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

interface NavbarProps {
  onLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Comparison', href: '#comparison' },
    { label: 'Modes', href: '#modes' },
    { label: 'Why Zelvora', href: '#why' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-slate-900 tracking-tight">
              ZELVORA
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-4 w-px bg-slate-300 mx-2"></div>
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </button>
            <Button variant="primary" className="py-2 px-4 text-xs" onClick={onLoginClick}>
              Start Evaluation
            </Button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="text-base font-medium text-slate-600 hover:text-slate-900 block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="h-px bg-slate-100 my-2"></div>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLoginClick?.();
            }}
            className="text-base font-medium text-slate-600 hover:text-slate-900 block py-2 text-left"
          >
            Login
          </button>
          <Button fullWidth onClick={() => {
            setIsMobileMenuOpen(false);
            onLoginClick?.();
          }}>
            Start Evaluation
          </Button>
        </div>
      )}
    </nav>
  );
};