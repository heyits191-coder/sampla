import React, { useState } from 'react';
import { Check, ArrowLeft, ShieldCheck, HelpCircle, X, CreditCard, Lock, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { UserRole, UserPlan } from '../types';

interface SubscriptionProps {
  onBack: () => void;
  onUpgrade: (plan: UserPlan) => void;
  onRoleUpdate: (role: UserRole) => void;
  onNavigateToCheckout: (plan: UserPlan, amount: number) => void; // New Prop
}

export const Subscription: React.FC<SubscriptionProps> = ({ onBack, onUpgrade, onRoleUpdate, onNavigateToCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // REDIRECT LOGIC ONLY - No payment processing here
  const handlePlanSelect = (plan: UserPlan, amount: number) => {
    if (plan === 'Free') {
        onUpgrade('Free');
        onRoleUpdate('NORMAL_USER');
        alert("Plan switched to Free.");
        return;
    }
    
    // Redirect to External Checkout
    onNavigateToCheckout(plan, amount);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (code === 'PRIYA') {
      setPromoMessage({ type: 'success', text: 'Founder Access Unlocked: Unlimited privileges.' });
      onRoleUpdate('FOUNDER_ADMIN');
      onUpgrade('Placement Prep');
      setTimeout(() => alert("Founder Access Granted."), 100);
    } else if (code === 'TANU') {
      setPromoMessage({ type: 'success', text: 'Power Candidate Status: Unlimited interviews enabled.' });
      onRoleUpdate('POWER_CANDIDATE');
      onUpgrade('Placement Prep');
      setTimeout(() => alert("Power Candidate Access Granted."), 100);
    } else if (code) {
      setPromoMessage({ type: 'info', text: 'Invalid or expired promo code.' });
    } else {
      setPromoMessage({ type: 'error', text: 'Please enter a code.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Header / Nav Area */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-medium transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
             </button>
          </div>
          <div className="text-sm font-bold text-slate-900 tracking-tight">ZELVORA <span className="text-slate-400 font-normal">| Access</span></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* SECTION 1: PAGE INTRO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Choose your preparation level
          </h1>
          <p className="text-lg text-slate-600">
            We do not sell questions. We sell the detailed evaluation of your performance.
          </p>
        </div>

        {/* SECTION 2: PRICING PLANS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-start">
          
          {/* PLAN 1: FREE */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col h-full opacity-80 hover:opacity-100 transition-opacity">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Free</h3>
              <div className="mt-4 flex items-baseline text-slate-900">
                <span className="text-4xl font-bold tracking-tight">₹0</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">To experience the platform.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-slate-900 shrink-0" /> Interview access allowed
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-slate-900 shrink-0" /> See Final Verdict only
              </li>
            </ul>
            <Button variant="outline" fullWidth onClick={() => handlePlanSelect('Free', 0)}>
                Switch to Free
            </Button>
          </div>

          {/* PLAN 2: PRO */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col h-full relative">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Pro</h3>
              <div className="mt-4 flex items-baseline text-slate-900">
                <span className="text-4xl font-bold tracking-tight">₹999</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For detailed self-analysis.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-blue-600 shrink-0" /> Multiple Interviews
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-blue-600 shrink-0" /> <strong>Full Detailed Report</strong>
              </li>
            </ul>
            <Button fullWidth onClick={() => handlePlanSelect('Pro', 999)}>
                Upgrade to Pro <ExternalLink size={14} className="ml-2" />
            </Button>
          </div>

          {/* PLAN 3: PLACEMENT PREP */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-900 shadow-xl flex flex-col h-full relative text-white transform md:-translate-y-4">
             <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg mr-8">
               Best Value
             </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Placement Prep</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-bold tracking-tight">₹499</span>
                <span className="ml-1 text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Serious candidates only. Student Special.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Unlimited Interviews</strong>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Check className="w-5 h-5 text-blue-400 shrink-0" /> Full Reports + History
              </li>
            </ul>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none" fullWidth onClick={() => handlePlanSelect('Placement Prep', 499)}>
               Pay ₹499 & Upgrade <ExternalLink size={14} className="ml-2" />
            </Button>
          </div>

        </div>

        {/* SECTION 3: PROMO CODE */}
        <div className="max-w-md mx-auto mb-20">
           <div className="bg-white p-6 rounded-xl border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Access Key / Promo Code</label>
              <div className="flex gap-3">
                 <input 
                   type="text" 
                   value={promoCode}
                   onChange={(e) => setPromoCode(e.target.value)}
                   placeholder="Enter Key"
                   className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none uppercase"
                 />
                 <Button onClick={handleApplyPromo} variant="secondary">Apply</Button>
              </div>
              {promoMessage && (
                 <div className={`mt-3 text-sm font-medium p-3 rounded flex items-start gap-2 ${
                    promoMessage.type === 'success' ? 'bg-green-50 text-green-700' : 
                    promoMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                 }`}>
                    {promoMessage.type === 'success' && <ShieldCheck size={16} className="shrink-0 mt-0.5" />}
                    {promoMessage.text}
                 </div>
              )}
           </div>
        </div>

      </main>
    </div>
  );
};