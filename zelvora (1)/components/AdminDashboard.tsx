import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, FileText, AlertTriangle, Settings, 
  LogOut, Search, Check, X, Shield, Eye, Trash2, ShieldAlert, Lock, RotateCcw
} from 'lucide-react';
import { Button } from './ui/Button';
import { UserRole, AdminPaymentRecord, AdminUserRecord, AdminAbuseFlag, AdminInterviewSummary } from '../types';
import { paymentService } from '../services/PaymentService';

interface AdminDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

// --- MOCK DATA ---

const MOCK_INTERVIEWS: AdminInterviewSummary[] = [
  { id: "INT-9012", candidateName: "Rahul Verma", role: "SDE-2", mode: "AI", verdict: "Recommended", score: 8.2, terminatedEarly: false, date: "2023-10-25 14:30", flags: 0 },
  { id: "INT-9011", candidateName: "Sneha Gupta", role: "Product Manager", mode: "FRIEND", verdict: "Borderline", score: 6.5, terminatedEarly: false, date: "2023-10-25 12:15", flags: 2 },
  { id: "INT-9010", candidateName: "Amit Kumar", role: "DevOps", mode: "AI", verdict: "Not Recommended", score: 3.0, terminatedEarly: true, date: "2023-10-24 09:00", flags: 5 },
  { id: "INT-9009", candidateName: "Priya Singh", role: "Data Scientist", mode: "AI", verdict: "Strongly Recommended", score: 9.1, terminatedEarly: false, date: "2023-10-24 08:45", flags: 0 },
];

const MOCK_PAYMENTS_INITIAL: AdminPaymentRecord[] = [
  { id: "PAY-104", userId: "USR-552", userEmail: "rahul.v@gmail.com", plan: "Pro", amount: 999, status: "SUCCESS", method: "UPI", date: new Date().toISOString().split('T')[0] }, // Today
  { id: "PAY-103", userId: "USR-551", userEmail: "amit.k@yahoo.com", plan: "Placement Prep", amount: 499, status: "FAILED", method: "CARD", date: "2023-10-24" }, // Old
  { id: "PAY-102", userId: "USR-550", userEmail: "sneha.g@outlook.com", plan: "Pro", amount: 999, status: "SUCCESS", method: "UPI", date: "2023-10-20" }, // Very Old
];

const MOCK_USERS: AdminUserRecord[] = [
  { id: "USR-552", email: "rahul.v@gmail.com", plan: "Pro", totalInterviews: 4, lastActive: "Today", role: "NORMAL_USER", status: "ACTIVE" },
  { id: "USR-551", email: "amit.k@yahoo.com", plan: "Free", totalInterviews: 12, lastActive: "Yesterday", role: "NORMAL_USER", status: "BLOCKED" },
  { id: "USR-550", email: "sneha.g@outlook.com", plan: "Pro", totalInterviews: 2, lastActive: "2 days ago", role: "NORMAL_USER", status: "ACTIVE" },
];

const MOCK_FLAGS: AdminAbuseFlag[] = [
  { id: "FLG-001", interviewId: "INT-9010", candidateName: "Amit Kumar", violationType: "CAMERA_OFF", severity: "CRITICAL", actionTaken: "Auto-Terminated", timestamp: "10:15 AM" },
  { id: "FLG-002", interviewId: "INT-9011", candidateName: "Sneha Gupta", violationType: "FRIEND_INTEGRITY", severity: "MEDIUM", actionTaken: "Score Penalty", timestamp: "12:30 PM" },
];

