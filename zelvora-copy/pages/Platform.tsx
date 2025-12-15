import React from 'react';
import { ShieldAlert, Video, Users, FileSearch, Lock } from 'lucide-react';

const Platform: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-emerald-500 tracking-wide uppercase">System Architecture</h2>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            A Complete Interview Ecosystem
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
            Three layers of preparation designed to transition you from candidate to employee.
          </p>
        </div>

        <div className="space-y-24">
          
          {/* Section 1: Gatekeeper */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-900/20 rounded-lg text-blue-500 mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">1. Pre-Interview Gatekeeper</h3>
              <p className="text-slate-400 leading-relaxed">
                Before you even speak, your resume must pass. Our system analyzes your uploaded CV against the target Job Description (JD). If the match score is below 60%, the interview is blocked—just like in a real company.
              </p>
              <ul className="space-y-3 mt-4">
                 <li className="flex items-center text-slate-300"><Lock className="h-4 w-4 mr-2 text-slate-500"/> Role Validation</li>
                 <li className="flex items-center text-slate-300"><FileSearch className="h-4 w-4 mr-2 text-slate-500"/> Keyword Analysis</li>
                 <li className="flex items-center text-slate-300"><ShieldAlert className="h-4 w-4 mr-2 text-slate-500"/> Eligibility Check</li>
              </ul>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 p-6 w-full shadow-lg">
              {/* Visual Mock of Gatekeeper */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-mono text-white">Senior Frontend Engineer</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                   <span className="text-slate-400">Resume Status:</span>
                   <span className="text-red-400 flex items-center"> <ShieldAlert className="w-3 h-3 mr-1"/> ATS Mismatch</span>
                </div>
                <div className="bg-slate-950 p-4 rounded text-xs font-mono text-red-300">
                  > ERROR: Missing keywords 'TypeScript', 'System Design'.<br/>
                  > MATCH SCORE: 42%<br/>
                  > ACCESS DENIED. PLEASE REVISE RESUME.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI HR */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
             <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-900/20 rounded-lg text-emerald-500 mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">2. AI HR Interview</h3>
              <p className="text-slate-400 leading-relaxed">
                The core of Zelvora. An autonomous AI interviewer that controls the flow. It detects hesitation, probes inconsistencies in your story, and maintains a professional corporate demeanor.
              </p>
               <ul className="space-y-3 mt-4">
                 <li className="flex items-center text-slate-300"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> Camera ON (Candidate Mandatory)</li>
                 <li className="flex items-center text-slate-300"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> Voice-First Interaction</li>
                 <li className="flex items-center text-slate-300"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> Behavioral & Technical Rounds</li>
              </ul>
            </div>
             <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 w-full aspect-video flex items-center justify-center relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                <div className="text-center z-10">
                   <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 border-2 border-emerald-500/50 flex items-center justify-center">
                     <span className="text-2xl font-bold text-slate-500">AI</span>
                   </div>
                   <p className="text-emerald-400 font-mono text-sm animate-pulse">listening...</p>
                </div>
            </div>
          </div>

          {/* Section 3: Friend Mock */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
             <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-purple-900/20 rounded-lg text-purple-500 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">3. Friend Mock (AI Supervised)</h3>
              <p className="text-slate-400 leading-relaxed">
                Invite a peer to interview you. Zelvora generates the question blueprint based on your resume, so your friend doesn't need to be an expert. The AI listens silently and grades the interviewer and the candidate.
              </p>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 p-6 w-full shadow-lg">
               <div className="flex space-x-4 mb-4">
                 <div className="flex-1 h-32 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-xs">YOU</div>
                 <div className="flex-1 h-32 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-xs">PEER</div>
               </div>
               <div className="bg-slate-950 p-3 rounded border-l-2 border-purple-500">
                  <span className="text-purple-400 text-xs uppercase font-bold tracking-wider">AI Supervisor Note</span>
                  <p className="text-slate-400 text-xs mt-1">"Interviewer missed follow-up on Project X. Candidate answer was vague regarding scalability."</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Platform;
