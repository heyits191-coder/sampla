import React from 'react';
import { ArrowLeft, ShieldAlert, Clock, FileCheck, Ban } from 'lucide-react';
import { Button } from './ui/Button';

interface RefundPolicyProps {
  onBack: () => void;
}

export const RefundPolicy: React.FC<RefundPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Refund & Cancellation Policy</h1>
            <p className="text-sm text-slate-500">Last Updated: October 2023</p>
          </div>
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 text-slate-700 leading-relaxed">
          
          {/* Core Principle */}
          <section className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <ShieldAlert size={18} /> Digital Services Policy
            </h3>
            <p className="text-sm text-blue-800">
              ZELVORA provides digital evaluation services and generated reports. 
              <strong> Once a paid interview report is accessed or an interview is conducted under a paid plan, the service is considered consumed.</strong>
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide text-xs">01 // Refund Eligibility</h2>
            <p className="mb-4 text-sm">
              We offer refunds only under specific conditions to ensure fairness. You are eligible for a refund ONLY if:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckIcon className="text-green-600 shrink-0 mt-0.5" />
                <span>The payment was successfully processed.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="text-green-600 shrink-0 mt-0.5" />
                <span>You have <strong>NOT</strong> accessed any paid interview report or detailed analysis.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="text-green-600 shrink-0 mt-0.5" />
                <span>You have <strong>NOT</strong> conducted any interview session under the paid plan.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="text-green-600 shrink-0 mt-0.5" />
                <span>The refund request is raised within <strong>24 hours</strong> of the transaction.</span>
              </li>
            </ul>
          </section>

          {/* Non-Refundable */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide text-xs">02 // Non-Refundable Cases</h2>
            <p className="mb-4 text-sm">
              Refunds will be strictly denied in the following scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded bg-slate-50 flex gap-3 items-start">
                 <Ban className="text-red-500 shrink-0 mt-1" size={18} />
                 <div>
                   <h4 className="font-bold text-slate-900 text-sm">Service Consumed</h4>
                   <p className="text-xs text-slate-500 mt-1">If you unlocked a detailed scorecard or viewed history.</p>
                 </div>
              </div>
              <div className="border border-slate-200 p-4 rounded bg-slate-50 flex gap-3 items-start">
                 <Clock className="text-red-500 shrink-0 mt-1" size={18} />
                 <div>
                   <h4 className="font-bold text-slate-900 text-sm">Time Limit Exceeded</h4>
                   <p className="text-xs text-slate-500 mt-1">Requests made after 24 hours of payment.</p>
                 </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section>
             <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide text-xs">03 // Refund Process & Timeline</h2>
             <ol className="list-decimal list-inside space-y-2 text-sm pl-2">
               <li>Raise a request via your dashboard or email support@zelvora.com.</li>
               <li>Our system automatically checks usage logs and timestamps.</li>
               <li>If eligible, the refund is initiated via the original payment method (Razorpay).</li>
               <li>Funds typically reflect in your bank account within <strong>5-7 working days</strong>.</li>
             </ol>
          </section>

          {/* Cancellation */}
          <section>
             <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide text-xs">04 // Cancellation</h2>
             <p className="text-sm mb-2">
               You may cancel your subscription renewal at any time. 
             </p>
             <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
               <li>Cancellation stops future billing.</li>
               <li>It does not generate a refund for the current billing cycle.</li>
               <li>You retain access to paid features until the end of the current cycle.</li>
             </ul>
          </section>

        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
          <Button onClick={onBack}>Return to Dashboard</Button>
        </div>

      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);