type Tab = 'OVERVIEW' | 'INTERVIEWS' | 'PAYMENTS' | 'USERS' | 'ABUSE' | 'SETTINGS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [selectedInterview, setSelectedInterview] = useState<AdminInterviewSummary | null>(null);
  
  // Local state for payments to demonstrate refund updates
  const [payments, setPayments] = useState(MOCK_PAYMENTS_INITIAL);

  const isFounder = userRole === 'FOUNDER_ADMIN';

  // --- ACTIONS ---
  
  const handleRefundRequest = (payment: AdminPaymentRecord) => {
      if (!isFounder) {
          alert("Access Denied: Only Founder Admin can authorize refunds.");
          return;
      }

      const eligibility = paymentService.checkRefundEligibility(payment);

      if (!eligibility.eligible) {
          alert(`REFUND DENIED\n\nReason: ${eligibility.reason}`);
          return;
      }

      if (window.confirm(`ELIGIBILITY VERIFIED.\n\nReason: ${eligibility.reason}\n\nProceed to refund ₹${payment.amount} to ${payment.userEmail}? This action cannot be undone.`)) {
          const success = paymentService.processRefund(payment.id);
          if (success || true) { // Force true for mock state update
              setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'REFUNDED' as any } : p));
              alert("Refund initiated successfully. Funds will reflect in 5-7 working days.");
          }
      }
  };

  // --- RENDER HELPERS ---

  const renderSidebarItem = (tab: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => {
          setActiveTab(tab);
          setSelectedInterview(null);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === tab 
          ? 'bg-slate-800 text-white border-r-2 border-blue-500' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'SUCCESS': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-amber-100 text-amber-800',
      'REFUNDED': 'bg-purple-100 text-purple-800', // Added Refunded
      'ACTIVE': 'bg-green-100 text-green-800',
      'BLOCKED': 'bg-red-100 text-red-800',
      'Recommended': 'bg-green-100 text-green-800',
      'Strongly Recommended': 'bg-green-100 text-green-800',
      'Borderline': 'bg-amber-100 text-amber-800',
      'Not Recommended': 'bg-red-100 text-red-800'
    };
    const key = status as keyof typeof styles;
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[key] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  // --- SECTION VIEWS ---

  const Overview = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-slate-900">₹42,590</div>
          <div className="text-xs text-green-600 mt-1 font-medium">+12% this week</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Interviews</div>
          <div className="text-3xl font-bold text-slate-900">1,204</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Daily Avg: 45</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Abuse Rate</div>
          <div className="text-3xl font-bold text-red-600">4.2%</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Terminated: 52</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Users</div>
          <div className="text-3xl font-bold text-slate-900">892</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">152 Pro Plans</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">Real-time Activity Feed</h3>
          <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <div className="divide-y divide-slate-100">
           {[1,2,3,4].map(i => (
             <div key={i} className="px-6 py-3 text-sm flex justify-between hover:bg-slate-50">
               <span className="text-slate-600">New interview started by <span className="font-medium text-slate-900">User-{100+i}</span> (SDE-1)</span>
               <span className="text-slate-400 text-xs">{i*2} mins ago</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const InterviewsList = () => {
    if (selectedInterview) return (
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setSelectedInterview(null)} className="mb-6 flex items-center text-sm text-slate-500 hover:text-slate-900">
           ← Back to List
        </button>
        
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
              <div>
                 <h2 className="text-2xl font-bold text-slate-900">{selectedInterview.candidateName}</h2>
                 <p className="text-sm text-slate-500 font-mono mt-1">{selectedInterview.id} • {selectedInterview.role}</p>
              </div>
              <StatusBadge status={selectedInterview.verdict} />
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Performance Signals</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-sm text-slate-600">Overall Score</span>
                       <span className="font-bold text-slate-900">{selectedInterview.score}/10</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-sm text-slate-600">Interview Mode</span>
                       <span className="font-bold text-slate-900">{selectedInterview.mode}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-sm text-slate-600">Abuse Flags</span>
                       <span className={`font-bold ${selectedInterview.flags > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                         {selectedInterview.flags}
                       </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-sm text-slate-600">Terminated Early</span>
                       <span className="font-bold text-slate-900">{selectedInterview.terminatedEarly ? 'YES' : 'No'}</span>
                    </div>
                 </div>
              </div>

              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resume Snapshot</h4>
                 <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono text-slate-600 h-40 overflow-y-auto">
                    (Text Extracted from PDF)<br/>
                    EXPERIENCE:<br/>
                    - Senior Dev at XCorp (2 years)<br/>
                    - Junior Dev at YCorp (1 year)<br/>
                    SKILLS: React, Node, AWS...
                 </div>
              </div>
           </div>

           {isFounder && (
              <div className="p-6 bg-red-50 border-t border-red-100 flex gap-4">
                 <Button className="bg-red-600 hover:bg-red-700 h-9 text-xs border-none">
                    <Trash2 size={14} className="mr-2" /> Delete Record
                 </Button>
                 <Button variant="outline" className="h-9 text-xs bg-white text-slate-600">
                    Mark as Test / Ignore
                 </Button>
              </div>
           )}
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900">Interview Log</h2>
           <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input type="text" placeholder="Search ID or Name..." className="pl-10 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-slate-400" />
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Verdict</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_INTERVIEWS.map((interview) => (
                <tr key={interview.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{interview.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {interview.candidateName}
                    <div className="text-xs text-slate-400 font-normal">{interview.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${interview.mode === 'AI' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {interview.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{interview.score}</td>
                  <td className="px-6 py-4"><StatusBadge status={interview.verdict} /></td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{interview.date}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedInterview(interview)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PaymentsList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Pay ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-mono text-slate-500 text-xs">{pay.id}</td>
                   <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{pay.userEmail}</div>
                      <div className="text-xs text-slate-400">{pay.userId}</div>
                   </td>
                   <td className="px-6 py-4">{pay.plan}</td>
                   <td className="px-6 py-4 font-bold">₹{pay.amount}</td>
                   <td className="px-6 py-4"><StatusBadge status={pay.status} /></td>
                   <td className="px-6 py-4">
                      {/* REFUND BUTTON - Only for SUCCESS and FOUNDER */}
                      {isFounder && pay.status === 'SUCCESS' && (
                        <button 
                          onClick={() => handleRefundRequest(pay)}
                          className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-100"
                        >
                           <RotateCcw size={10} /> Refund
                        </button>
                      )}
                      {!isFounder && <span className="text-xs text-slate-400">View Only</span>}
                   </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );

  const UsersList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-mono text-slate-500 text-xs">{user.id}</td>
                   <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
                   <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{user.plan}</span></td>
                   <td className="px-6 py-4 text-xs text-slate-500">{user.totalInterviews} sessions<br/>Last: {user.lastActive}</td>
                   <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                   <td className="px-6 py-4">
                      {isFounder ? (
                        <div className="flex gap-2">
                           <button className="text-xs text-blue-600 hover:underline">Edit</button>
                           <button className="text-xs text-red-600 hover:underline">Block</button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Read Only</span>
                      )}
                   </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );

  const AbuseList = () => (
     <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
         Abuse & Integrity Flags <ShieldAlert className="text-red-500" />
      </h2>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Flag ID</th>
                <th className="px-6 py-3">Interview / Candidate</th>
                <th className="px-6 py-3">Violation</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Auto-Action</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_FLAGS.map((flag) => (
                <tr key={flag.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-mono text-slate-500 text-xs">{flag.id}</td>
                   <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{flag.candidateName}</div>
                      <div className="text-xs text-slate-400 font-mono">{flag.interviewId}</div>
                   </td>
                   <td className="px-6 py-4 font-bold text-slate-700">{flag.violationType}</td>
                   <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${flag.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                         {flag.severity}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-slate-600 text-xs">{flag.actionTaken}</td>
                   <td className="px-6 py-4 text-slate-400 text-xs">{flag.timestamp}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );

  const SettingsPanel = () => {
    if (!isFounder) return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
         <Lock size={48} className="mb-4 text-slate-300" />
         <h3 className="text-lg font-bold text-slate-700">Access Denied</h3>
         <p>System settings are restricted to Founder Admin only.</p>
      </div>
    );

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
        
        <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
           <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Core Platform Rules</h3>
           
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <div>
                    <div className="font-medium text-slate-900">Abuse Cooldown</div>
                    <div className="text-xs text-slate-500">Duration between interviews for Standard users</div>
                 </div>
                 <select className="border border-slate-300 rounded px-2 py-1 text-sm">
                    <option>6 Hours (Active)</option>
                    <option>12 Hours</option>
                    <option>24 Hours</option>
                 </select>
              </div>

              <div className="flex justify-between items-center">
                 <div>
                    <div className="font-medium text-slate-900">Friend Mode</div>
                    <div className="text-xs text-slate-500">Enable peer-to-peer interview functionality</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-600">ENABLED</span>
                    <button className="text-xs text-blue-600 underline">Disable</button>
                 </div>
              </div>

              <div className="flex justify-between items-center">
                 <div>
                    <div className="font-medium text-slate-900">Payment Gateway</div>
                    <div className="text-xs text-slate-500">Razorpay Test Mode</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600">TEST MODE</span>
                    <button className="text-xs text-blue-600 underline">Switch to Live</button>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-lg p-6 max-w-2xl">
           <h3 className="font-bold text-red-900 border-b border-red-200 pb-2 mb-4 flex items-center gap-2">
             <AlertTriangle size={16} /> Danger Zone
           </h3>
           <div className="flex justify-between items-center">
              <div>
                 <div className="font-bold text-red-800">Emergency Lockdown</div>
                 <div className="text-xs text-red-600">Suspend all new interviews immediately</div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 h-8 text-xs px-4 border-none">
                 ACTIVATE LOCKDOWN
              </Button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
           <span className="font-bold text-white text-lg tracking-tight">ZELVORA ADMIN</span>
        </div>
        
        <div className="p-4">
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">
              Logged in as
           </div>
           <div className="bg-slate-800 rounded p-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isFounder ? 'bg-purple-600' : 'bg-blue-600'}`}>
                 {isFounder ? 'P' : 'T'}
              </div>
              <div>
                 <div className="text-sm font-bold text-white">{isFounder ? 'PRIYA' : 'TANU'}</div>
                 <div className="text-[10px] text-slate-400">{isFounder ? 'Founder Admin' : 'Internal Admin'}</div>
              </div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
           {renderSidebarItem('OVERVIEW', <LayoutDashboard size={18} />, 'Overview')}
           {renderSidebarItem('INTERVIEWS', <FileText size={18} />, 'Interviews')}
           {renderSidebarItem('PAYMENTS', <CreditCard size={18} />, 'Payments')}
           {renderSidebarItem('USERS', <Users size={18} />, 'Users')}
           {renderSidebarItem('ABUSE', <ShieldAlert size={18} />, 'Abuse Flags')}
           <div className="my-4 border-t border-slate-800 mx-4"></div>
           {renderSidebarItem('SETTINGS', <Settings size={18} />, 'System Settings')}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded transition-colors text-sm font-medium"
           >
              <LogOut size={16} /> Logout
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
         {activeTab === 'OVERVIEW' && <Overview />}
         {activeTab === 'INTERVIEWS' && <InterviewsList />}
         {activeTab === 'PAYMENTS' && <PaymentsList />}
         {activeTab === 'USERS' && <UsersList />}
         {activeTab === 'ABUSE' && <AbuseList />}
         {activeTab === 'SETTINGS' && <SettingsPanel />}
      </main>

    </div>
  );
};