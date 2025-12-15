import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown, Search, X, Monitor, Mic, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole } from '../types';

export interface InterviewContextData {
  name?: string;
  role: string;
  experience: string;
  goal: string;
  company: string;
  mode: 'ai' | 'peer';
  resumeName?: string;
  resumeBase64?: string;
  resumeText?: string;
  validationFlags?: string[];
}

interface PreInterviewSetupProps {
  onBack: () => void;
  onStart: (data: InterviewContextData) => void;
  userRole: UserRole;
}

const ROLES = [
  { category: 'IT & Engineering', roles: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'QA Engineer'] },
  { category: 'Data & Analytics', roles: ['Data Scientist', 'Data Analyst', 'Business Analyst', 'Machine Learning Engineer'] },
  { category: 'Product & Design', roles: ['Product Manager', 'UX/UI Designer', 'Product Designer'] },
  { category: 'Business & Management', roles: ['Project Manager', 'Business Development Executive', 'Operations Manager'] },
  { category: 'Marketing', roles: ['Digital Marketer', 'Content Strategist', 'Social Media Manager'] },
  { category: 'HR', roles: ['HR Manager', 'Talent Acquisition Specialist'] },
];

const GOALS = [
  "Placement preparation",
  "Company interview practice",
  "Confidence building",
  "Communication improvement",
  "Technical interview practice",
  "HR round practice",
  "Career switch preparation",
  "First interview experience",
  "Internship interview",
  "Re-attempt after rejection"
];

