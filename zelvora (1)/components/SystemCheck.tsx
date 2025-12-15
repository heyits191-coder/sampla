import React, { useState, useEffect } from 'react';
import { Camera, Mic, FileCheck, CheckCircle, XCircle, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface SystemCheckProps {
  onBack: () => void;
  onStart: () => void;
}

type CheckStatus = 'idle' | 'checking' | 'success' | 'failure';

export const SystemCheck: React.FC<SystemCheckProps> = ({ onBack, onStart }) => {
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>('checking');
  const [micStatus, setMicStatus] = useState<CheckStatus>('idle');
  const [resumeStatus, setResumeStatus] = useState<CheckStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Sequence the checks for a professional feel
    const runChecks = async () => {
      setErrorMsg(null);
      
      // 1. Camera Check
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStatus('success');
        setMicStatus('checking');
      } catch (err) {
        setCameraStatus('failure');
        setErrorMsg("Camera access is denied or unavailable.");
        return; // Stop if camera fails
      }

      // 2. Microphone Check (Add a small delay for visual pacing)
      setTimeout(async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicStatus('success');
          setResumeStatus('checking');
        } catch (err) {
          setMicStatus('failure');
          setErrorMsg("Microphone access is denied or unavailable.");
        }
      }, 800);

      // 3. Resume Check (Simulated verification of backend processing)
      setTimeout(() => {
        setResumeStatus('success');
      }, 2000);
    };

    runChecks();
  }, []);

  const allChecksPassed = cameraStatus === 'success' && micStatus === 'success' && resumeStatus === 'success';

  const CheckItem = ({ 
    icon: Icon, 
    label, 
    status, 
    errorText 
  }: { 
    icon: React.ElementType, 
    label: string, 
    status: CheckStatus, 
    errorText?: string 
  }) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${status === 'failure' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          {status === 'failure' && <p className="text-xs text-red-500 mt-1">{errorText}</p>}
        </div>
      </div>
      <div className="flex items-center">
        {status === 'checking' && (
          <div className="flex items-center text-slate-500 text-sm">
            <span className="mr-2">Checking...</span>
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
        {status === 'success' && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <span className="mr-2">Verified</span>
            <CheckCircle size={20} fill="currentColor" className="text-green-100" stroke="currentColor" />
          </div>
        )}
        {status === 'failure' && (
          <div className="flex items-center text-red-600 text-sm font-medium">
            <span className="mr-2">Failed</span>
            <XCircle size={20} />
          </div>
        )}
        {status === 'idle' && (
          <span className="text-slate-300 text-sm">Pending</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
            <span className="text-slate-900">Profile</span>
            <span className="text-slate-900">Role</span>
            <span className="text-slate-900">Resume</span>
            <span className="text-slate-900">System Check</span>
            <span className="text-slate-400">Interview</span>
          </div>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 w-[90%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Check</h1>
              <p className="text-sm text-slate-500">Please make sure everything is ready before starting your interview.</p>
            </div>
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
          </div>

          <div className="p-8">
            
            {/* Checklist Section */}
            <div className="border border-slate-200 rounded-xl mb-8 overflow-hidden">
              <CheckItem 
                icon={Camera} 
                label="Camera Access" 
                status={cameraStatus} 
                errorText="Camera access denied. Please allow permissions." 
              />
              <CheckItem 
                icon={Mic} 
                label="Microphone Access" 
                status={micStatus} 
                errorText="Microphone access denied or not found." 
              />
              <CheckItem 
                icon={FileCheck} 
                label="Resume Verification" 
                status={resumeStatus} 
                errorText="Invalid resume format." 
              />
              <div className="flex items-center justify-between p-4 bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Interview Environment</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ensure you are in a quiet environment</p>
                  </div>
                </div>
                <div className="text-sm text-slate-400 italic">Self-check</div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex items-start">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5 mr-4" size={24} />
              <div>
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">Interview Rules</h3>
                <ul className="space-y-1 text-sm text-amber-800/80 list-disc list-inside">
                  <li>Camera must remain <strong>ON</strong> during the entire interview.</li>
                  <li>Answers cannot be edited once submitted.</li>
                  <li>The system monitors focus; switching tabs may be flagged.</li>
                  <li>Interview may end automatically if performance benchmarks are not met.</li>
                </ul>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-4 border-t border-slate-100">
              {errorMsg && (
                <p className="text-sm font-medium text-red-600 flex items-center bg-red-50 px-4 py-2 rounded-full">
                  <XCircle size={16} className="mr-2" />
                  {errorMsg}
                </p>
              )}
              <Button 
                onClick={onStart} 
                disabled={!allChecksPassed}
                className="w-full sm:w-auto min-w-[200px] text-lg py-4"
              >
                {allChecksPassed ? 'Start Interview' : 'Checking Systems...'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};