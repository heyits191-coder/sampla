import React from 'react';
import { Download, ArrowLeft, Lock, CheckCircle, AlertTriangle, Shield, Calendar, Briefcase } from 'lucide-react';
import { Button } from './ui/Button';
import { UserRole, UserPlan, InterviewReportData } from '../types';

interface InterviewReportProps {
  onBack: () => void;
  userRole: UserRole;
  userPlan: UserPlan;
  data?: InterviewReportData | null;
}

// Mock Data for Simulation (Fallback)
const MOCK_REPORT: InterviewReportData = {
  meta: {
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    role: "Senior Frontend Engineer",
    type: "AI HR Assessment",
    duration: "42:15"
  },
  verdict: "Recommended",
  summary: "The candidate demonstrates strong technical competence and clear communication. While there were minor gaps in system design depth, the overall profile aligns well with the senior engineering requirements.",
  scores: [
    { label: "Technical Proficiency", value: 8.5, comment: "Strong grasp of React internals and state management." },
    { label: "Communication", value: 9.0, comment: "Articulate, concise, and structured responses." },
    { label: "Problem Solving", value: 7.5, comment: "Good analytical approach, though optimization was missed initially." },
    { label: "Behavioral Fit", value: 8.0, comment: "Demonstrates leadership potential and conflict resolution skills." }
  ],
  strengths: [
    "Excellent clarity when explaining complex technical concepts.",
    "Maintained professional composure under pressure questions.",
    "Provided concrete examples (STAR method) for behavioral questions."
  ],
  weaknesses: [
    "Struggled slightly with low-level system design trade-offs.",
    "Could improve on asking clarifying questions before jumping to solutions."
  ],
  behavioral: {
    eyeContact: "Consistent (90%)",
    tone: "Professional & confident",
    energy: "High"
  },
  simulationOutcome: "In a real corporate setting, this candidate would likely progress to the final Hiring Manager round."
};