export const PreInterviewSetup: React.FC<PreInterviewSetupProps> = ({ onBack, onStart, userRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    goal: '',
    company: '',
    mode: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeSummary, setResumeSummary] = useState<string>('');
  const [resumeStatus, setResumeStatus] = useState<'idle' | 'validating' | 'valid' | 'warning' | 'invalid'>('idle');
  const [validationMsg, setValidationMsg] = useState<string>('');
  const [validationFlags, setValidationFlags] = useState<string[]>([]);
  
  const [roleSearch, setRoleSearch] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = userRole === 'FOUNDER_ADMIN';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
    setRoleSearch(role);
    setIsRoleDropdownOpen(false);
    // Reset resume if role changes as validation depends on it
    if (resume) {
       setResume(null);
       setResumeStatus('idle');
       setValidationMsg('');
       setResumeSummary('');
    }
  };

  const validateResume = async (file: File) => {
    if (!formData.role || !formData.experience) {
       setResumeStatus('invalid');
       setValidationMsg("Please select a Job Role and Experience Level before uploading your resume.");
       setResume(null);
       return;
    }

    setResumeStatus('validating');
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Convert to Base64
        const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        setResumeBase64(base64Data);

        const systemInstruction = `
You are ZELVORA Resume Validation Engine.
Your role is to decide whether a resume is suitable for the selected interview role.
You are strict like an ATS. You protect interview quality.

INPUTS:
- Selected job role
- Experience level (Fresher / Mid-level / Experienced)
- Resume (PDF)

STEP 1: BASIC RESUME CHECK
Reject if empty, unreadable, or not a resume.

STEP 2: ROLE KEYWORD MATCHING
Count matching keywords for the selected role.
- Fresher: Needs basic match.
- Mid-level: Needs moderate match.
- Experienced: Needs strong match.
Reject if below threshold.

STEP 3: EXPERIENCE CONSISTENCY CHECK
Check years, titles, vs selected experience level.
- Fresher should NOT claim senior titles.
- Experienced should NOT have zero experience.

STEP 4: CLAIM VS EVIDENCE CHECK
Detect strong claims ("Expert", "Lead") without evidence (projects/tools).
Flag internally if found.

STEP 5: RESUME STRUCTURE QUALITY
Check for Skills, Experience, Education.

STEP 6: FINAL DECISION
Decide: ACCEPT, WARNING, or REJECT.

OUTPUT JSON:
{
  "validation_status": "ACCEPT" | "WARNING" | "REJECT",
  "message": "User facing message (max 1 sentence)",
  "internal_flags": ["flag 1", "flag 2"],
  "resume_summary": "A comprehensive summary of the candidate's skills, experience, and projects derived from the resume. Optimize for an interviewer to read."
}

STRICT RULES:
- Do not suggest improvements.
- Do not coach.
- Only gatekeep.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: `Selected Role: ${formData.role}\nExperience Level: ${formData.experience}` },
                        { inlineData: { mimeType: 'application/pdf', data: base64Data } }
                    ]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        validation_status: { type: Type.STRING, enum: ['ACCEPT', 'WARNING', 'REJECT'] },
                        message: { type: Type.STRING },
                        internal_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        resume_summary: { type: Type.STRING }
                    },
                    required: ['validation_status', 'message', 'internal_flags', 'resume_summary']
                }
            }
        });

        const result = JSON.parse(response.text);
        setValidationFlags(result.internal_flags || []);
        setResumeSummary(result.resume_summary || '');
        
        if (result.validation_status === 'REJECT') {
            setResumeStatus('invalid');
            setValidationMsg(result.message);
            setResume(null); // Force re-upload
        } else if (result.validation_status === 'WARNING') {
            setResumeStatus('warning');
            setValidationMsg(result.message);
            setResume(file);
        } else {
            setResumeStatus('valid');
            setValidationMsg("Resume accepted. Compatible with selected role.");
            setResume(file);
        }

    } catch (error) {
        console.error("Resume validation failed", error);
        setResumeStatus('invalid');
        setValidationMsg("Failed to analyze resume. Please try a different file.");
        setResume(null);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      validateResume(file);
    } else {
      setResumeStatus('invalid');
      setValidationMsg("Invalid file type. Please upload a PDF.");
      setResume(null);
    }
  };
  
  const handleAdminOverride = () => {
      console.log("[ADMIN ACTION] Validation Override applied by FOUNDER_ADMIN");
      setResumeStatus('valid');
      setValidationMsg('Admin Override: Validation Bypassed.');
      setResumeSummary("Admin Override: No resume provided. Assume standard skills for role.");
      if (!resume) {
          // If no resume, create a dummy one or handle gracefully
          setValidationMsg('Admin Override: Proceeding without resume validation.');
      }
  }

  const handleStart = () => {
    onStart({
      name: formData.name,
      role: formData.role,
      experience: formData.experience,
      goal: formData.goal,
      company: formData.company,
      mode: formData.mode as 'ai' | 'peer',
      resumeName: resume?.name,
      resumeBase64: resumeBase64 || undefined,
      resumeText: resumeSummary,
      validationFlags: validationFlags
    });
  };

  const isFormValid = formData.name && formData.role && formData.experience && formData.goal && formData.mode && (resumeStatus === 'valid' || resumeStatus === 'warning');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
            <span className="text-slate-900">Profile</span>
            <span className="text-slate-900">Role Selection</span>
            <span className="text-slate-900">Resume</span>
            <span>Interview</span>
          </div>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 w-3/4 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interview Configuration</h1>
              <p className="text-sm text-slate-500">Configure your session parameters for a realistic experience.</p>
            </div>
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-10">
            
            {/* Section 1: Basic Details */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                1. Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value="candidate@example.com" 
                    readOnly 
                    className="w-full px-4 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Role Selection */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                2. Target Role
              </h3>
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="Search for a role (e.g. Software Engineer)"
                    value={roleSearch}
                    onChange={(e) => {
                      setRoleSearch(e.target.value);
                      setIsRoleDropdownOpen(true);
                      if (!e.target.value) setFormData({ ...formData, role: '' });
                    }}
                    onFocus={() => setIsRoleDropdownOpen(true)}
                  />
                  <ChevronDown className="absolute right-3 top-3 text-slate-400" size={18} />
                </div>
                
                {isRoleDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {ROLES.map((category) => {
                      const filteredRoles = category.roles.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase()));
                      if (filteredRoles.length === 0) return null;
                      return (
                        <div key={category.category}>
                          <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {category.category}
                          </div>
                          {filteredRoles.map(role => (
                            <button
                              key={role}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => handleRoleSelect(role)}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                    {ROLES.every(c => c.roles.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase())).length === 0) && (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No roles found</div>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-slate-500">Select the specific role you are preparing for.</p>
              </div>
            </section>

            {/* Section 3: Experience Level */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                3. Experience Level
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Fresher (0-1 yrs)', 'Mid-level (2-5 yrs)', 'Experienced (5+ yrs)'].map((level) => (
                  <label key={level} className={`
                    relative flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                    ${formData.experience === level 
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                      : 'border-slate-200 hover:border-slate-300'}
                  `}>
                    <input 
                      type="radio" 
                      name="experience" 
                      value={level} 
                      className="sr-only"
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                    <span className={`text-sm font-medium ${formData.experience === level ? 'text-slate-900' : 'text-slate-600'}`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Section 4: Resume Upload */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                4. Resume Upload <span className="text-red-500">*</span>
              </h3>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${
                  resumeStatus === 'valid' ? 'border-green-500 bg-green-50' : 
                  resumeStatus === 'warning' ? 'border-amber-400 bg-amber-50' :
                  resumeStatus === 'invalid' ? 'border-red-300 bg-red-50' : 
                  'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleResumeUpload}
                  disabled={resumeStatus === 'validating'}
                />
                
                {resume || resumeStatus === 'validating' ? (
                  <div className="flex flex-col items-center">
                    <FileText className={`w-10 h-10 mb-3 ${
                        resumeStatus === 'valid' ? 'text-green-600' : 
                        resumeStatus === 'warning' ? 'text-amber-500' :
                        'text-slate-400'
                    }`} />
                    
                    {resume && <span className="text-sm font-medium text-slate-900">{resume.name}</span>}
                    
                    {resumeStatus === 'validating' && (
                      <div className="mt-3 flex items-center gap-2 text-blue-600">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-xs font-medium">Validating against {formData.role || 'role'}...</span>
                      </div>
                    )}
                    
                    {resumeStatus === 'valid' && (
                      <div className="mt-3 text-center">
                         <span className="text-xs font-medium text-green-700 flex items-center justify-center">
                            <CheckCircle size={14} className="mr-1" /> Validated
                         </span>
                         <p className="text-xs text-green-600 mt-1">{validationMsg}</p>
                      </div>
                    )}

                    {resumeStatus === 'warning' && (
                      <div className="mt-3 text-center">
                         <span className="text-xs font-medium text-amber-700 flex items-center justify-center">
                            <ShieldAlert size={14} className="mr-1" /> Accepted with Warnings
                         </span>
                         <p className="text-xs text-amber-600 mt-1 max-w-sm">{validationMsg}</p>
                      </div>
                    )}
                    
                    {resumeStatus === 'invalid' && (
                      <div className="mt-3 text-center">
                         <span className="text-xs font-medium text-red-600 flex items-center justify-center">
                            <AlertCircle size={14} className="mr-1" /> Resume Rejected
                         </span>
                         <p className="text-xs text-red-500 mt-1 max-w-sm">{validationMsg}</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                        setResume(null);
                        setResumeStatus('idle');
                        setValidationMsg('');
                        setResumeSummary('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-4 text-xs text-slate-500 underline hover:text-slate-800"
                    >
                      Remove / Re-upload
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => {
                      if(!formData.role || !formData.experience) {
                          setResumeStatus('invalid');
                          setValidationMsg("Please select Role and Experience first.");
                      } else {
                          fileInputRef.current?.click();
                      }
                  }}>
                    <Upload className="w-10 h-10 text-slate-400 mb-3" />
                    <span className="text-sm font-medium text-slate-700">Click to upload resume</span>
                    <span className="text-xs text-slate-500 mt-1">PDF only (Max 5MB)</span>
                  </div>
                )}
                
                {/* Validation Overlay */}
                 {resumeStatus === 'invalid' && !resume && (
                     <div className="mt-4 p-2 bg-red-100 rounded text-xs text-red-700 font-medium animate-in fade-in">
                        {validationMsg}
                     </div>
                 )}
              </div>
              
              {isAdmin && (
                  <div className="flex justify-end pt-2">
                      <button 
                        onClick={handleAdminOverride}
                        className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded border border-purple-200"
                      >
                          <ShieldCheck size={12} /> Admin Override: Force Approve
                      </button>
                  </div>
              )}
            </section>

            {/* Section 5: Goals & Company */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                5. Context
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Interview Goal</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2 border border-slate-200 rounded-md appearance-none focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    >
                      <option value="">Select a goal</option>
                      {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Company (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="e.g. Google, Amazon"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
            </section>

             {/* Section 6: Interview Mode */}
             <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-4 border-slate-900 pl-3">
                6. Interview Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`
                  flex p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50
                  ${formData.mode === 'ai' ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50' : 'border-slate-200'}
                `}>
                  <input 
                    type="radio" 
                    name="mode" 
                    value="ai" 
                    className="sr-only"
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  />
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center">
                      <Monitor size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">AI HR Interview</span>
                    <span className="block text-xs text-slate-500 mt-1">Simulated HR round with adaptive AI questions.</span>
                  </div>
                </label>

                <label className={`
                  flex p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50
                  ${formData.mode === 'peer' ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50' : 'border-slate-200'}
                `}>
                  <input 
                    type="radio" 
                    name="mode" 
                    value="peer" 
                    className="sr-only"
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  />
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center">
                      <Mic size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">Mock with a Friend</span>
                    <span className="block text-xs text-slate-500 mt-1">Peer-to-peer session observed by AI.</span>
                  </div>
                </label>
              </div>
            </section>

            {/* System Check Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                 <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Before starting the interview:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700/80">
                  <li>Camera and microphone access is required</li>
                  <li>Ensure you are in a quiet environment</li>
                  <li>Uploaded resume must be valid and readable</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={handleStart} 
                disabled={!isFormValid}
                className="px-8"
              >
                Proceed to Interview
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};