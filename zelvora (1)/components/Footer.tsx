import React from 'react';
import { Button } from './ui/Button';

interface FooterProps {
  onStartClick?: () => void;
  onLoginClick?: () => void;
  onAdminClick?: () => void; 
  onPolicyClick?: () => void;
  onPrivacyClick?: () => void; // Added prop
}

export const Footer: React.FC<FooterProps> = ({ onStartClick, onLoginClick, onAdminClick, onPolicyClick, onPrivacyClick }) => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CTA Section */}
        <div className="bg-slate-900 rounded-none p-12 text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">
            Experience the interview before it happens.
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">
            No coaching. No safety nets. Just the interview.
          </p>
          <Button 
            className="bg-white text-slate-900 hover:bg-slate-200 border-none px-8 py-3 rounded-none uppercase text-xs font-bold tracking-widest"
            onClick={onStartClick}
          >
            Start Interview
          </Button>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Methodology</a></li>
              <li><a href="#" className="hover:text-slate-900">Access</a></li>
              <li>
                <button 
                  onClick={onLoginClick} 
                  className="hover:text-slate-900 text-left"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Evaluation Criteria</a></li>
              <li><a href="#" className="hover:text-slate-900">Case Studies</a></li>
              <li><a href="#" className="hover:text-slate-900">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                  <button onClick={onPrivacyClick} className="hover:text-slate-900 text-left">
                     Privacy Policy
                  </button>
              </li>
              <li><a href="#" className="hover:text-slate-900">Terms of Service</a></li>
              <li>
                  <button onClick={onPolicyClick} className="hover:text-slate-900 text-left">
                     Refund Policy
                  </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">ZELVORA</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real interview evaluation for serious candidates.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Zelvora. All rights reserved.
          </p>
          <div className="flex gap-4">
             {/* Discrete Admin Link */}
             <button onClick={onAdminClick} className="text-[10px] text-slate-300 hover:text-slate-500 uppercase tracking-widest">
                Admin
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};