export const InterviewReport: React.FC<InterviewReportProps> = ({ onBack, userRole, userPlan, data }) => {
  const isPrivileged = userRole === 'POWER_CANDIDATE' || userRole === 'FOUNDER_ADMIN';
  const isPaid = userPlan !== 'Free';
  const canViewFullReport = isPaid || isPrivileged;

  const report = data || MOCK_REPORT;
  
  // Calculate Overall Score
  const overallScore = report.scores.length > 0 
    ? (report.scores.reduce((acc, curr) => acc + curr.value, 0) / report.scores.length).toFixed(1)
    : "N/A";

  // Determine verdict color
  const getVerdictStyles = (status: string) => {
    switch (status) {
      case "Strongly Recommended": return "bg-green-100 text-green-800 border-green-200";
      case "Recommended": return "bg-blue-50 text-blue-800 border-blue-200";
      case "Borderline": return "bg-amber-50 text-amber-800 border-amber-200";
      default: return "bg-red-50 text-red-800 border-red-200";
    }
  };

  const LockedOverlay = ({ title, message }: { title: string, message: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-10 p-6 text-center">
        <Lock className="w-8 h-8 text-slate-900 mb-2" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-4 max-w-xs">{message}</p>
        <Button onClick={() => alert("Redirect to subscription (simulated)")}>Unlock Full Report</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Actions */}
        <div className="flex justify-between items-center mb-8 no-print">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Return to Dashboard
          </button>
          {canViewFullReport && (
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} /> Download PDF
              </Button>
          )}
        </div>

        {/* Report Container */}
        <div className="bg-white shadow-xl rounded-none border border-slate-200 print:shadow-none print:border-none">
          
          {/* SECTION 1: HEADER */}
          <header className="border-b-2 border-slate-900 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight uppercase mb-1">Zelvora</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Official Evaluation Report</div>
            </div>
            <div className="text-right space-y-1 text-sm text-slate-600">
              <div className="flex items-center justify-end gap-2">
                <Briefcase size={14} /> {report.meta.role}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Shield size={14} /> {report.meta.type}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Calendar size={14} /> {report.meta.date}
              </div>
            </div>
          </header>

          <div className="p-8 md:p-12 space-y-12">

            {/* SECTION 2: FINAL VERDICT (Always Visible) */}
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">01 // Final Verdict</h2>
              <div className={`p-6 border-l-4 ${getVerdictStyles(report.verdict)}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{report.verdict}</h3>
                        <p className="text-base leading-relaxed opacity-90 max-w-2xl">
                        {report.summary}
                        </p>
                    </div>
                    {/* Overall Score - Visible to Free Users */}
                    <div className="bg-white/50 p-4 rounded-lg text-center border border-current ml-4 min-w-[100px]">
                        <div className="text-3xl font-bold">{overallScore}</div>
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Overall</div>
                    </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: SCORECARD (Locked for Free) */}
            <section className="relative">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">02 // Performance Scorecard</h2>
              <div className={`space-y-6 ${!canViewFullReport ? 'blur-sm select-none opacity-50' : ''}`}>
                {report.scores.map((item, idx) => (
                  <div key={idx} className="grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 font-semibold text-slate-800 text-sm">{item.label}</div>
                    <div className="md:col-span-4">
                      <div className="h-3 w-full bg-slate-100 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-slate-800" 
                          style={{ width: `${item.value * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="md:col-span-1 font-mono text-sm font-bold text-slate-900 text-right">{item.value}/10</div>
                    <div className="md:col-span-4 text-xs text-slate-500 italic border-l border-slate-200 pl-3">
                      {item.comment}
                    </div>
                  </div>
                ))}
              </div>
              {!canViewFullReport && <LockedOverlay title="Scorecard Locked" message="Detailed scoring is available on Pro plan." />}
            </section>

            {/* SECTION 4 & 5: STRENGTHS & WEAKNESSES (Locked for Free) */}
            <section className="grid md:grid-cols-2 gap-12 relative">
               <div className={`space-y-3 ${!canViewFullReport ? 'blur-sm select-none opacity-50' : ''}`}>
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">03 // Key Strengths</h2>
                 <ul className="space-y-3">
                  {report.strengths.map((point, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 mr-3 shrink-0" />
                      {point}
                    </li>
                  ))}
                 </ul>
               </div>
               <div className={`space-y-3 ${!canViewFullReport ? 'blur-sm select-none opacity-50' : ''}`}>
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">04 // Areas of Concern</h2>
                 <ul className="space-y-3">
                  {report.weaknesses.map((point, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 mr-3 shrink-0" />
                      {point}
                    </li>
                  ))}
                 </ul>
               </div>
               {!canViewFullReport && <LockedOverlay title="Analysis Locked" message="Upgrade to see what you did right and where you failed." />}
            </section>

            {/* SECTION 6: BEHAVIORAL OBSERVATIONS (Locked for Free) */}
            <section className="bg-slate-50 p-6 border border-slate-200 relative">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">05 // Behavioral Metrics</h2>
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 ${!canViewFullReport ? 'blur-sm select-none opacity-50' : ''}`}>
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Eye Contact</div>
                  <div className="font-semibold text-slate-900">{report.behavioral.eyeContact}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Tone</div>
                  <div className="font-semibold text-slate-900">{report.behavioral.tone}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Energy</div>
                  <div className="font-semibold text-slate-900">{report.behavioral.energy}</div>
                </div>
              </div>
              {!canViewFullReport && <LockedOverlay title="Behavioral Data Locked" message="Eye contact and presence analysis is premium only." />}
            </section>

             {/* SECTION 8: SIMULATION OUTCOME (Locked for Free) */}
             <section className="relative">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">06 // Simulated Outcome</h2>
              <div className={`bg-white border-l-4 border-slate-800 pl-6 py-2 ${!canViewFullReport ? 'blur-sm select-none opacity-50' : ''}`}>
                <p className="text-slate-700 text-lg font-medium leading-relaxed italic">
                  "{report.simulationOutcome}"
                </p>
              </div>
              {!canViewFullReport && <LockedOverlay title="Outcome Locked" message="See your predicted hiring probability." />}
            </section>

          </div>

          <footer className="bg-slate-50 border-t border-slate-200 p-8 text-center text-xs text-slate-500">
            <p className="mb-2">This report is generated by Zelvora's AI Assessment Engine.</p>
            <p>Zelvora Inc. &copy; {new Date().getFullYear()} | Confidential Evaluation Document</p>
          </footer>

        </div>
      </div>
    </div>
  );
};