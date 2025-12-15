import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Chrome, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface AuthProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex min-h-[600px]">
        {/* Left Side - Visual (Desktop only) */}
        <div className="hidden lg:flex w-5/12 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">ZELVORA</h2>
            <p className="text-slate-400 text-sm tracking-widest uppercase">Interview Intelligence Platform</p>
          </div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-light leading-relaxed">
              "Confidence comes from experience. We provide the experience."
            </h3>
            <div className="flex gap-2">
               <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
               <div className="h-1 w-2 bg-slate-700 rounded-full"></div>
               <div className="h-1 w-2 bg-slate-700 rounded-full"></div>
            </div>
          </div>

          {/* Abstract Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-900 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <button 
              onClick={onBack}
              className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </button>
            <div className="lg:hidden text-xl font-bold text-slate-900">ZELVORA</div>
          </div>

          <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-slate-500">
                {isLogin ? 'Enter your details to access your dashboard.' : 'Start your professional interview journey today.'}
              </p>
            </div>

            {/* Google Login */}
            <button 
              onClick={onLoginSuccess}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-md hover:bg-slate-50 transition-colors mb-6"
            >
              <Chrome size={20} />
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              onLoginSuccess();
            }}>
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button fullWidth>{isLogin ? 'Login' : 'Create Account'}</Button>
              </div>
            </form>

            <div className="mt-6 text-center space-y-4">
               <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
              
              <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 border border-slate-100">
                Login is required to start an interview and access reports.
              </div>
            </div>

          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <Lock size={12} />
              Your data is secure. Interviews are private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};