import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, Smartphone, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { UserPlan } from '../types';

interface CheckoutProps {
  plan: UserPlan;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ plan, amount, onSuccess, onCancel }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  
  // In a real Next.js app, we would fetch the order ID from the API
  const fetchOrderId = async () => {
    // SIMULATION: In production, this fetch call goes to /api/create-order
    // const res = await fetch('/api/create-order', { method: 'POST', body: JSON.stringify({ plan, amount }) });
    // const data = await res.json();
    // return data.id;
    
    // Simulating server delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return `order_${Math.random().toString(36).substring(7)}`; 
  };

  const handlePay = async () => {
    setIsInitializing(true);

    try {
      const orderId = await fetchOrderId();

      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Public Key is safe to expose
        amount: amount * 100,
        currency: "INR",
        name: "ZELVORA INC.",
        description: `Upgrade to ${plan} Plan`,
        image: "https://ui-avatars.com/api/?name=Zelvora&background=0f172a&color=fff",
        order_id: orderId, // Secure order ID from server
        handler: function (response: any) {
           console.log("Payment Verified:", response);
           onSuccess();
        },
        prefill: {
            name: "Candidate User",
            email: "user@example.com",
            contact: "9999999999"
        },
        theme: {
            color: "#0f172a"
        },
        modal: {
            ondismiss: () => setIsInitializing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (e) {
      console.error("Checkout Error", e);
      setIsInitializing(false);
      alert("Unable to initiate secure payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Secure Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-slate-900 font-bold tracking-tight">
           <ShieldCheck size={20} className="text-green-600" />
           <span className="text-sm">pay.zelvora.com</span>
           <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-200">SECURE</span>
        </div>
        <button onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900">
           Cancel
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
             
             {/* Order Summary */}
             <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
                 <div className="relative z-10">
                     <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Total Amount</p>
                     <div className="text-4xl font-bold tracking-tight">₹{amount}</div>
                     <p className="text-slate-400 text-sm mt-2 flex items-center justify-center gap-1">
                        <Lock size={12} /> Encrypted Transaction
                     </p>
                 </div>
                 {/* Decor */}
                 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
                 <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-20"></div>
             </div>

             <div className="p-8">
                 <div className="mb-8">
                     <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Details</h2>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                         <span className="text-sm text-slate-600">Product</span>
                         <span className="text-sm font-medium text-slate-900">Zelvora {plan}</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                         <span className="text-sm text-slate-600">Validity</span>
                         <span className="text-sm font-medium text-slate-900">30 Days</span>
                     </div>
                 </div>

                 {/* Methods */}
                 <div className="space-y-3 mb-8">
                     <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 opacity-80">
                         <Smartphone size={20} className="text-slate-600" />
                         <span className="text-sm font-medium text-slate-700">UPI / Google Pay</span>
                     </div>
                     <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 opacity-80">
                         <CreditCard size={20} className="text-slate-600" />
                         <span className="text-sm font-medium text-slate-700">Cards (Visa/Mastercard)</span>
                     </div>
                 </div>

                 <Button 
                    fullWidth 
                    onClick={handlePay} 
                    disabled={isInitializing}
                    className="h-12 bg-green-600 hover:bg-green-700 border-none text-white shadow-lg shadow-green-900/10"
                 >
                    {isInitializing ? (
                        <>
                           <Loader2 className="animate-spin mr-2" size={18} /> Processing...
                        </>
                    ) : (
                        `Pay ₹${amount} Securely`
                    )}
                 </Button>

                 <div className="mt-6 text-center">
                     <p className="text-[10px] text-slate-400">
                        Powered by Razorpay. 
                        Your card details are not stored on our servers.
                     </p>
                 </div>
             </div>
         </div>
      </main>

      <footer className="py-6 text-center border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-400">© 2024 Zelvora Payments. All rights reserved.</p>
      </footer>

    </div>
  );
};