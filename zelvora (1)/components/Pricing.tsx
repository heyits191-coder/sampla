import React from 'react';
import { Check } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { Button } from './ui/Button';

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Limited evaluation access", "Standard experience", "Basic verdict"],
    cta: "Start Evaluation",
    highlight: false
  },
  {
    name: "Placement Prep",
    price: "₹499",
    features: ["Standard evaluation protocol", "Full session access", "Detailed scoring", "Priority Queue"],
    cta: "Get Access",
    highlight: true
  },
  {
    name: "Pro",
    price: "₹999",
    features: ["Unlimited evaluation access", "Full HR reports", "Session history", "Deep analytics"],
    cta: "Go Pro",
    highlight: false
  }
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Evaluation Access" 
          subtitle="Select your tier to access the evaluation engine."
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-8 bg-white rounded-none border ${
                plan.highlight ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm mr-6">
                  Standard
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-slate-900">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.price !== "₹0" && <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>}
                </div>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-slate-900 shrink-0" />
                    <span className="ml-3 text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlight ? 'primary' : 'outline'} 
                fullWidth
                className="rounded-none uppercase text-xs font-bold tracking-widest"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            * Subscription is required to access detailed reports and full interview history.
          </p>
        </div>
      </div>
    </section>
  );
};