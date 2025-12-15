import React, { useState } from 'react';
import { Plus, History, CreditCard, Lock, User, LayoutDashboard, AlertCircle, ShieldCheck, Zap, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { UserRole, UserPlan } from '../types';

interface DashboardProps {
  onStartInterview: () => void;
  onViewReport: () => void;
  onManageSubscription: () => void;
  onLogout: () => void;
  userRole: UserRole;
  userPlan: UserPlan;
  lastInterviewTime: number | null;
}

// Mock Data
const MOCK_INTERVIEWS = [
  {
    id: "INT-8492",
    date: "Oct 24, 2023",
    type: "AI HR Assessment",
    role: "Senior Frontend Engineer",
    company: "Google",
    verdict: "Recommended",
    verdictColor: "text-green-600 bg-green-50 border-green-200"
  },
  {
    id: "INT-8491",
    date: "Oct 20, 2023",
    type: "Mock with Friend",
    role: "Product Manager",
    company: "N/A",
    verdict: "Borderline",
    verdictColor: "text-amber-600 bg-amber-50 border-amber-200"
  },
  {
    id: "INT-8490",
    date: "Oct 15, 2023",
    type: "AI HR Assessment",
    role: "Backend Developer",
    company: "Amazon",
    verdict: "Not Recommended",
    verdictColor: "text-red-600 bg-red-50 border-red-200"
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ onStartInterview, onViewReport, onManageSubscription, onLogout, userRole, userPlan, lastInterviewTime }) => {
  const [interviews] = useState(MOCK_INTERVIEWS); 

  const isPrivileged = userRole === 'POWER_CANDIDATE' || userRole === 'FOUNDER_ADMIN';
  const isAdmin = userRole === 'FOUNDER_ADMIN';
  
  // History is locked for Free users unless they have a privileged role
  const isHistoryLocked = userPlan === 'Free' && !isPrivileged;

  // STRICT 6-HOUR GAP ENFORCEMENT
  const handleStartClick = () => {
    // If Founder/Power user, bypass all checks
    if (isPrivileged) {
         console.log("[ACCESS GRANTED] Role Override (Privileged)");
         onStartInterview();
         return;
    }

    if (lastInterviewTime) {
       const msSince = Date.now() - lastInterviewTime;
       const hoursSince = msSince / (1000 * 60 * 60);
       const COOLDOWN_HOURS = 6;
       
       if (hoursSince < COOLDOWN_HOURS) {
         console.warn("[ACCESS DENIED] User cooldown enforced.");
         const remainingMinutes = Math.ceil((COOLDOWN_HOURS - hoursSince) * 60);
         const remainingHours = Math.floor(remainingMinutes / 60);
         const mins = remainingMinutes % 60;

         alert(`ABUSE PREVENTION COOLDOWN\n\nTo prevent gaming the system, you must wait ${COOLDOWN_HOURS} hours between interviews.\n\nTime remaining: ${remainingHours}h ${mins}m.\n\nUpgrade to 'Placement Prep' (Power Candidate) to bypass.`);
         return;
       }
    }
    
    console.log("[ACCESS GRANTED] Starting new interview session.");
    onStartInterview();
  };

  const getRoleBadge = () => {
      if (userRole === 'FOUNDER_ADMIN') {
          return (
              <span className="flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  <ShieldCheck size={10} /> Founder Admin
              </span>
          );
      }
      if (userRole === 'POWER_CANDIDATE') {
          return (
              <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  <Zap size={10} /> Power Candidate
              </span>
          );
      }
      return (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${userPlan === 'Free' ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white'}`}>
            {userPlan} Plan
        </span>
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SECTION 1: DASHBOARD HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-bold text-xl tracking-tight text-slate-900">ZELVORA</div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-sm font-medium text-slate-500 hidden sm:flex items-center gap-2">
              <LayoutDashboard size={16} /> Dashboard
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">Candidate</span>
              {getRoleBadge()}
            </div>
            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
              <User size={16} />
            </div>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-red-600 transition-colors p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Admin Dashboard Area (Visual Only) */}
        {isAdmin && (
            <div className="mb-12 p-6 bg-slate-900 rounded-xl text-white shadow-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-purple-400" />
                    <h3 className="font-bold text-lg">Admin Override Controls</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-800 rounded border border-slate-700 text-xs">
                        <span className="block text-slate-400 mb-1">Users Online</span>
                        <span className="text-xl font-bold">1,240</span>
                    </div>
                    <div className="p-3 bg-slate-800 rounded border border-slate-700 text-xs">
                        <span className="block text-slate-400 mb-1">Resume Queue</span>
                        <span className="text-xl font-bold text-green-400">Clear</span>
                    </div>
                </div>
            </div>
        )}

        {/* SECTION 2: QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Action 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Start New Interview</h3>
            <p className="text-sm text-slate-500 mb-6">Begin a new AI assessment or peer mock session.</p>
            <Button fullWidth onClick={handleStartClick}>Start Interview</Button>
          </div>

          {/* Action 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center mb-4">
              <History size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interview History</h3>
            <p className="text-sm text-slate-500 mb-6">Review past performance and track progress.</p>
            <Button variant="outline" fullWidth onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}>
              View History
            </Button>
          </div>

          {/* Action 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Subscription</h3>
            <p className="text-sm text-slate-500 mb-6">Current Plan: <strong>{userPlan}</strong></p>
            <Button variant="outline" fullWidth onClick={onManageSubscription}>
              {userPlan === 'Free' ? 'Upgrade Plan' : 'Manage Plan'}
            </Button>
          </div>
        </div>

        {/* SECTION 5: RULE NOTICE */}
        {!isPrivileged && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-12 flex items-start gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-800 font-medium">
                Abuse Prevention: You must wait 6 hours between interviews. Upgrade to bypass cooldowns.
            </p>
            </div>
        )}

        {/* SECTION 3: INTERVIEW HISTORY LIST */}
        <div id="history" className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Your Interview History</h2>
          </div>

          {isHistoryLocked ? (
            /* LOCKED STATE FOR FREE USERS */
            <div className="text-center py-20 bg-slate-100 rounded-xl border border-slate-200 border-dashed relative overflow-hidden">
               <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                   <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <Lock size={32} className="text-slate-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">History is Locked</h3>
                   <p className="text-slate-600 mb-6 max-w-sm">
                     Upgrade to <strong>Pro</strong> or <strong>Placement Prep</strong> to access your past interview reports, scores, and analytics.
                   </p>
                   <Button onClick={onManageSubscription}>Unlock Interview History</Button>
               </div>
               {/* Visual Fake Data behind blur */}
               <div className="opacity-20 blur-sm pointer-events-none select-none">
                 <div className="space-y-4 px-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-white rounded-lg border border-slate-300 w-full"></div>
                    ))}
                 </div>
               </div>
            </div>
          ) : (
             /* UNLOCKED STATE */
             interviews.length === 0 ? (
                /* EMPTY STATE */
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <LayoutDashboard size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No interviews yet</h3>
                  <p className="text-slate-500 mb-6">Complete your first interview to see analytics here.</p>
                  <Button onClick={handleStartClick}>Start Your First Interview</Button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Verdict</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {interviews.map((interview) => (
                          <tr key={interview.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                              {interview.date}
                            </td>
                            <td className="px-6 py-4 text-slate-900">
                              <div className="flex items-center gap-2">
                                {interview.type.includes('AI') ? <Shield size={14} className="text-slate-400"/> : <User size={14} className="text-slate-400"/>}
                                {interview.type}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">{interview.role}</span>
                                <span className="text-xs text-slate-400">{interview.company}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${interview.verdictColor}`}>
                                {interview.verdict}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button 
                                variant="outline" 
                                className="py-1.5 px-3 text-xs h-auto"
                                onClick={onViewReport}
                              >
                                View Report
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          )}
        </div>

      </div>
    </div>
  );
};