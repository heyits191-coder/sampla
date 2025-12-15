import React from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-500">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Invest in your career.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-400">
          Cheaper than a rejected offer letter. Choose the plan that fits your ambition.
        </p>
        
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            
            {/* Free */}
            <div className="rounded-3xl p-8 ring-1 ring-slate-800 bg-slate-900/50">
                <h3 className="text-lg font-semibold leading-8 text-white">Starter</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">For casual practice.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">$0</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> 1 AI Interview / Month</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Basic Score</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Resume parsing</li>
                </ul>
                <a href="#" className="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-emerald-500 ring-1 ring-inset ring-emerald-500/20 hover:ring-emerald-500/30">Get Started</a>
            </div>

            {/* Pro */}
            <div className="rounded-3xl p-8 ring-1 ring-emerald-500 bg-slate-900 relative">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                <h3 className="text-lg font-semibold leading-8 text-white">Pro</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">For serious job seekers.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">$19</span>
                  <span className="text-sm font-semibold leading-6 text-slate-400">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Unlimited AI Interviews</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Deep Analytics Reports</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Friend Mock Supervisor</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Interview History</li>
                </ul>
                <a href="#" className="mt-8 block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Subscribe</a>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl p-8 ring-1 ring-slate-800 bg-slate-900/50">
                <h3 className="text-lg font-semibold leading-8 text-white">Placement Prep</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">For Colleges & Institutes.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">$99</span>
                  <span className="text-sm font-semibold leading-6 text-slate-400">/one-time</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> 6-Month Access Pass</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Industry Specific Panels</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-emerald-500" /> Priority Support</li>
                </ul>
                <a href="#" className="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-emerald-500 ring-1 ring-inset ring-emerald-500/20 hover:ring-emerald-500/30">Contact Sales</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
