import React from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

interface PaymentSuccessProps {
  onReturnHome: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h1>
        <p className="text-slate-500 mb-8">
           Your transaction has been processed securely. Your subscription is now active.
        </p>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-8 text-left">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500 uppercase font-bold">Status</span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                 <ShieldCheck size={12} /> Verified
              </span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 uppercase font-bold">Transaction ID</span>
              <span className="text-xs font-mono text-slate-900">TXN_{Math.floor(Math.random() * 1000000)}</span>
           </div>
        </div>

        <Button fullWidth onClick={onReturnHome} className="h-12">
           Return to Dashboard <ArrowRight size={18} className="ml-2" />
        </Button>

      </div>
    </div>
  );
};