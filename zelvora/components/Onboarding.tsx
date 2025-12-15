import React, { useState } from 'react';
import { FileText, Camera, Ban, ShieldCheck, CheckSquare } from 'lucide-react';
import { Button } from './ui/Button';

interface OnboardingProps {
  onProceed: () => void;
  onBack: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onProceed }) => {
  const [hasConsented, setHasConsented] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-center bg-slate-50/50">
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Before you begin</h1>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
            
            <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                    <FileText size={24} />
                </div>
                <div>
                   <span className="text-base font-medium text-slate-900 block">Resume Analysis</span>
                   <span className="text-xs text-slate-500">Your resume will be processed to tailor questions.</span>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                    <Camera size={24} />
                </div>
                <div>
                   <span className="text-base font-medium text-slate-900 block">Camera Mandatory</span>
                   <span className="text-xs text-slate-500">Required for engagement analysis. <strong>No video recording.</strong></span>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                    <Ban size={24} />
                </div>
                 <div>
                   <span className="text-base font-medium text-slate-900 block">Strict Protocol</span>
                   <span className="text-xs text-slate-500">The AI may interrupt you or end the session early.</span>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                    <ShieldCheck size={24} />
                </div>
                <div>
                   <span className="text-base font-medium text-slate-900 block">Honest Verdict</span>
                   <span className="text-xs text-slate-500">Scores are simulated based on corporate criteria.</span>
                </div>
            </div>

        </div>

        {/* Consent Section */}
        <div className="px-8 pb-4">
            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        checked={hasConsented}
                        onChange={(e) => setHasConsented(e.target.checked)}
                        className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900 mt-1"
                    />
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                    By continuing, I consent to the use of my <strong>camera, microphone, and resume data</strong> for interview evaluation purposes as described in the <a href="/privacy-policy" target="_blank" className="underline text-slate-900 font-medium">Privacy Policy</a>. I understand that this is an AI-generated assessment.
                </div>
            </label>
        </div>

        {/* Action */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
            <Button 
                fullWidth 
                onClick={onProceed} 
                disabled={!hasConsented}
                className="h-12 text-sm uppercase tracking-widest font-bold"
            >
                Start Interview
            </Button>
        </div>

      </div>
    </div>
  );
};