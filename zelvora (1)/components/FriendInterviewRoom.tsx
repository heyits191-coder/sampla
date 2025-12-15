import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2, FileText, Shield, Info, AlertCircle, Check, Clock, Users, ArrowRight, RefreshCw, AlertTriangle, Home, LogIn, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { GoogleGenAI, Type } from '@google/genai';
import { InterviewContextData } from './PreInterviewSetup';
import { friendTokenService } from '../services/FriendTokenService';

interface FriendInterviewRoomProps {
  onLeave: () => void;
  onFinish: () => void;
  interviewContext?: InterviewContextData | null;
  initialToken?: string;
  isJoinFlow?: boolean;
}

type ViewMode = 'candidate' | 'interviewer' | 'join_gate' | 'lobby';
type ErrorType = 'INVALID' | 'EXPIRED' | 'USED' | 'NETWORK' | null;

interface QuestionBlueprint {
  category: string;
  question: string;
  follow_up?: string;
}

// Hook to track token status changes (simulated backend subscription)
const useTokenStatus = (token: string | null) => {
  const [status, setStatus] = useState<string>('UNUSED');
  
  useEffect(() => {
    if (!token) return;
    const check = () => {
      try {
        const db = JSON.parse(localStorage.getItem('zelvora_friend_tokens_db') || '{}');
        if (db[token]) {
          setStatus(db[token].status);
        }
      } catch (e) {
        // ignore parsing errors
      }
    };
    check();
    const interval = setInterval(check, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, [token]);
  
  return status;
}

export const FriendInterviewRoom: React.FC<FriendInterviewRoomProps> = ({ onLeave, onFinish, interviewContext, initialToken, isJoinFlow }) => {
  // View State
  const [viewMode, setViewMode] = useState<ViewMode>(isJoinFlow ? 'join_gate' : 'candidate'); 
  const [joinTokenInput, setJoinTokenInput] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Error State
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Session State
  const [timer, setTimer] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);
  
  // Lobby State
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // AI Content State
  const [questions, setQuestions] = useState<QuestionBlueprint[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [isLoadingBlueprint, setIsLoadingBlueprint] = useState(false);
  
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const tokenStatus = useTokenStatus(activeToken);

  // ----------------------------------------------------------------------
  // TOKEN GENERATION (CANDIDATE SIDE)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (viewMode === 'candidate' && !activeToken && interviewContext) {
        // Generate a new token when the room mounts for the candidate
        const token = friendTokenService.generateToken('current-user-id', 'int-' + Date.now());
        setActiveToken(token);
    }
  }, [viewMode, interviewContext, activeToken]);

  // ----------------------------------------------------------------------
  // TOKEN AUTO-VALIDATION (FRIEND LINK JOIN)
  // ----------------------------------------------------------------------
  useEffect(() => {
      if (initialToken && isJoinFlow && viewMode === 'join_gate') {
          setJoinTokenInput(initialToken);
          setIsLoading(true);
          
          // Auto-validate after a brief delay for UX
          const timer = setTimeout(() => {
              const result = friendTokenService.validateToken(initialToken.toUpperCase());
              setIsLoading(false);
              
              if (result.valid) {
                  setActiveToken(initialToken.toUpperCase());
                  setViewMode('lobby');
              } else {
                  // Map specific service errors to UI states
                  if (result.errorCode === 'EXPIRED') setErrorType('EXPIRED');
                  else if (result.errorCode === 'USED') setErrorType('USED');
                  else setErrorType('INVALID');
              }
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [initialToken, isJoinFlow, viewMode]);

  // LOCK SCROLL EFFECT
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Timer: Runs only when token is ACTIVE (friend has joined)
  useEffect(() => {
    let interval: number;
    if (tokenStatus === 'ACTIVE' && !hasFinished) {
      interval = window.setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [tokenStatus, hasFinished]);

  // Camera stream for Lobby and Interview
  useEffect(() => {
    if ((viewMode === 'candidate' || viewMode === 'interviewer' || viewMode === 'lobby') && !hasFinished) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
                if (viewMode === 'lobby') setPermissionGranted(true);
            })
            .catch(e => {
                console.error(e);
                if (viewMode === 'lobby') setPermissionGranted(false);
            });
    }
  }, [viewMode, hasFinished]);

  // ----------------------------------------------------------------------
  // AI QUESTION GENERATOR LOGIC (Run ONLY for Interviewer)
  // ----------------------------------------------------------------------
  useEffect(() => {
    const generateBlueprint = async () => {
      if (viewMode !== 'interviewer') return;
      const context = interviewContext || { role: "Software Engineer", experience: "2 years", name: "Candidate", resumeText: "" };
      
      if (questions.length > 0) return;

      setIsLoadingBlueprint(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
You are an AI Question Generator for a Friend Interview Evaluation.
Role: Generate structured questions for the FRIEND interviewer.
Context: ${context.role}, ${context.experience} experience.
Rules:
- Realistic, tough questions.
- Based on resume provided.
- NO casual questions.
`;

        const promptContext = `
INPUT CONTEXT:
Candidate: ${context.name || "Candidate"}
Role: ${context.role}
Experience: ${context.experience}
Resume Summary: ${context.resumeText || "N/A"}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptContext,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                interview_questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      question: { type: Type.STRING },
                      follow_up: { type: Type.STRING },
                    },
                    required: ['category', 'question'],
                  },
                },
                instructions_for_friend: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['interview_questions', 'instructions_for_friend'],
            },
          },
        });

        if (response.text) {
          const data = JSON.parse(response.text);
          setQuestions(data.interview_questions || []);
          setInstructions(data.instructions_for_friend || []);
        }
      } catch (error) {
        console.error("AI Generation Error", error);
        setQuestions([{ category: "Introduction", question: "Tell me about yourself.", follow_up: "Focus on your recent work." }]);
      } finally {
        setIsLoadingBlueprint(false);
      }
    };

    if (viewMode === 'interviewer' && activeToken) {
         generateBlueprint();
    }
  }, [viewMode, activeToken, interviewContext, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    if (activeToken) {
        friendTokenService.endSession(activeToken);
    }
    setHasFinished(true);
    if (viewMode === 'candidate') {
        onFinish();
    }
  };

  const getJoinLink = () => {
      if (!activeToken) return "";
      return `${window.location.origin}/join/${activeToken}`;
  };

  const handleCopyLink = () => {
    const link = getJoinLink();
    if (link) {
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleFriendJoin = () => {
      setErrorType(null);
      const result = friendTokenService.validateToken(joinTokenInput.toUpperCase());
      
      if (result.valid) {
          setActiveToken(joinTokenInput.toUpperCase());
          setViewMode('lobby');
      } else {
          // Map specific service errors
          if (result.errorCode === 'EXPIRED') setErrorType('EXPIRED');
          else if (result.errorCode === 'USED') setErrorType('USED');
          else setErrorType('INVALID');
      }
  };

  const handleEnterRoom = () => {
      if (activeToken) {
          try {
             friendTokenService.joinSession(activeToken);
             setViewMode('interviewer');
          } catch(e) {
             setErrorType('NETWORK');
          }
      }
  };

  const handleManualReset = () => {
      setErrorType(null);
      setJoinTokenInput('');
      window.history.pushState({}, '', '/join'); // Clear token from URL
  };

  // ----------------------------------------------------------------------------------
  // COMPONENT: ERROR SCREEN
  // ----------------------------------------------------------------------------------
  const ErrorScreen = ({ type }: { type: ErrorType }) => {
     let title = "";
     let body = "";
     let primaryAction = null;
     let secondaryAction = null;

     switch(type) {
         case 'INVALID':
             title = "This interview link is invalid";
             body = "The link you opened doesn’t match any active interview. Please ask the candidate to share a new link.";
             primaryAction = <Button onClick={handleManualReset} fullWidth>Enter Interview Code</Button>;
             secondaryAction = <button onClick={() => window.location.href = '/'} className="text-sm text-slate-500 hover:text-slate-900 mt-4">Go to Home</button>;
             break;
         case 'EXPIRED':
             title = "This interview link has expired";
             body = "Interview links expire after a short time for security reasons. Ask the candidate to generate a new link.";
             primaryAction = <Button onClick={handleManualReset} fullWidth>Enter Interview Code</Button>;
             break;
         case 'USED':
             title = "This interview has already started";
             body = "This link has already been used to join the interview. If you’re the interviewer, ask the candidate to resend a fresh link.";
             primaryAction = <Button onClick={() => window.location.href = '/'} fullWidth>Go to Home</Button>;
             break;
         case 'NETWORK':
             title = "Connection issue detected";
             body = "We’re having trouble connecting you to the interview. Please check your internet connection and try again.";
             primaryAction = <Button onClick={() => window.location.reload()} fullWidth>Retry</Button>;
             break;
         default:
             return null;
     }

     return (
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-xl border border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed">{body}</p>
                {primaryAction}
                {secondaryAction && <div>{secondaryAction}</div>}
            </div>
        </div>
     );
  };

  if (errorType) {
      return <ErrorScreen type={errorType} />;
  }

  // ----------------------------------------------------------------------------------
  // VIEW: FRIEND JOIN GATE (Fallback / Manual)
  // ----------------------------------------------------------------------------------
  if (viewMode === 'join_gate') {
      return (
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg relative z-10">
                    <Users size={32} />
                </div>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                         <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                         <h2 className="text-xl font-bold text-slate-900">Verifying Invite Link...</h2>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Join Interview</h2>
                        <p className="text-slate-500 mb-8 text-sm">
                            Enter the code or use the link shared by the candidate.
                        </p>

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Interview Code</label>
                                <input 
                                    type="text" 
                                    value={joinTokenInput}
                                    onChange={(e) => setJoinTokenInput(e.target.value.toUpperCase())}
                                    placeholder="e.g. AB9XQ2"
                                    className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em] py-4 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none uppercase text-slate-900 placeholder:text-slate-300 transition-colors"
                                    maxLength={6}
                                />
                            </div>
                            
                            <Button fullWidth onClick={handleFriendJoin} disabled={joinTokenInput.length < 6} className="mt-4 h-12">
                                <LogIn size={18} className="mr-2" /> Continue
                            </Button>
                            
                            <div className="pt-6 mt-4 border-t border-slate-100 text-center">
                                <span className="text-xs text-slate-400">No login required</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: FRIEND LOBBY (Permissions Check)
  // ----------------------------------------------------------------------------------
  if (viewMode === 'lobby') {
      return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4">
             <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                 
                 {/* Left: Camera Preview */}
                 <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center">
                     <video 
                         ref={selfVideoRef}
                         autoPlay 
                         muted 
                         playsInline
                         className="w-full h-full object-cover transform scale-x-[-1]"
                     />
                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                         <div className={`p-3 rounded-full ${permissionGranted ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}>
                             {permissionGranted ? <Video size={20} /> : <VideoOff size={20} />}
                         </div>
                         <div className={`p-3 rounded-full ${permissionGranted ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}>
                             {permissionGranted ? <Mic size={20} /> : <MicOff size={20} />}
                         </div>
                     </div>
                     {!permissionGranted && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-8 text-center">
                             <AlertCircle size={48} className="mb-4 text-red-500" />
                             <h3 className="text-xl font-bold mb-4">Camera and microphone required</h3>
                             <p className="text-sm text-slate-300 leading-relaxed mb-8">
                                 To join the interview as an interviewer, camera and microphone access is mandatory.
                             </p>
                             <Button 
                                onClick={() => window.location.reload()} 
                                className="bg-white text-slate-900 hover:bg-slate-200 border-none"
                             >
                                Allow Camera & Mic
                             </Button>
                             <p className="text-xs text-slate-500 mt-4">Refresh the page after allowing permissions.</p>
                         </div>
                     )}
                 </div>

                 {/* Right: Actions */}
                 <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white">
                     <div className="mb-8">
                         <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-4">
                             <Check size={24} />
                         </div>
                         <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Join?</h2>
                         <p className="text-slate-500 text-sm">
                             You are joining as the <strong>Interviewer</strong>.
                         </p>
                     </div>

                     <div className="space-y-4">
                         <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                             <h4 className="font-bold text-slate-800 mb-2">Instructions:</h4>
                             <ul className="space-y-2 text-slate-600 list-disc list-inside text-xs">
                                 <li>Follow the AI-generated questions.</li>
                                 <li>Keep the conversation professional.</li>
                                 <li>Stay visible on camera.</li>
                             </ul>
                         </div>

                         <Button 
                            fullWidth 
                            onClick={handleEnterRoom} 
                            disabled={!permissionGranted}
                            className="h-12 text-base shadow-lg hover:shadow-xl transition-all"
                         >
                            Join Interview Now <ArrowRight size={18} className="ml-2" />
                         </Button>
                     </div>
                 </div>

             </div>
        </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: COMPLETED STATE
  // ----------------------------------------------------------------------------------
  if (hasFinished && viewMode === 'interviewer') {
      return (
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-xl border border-slate-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <Check size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Interview completed</h2>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                    This interview has already ended. No further action is required from you.
                </p>
                <Button onClick={() => window.location.href = '/'} fullWidth variant="outline">
                    Go to Home
                </Button>
            </div>
        </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: INTERVIEWER MODE (FRIEND)
  // ----------------------------------------------------------------------------------
  if (viewMode === 'interviewer') {
     return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col overflow-hidden text-slate-900 font-sans">
             {/* Header */}
             <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0 z-10">
                 <div className="flex items-center gap-3">
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">Interviewer Mode</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{activeToken}</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="px-3 py-1 bg-slate-100 rounded text-sm font-mono font-medium text-slate-600 flex items-center gap-2">
                        <Clock size={14} /> {formatTime(timer)}
                     </div>
                     <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-9 px-4 text-xs" onClick={handleEndInterview}>
                        End Interview
                     </Button>
                 </div>
             </header>

             {/* Main Content: Split View */}
             <div className="flex-1 flex overflow-hidden">
                 
                 {/* LEFT: Video Area (Split Vertically for Remote/Local) */}
                 <div className="flex-1 bg-slate-900 relative flex flex-col">
                      {/* Top: Candidate Video (Simulated/Placeholder) */}
                      <div className="flex-1 relative border-b border-slate-800">
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                              <div className="flex flex-col items-center gap-3 opacity-50">
                                  <User size={64} className="text-slate-400" />
                                  <span className="text-slate-400 text-sm font-medium tracking-wider">CANDIDATE VIDEO FEED</span>
                              </div>
                          </div>
                          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-xs text-white font-medium backdrop-blur-sm border border-white/10">
                              Candidate
                          </div>
                      </div>

                      {/* Bottom: Friend Video (Self) */}
                      <div className="flex-1 relative">
                          <video 
                              ref={selfVideoRef}
                              autoPlay 
                              muted 
                              playsInline
                              className="w-full h-full object-cover transform scale-x-[-1]"
                          />
                          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-xs text-white font-medium backdrop-blur-sm border border-white/10">
                              You (Interviewer)
                          </div>
                      </div>
                 </div>

                 {/* RIGHT: Question Panel (Fixed Width) */}
                 <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
                     <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2">
                             <FileText size={18} className="text-blue-600" /> 
                             Interview Script
                         </h3>
                         <p className="text-xs text-slate-500 mt-1">
                             Strictly follow the generated questions below.
                         </p>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-6 space-y-6">
                         {/* Instructions */}
                         {!isLoadingBlueprint && instructions.length > 0 && (
                             <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                                 <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                                     <Shield size={12} /> Private Instructions
                                 </h4>
                                 <ul className="text-xs text-amber-900/80 space-y-1.5 list-disc list-inside leading-relaxed">
                                     {instructions.map((inst, i) => (
                                         <li key={i}>{inst}</li>
                                     ))}
                                 </ul>
                             </div>
                         )}
                         
                         {/* Questions List */}
                         {isLoadingBlueprint ? (
                             <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                                 <Loader2 className="animate-spin" size={24} />
                                 <span className="text-xs uppercase tracking-wider">Generating tailored questions...</span>
                             </div>
                         ) : (
                             <div className="space-y-6">
                                 {questions.map((q, i) => (
                                     <div 
                                        key={i} 
                                        className={`transition-all duration-300 ${
                                            i === currentQuestionIndex 
                                            ? 'opacity-100 scale-100' 
                                            : i < currentQuestionIndex ? 'opacity-50 grayscale' : 'opacity-80'
                                        }`}
                                     >
                                         <div className={`p-5 rounded-xl border-2 transition-all ${
                                             i === currentQuestionIndex 
                                             ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                             : 'bg-white border-slate-200'
                                         }`}>
                                             <div className="flex justify-between items-center mb-3">
                                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                     i === currentQuestionIndex ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                                 }`}>
                                                     {q.category}
                                                 </span>
                                             </div>
                                             
                                             <p className="font-bold text-slate-900 text-sm leading-relaxed mb-4">
                                                 {q.question}
                                             </p>
                                             
                                             {q.follow_up && (
                                                 <div className="mt-3 pt-3 border-t border-blue-200/50">
                                                     <div className="flex items-start gap-2">
                                                         <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                                         <div>
                                                             <span className="text-[10px] font-bold text-blue-700 uppercase block mb-0.5">Follow-up Probe</span>
                                                             <span className="text-xs text-blue-800">{q.follow_up}</span>
                                                         </div>
                                                     </div>
                                                 </div>
                                             )}

                                             {i === currentQuestionIndex && (
                                                <div className="mt-4 flex justify-end">
                                                    <Button 
                                                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700 border-none" 
                                                        onClick={() => setCurrentQuestionIndex(i + 1)}
                                                    >
                                                        Mark as Done
                                                    </Button>
                                                </div>
                                             )}
                                         </div>
                                     </div>
                                 ))}
                                 
                                 {questions.length > 0 && currentQuestionIndex >= questions.length && (
                                     <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                                         <CheckCircleIcon size={24} className="mx-auto text-green-600 mb-2" />
                                         <p className="text-sm font-bold text-green-800">All Questions Asked</p>
                                         <p className="text-xs text-green-700 mt-1">You can now end the interview.</p>
                                     </div>
                                 )}
                             </div>
                         )}
                     </div>
                 </div>
             </div>
        </div>
     );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: CANDIDATE MODE
  // ----------------------------------------------------------------------------------
  
  // WAITING STATE (Friend hasn't joined yet)
  if (tokenStatus !== 'ACTIVE') {
      const joinLink = getJoinLink();
      
      return (
        <div className="fixed inset-0 bg-slate-900 flex flex-col font-sans">
             {/* Simple Header */}
             <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950">
                 <div className="font-bold text-white text-lg tracking-tight">ZELVORA</div>
                 <Button variant="outline" className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white h-9 text-xs" onClick={onLeave}>
                    Exit Setup
                 </Button>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center p-4">
                 
                 {/* Main Setup Card */}
                 <div className="bg-slate-800 rounded-2xl p-1 max-w-4xl w-full shadow-2xl border border-slate-700 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
                     
                     {/* Left: Video Preview */}
                     <div className="flex-1 bg-black relative min-h-[300px] md:min-h-full rounded-xl overflow-hidden m-1">
                         <video 
                            ref={selfVideoRef}
                            autoPlay 
                            muted 
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                         />
                         <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white font-medium flex items-center gap-2 border border-white/10">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Camera Active
                         </div>
                     </div>

                     {/* Right: Invitation Details */}
                     <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-slate-800">
                         <div className="mb-8">
                             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                                 <Lock size={10} /> Secure P2P Session
                             </div>
                             <h2 className="text-2xl font-bold text-white mb-2">Invite Your Interviewer</h2>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                 Share the link with your friend. <br/>
                                 The session will begin automatically when they join.
                             </p>
                         </div>

                         {/* Link Box */}
                         <div className="space-y-4 mb-8">
                             <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Direct Link</label>
                             <div className="flex gap-2">
                                <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white font-mono truncate">
                                    {joinLink || "Generating link..."}
                                </div>
                                <Button 
                                    onClick={handleCopyLink} 
                                    className={`shrink-0 min-w-[100px] ${isCopied ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                >
                                    {isCopied ? 'Copied' : 'Copy'}
                                </Button>
                             </div>
                             <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Info size={10} /> Ask friend to open in Chrome or Edge.
                             </p>
                         </div>

                         {/* Fallback Token */}
                         <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                             <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Manual Code</span>
                                <span className="font-mono text-lg font-bold text-white tracking-widest">{activeToken}</span>
                             </div>
                         </div>

                         {/* Status */}
                         <div className="flex items-center justify-center gap-3 py-4 mt-6">
                             <Loader2 size={16} className="text-blue-500 animate-spin" />
                             <span className="text-sm font-medium text-slate-300">Waiting for friend...</span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      );
  }

  // ACTIVE INTERVIEW STATE (Friend Joined)
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-sans">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-16 flex justify-between items-center px-6 pointer-events-none">
         <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE RECORDING
         </div>
         <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-mono text-white border border-white/10 pointer-events-auto flex items-center gap-2">
            <Clock size={14} className="text-slate-400" /> {formatTime(timer)}
         </div>
      </div>

      {/* Main Grid: Equal Split for "Zoom-style" feel */}
      <main className="flex-1 flex p-4 gap-4 bg-slate-950">
            
            {/* Left: Friend (Remote) */}
            <div className="flex-1 bg-slate-900 rounded-xl ring-1 ring-slate-800 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center">
                     <div className="flex flex-col items-center gap-4 opacity-30">
                         <User size={80} className="text-slate-500" />
                         <span className="text-slate-400 font-bold tracking-widest">INTERVIEWER</span>
                     </div>
                 </div>
                 {/* In a real app, remote stream goes here */}
                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white font-medium border border-white/10">
                    Interviewer
                 </div>
            </div>

            {/* Right: Me (Local) */}
            <div className="flex-1 bg-slate-900 rounded-xl ring-1 ring-slate-800 relative overflow-hidden shadow-2xl">
                 <video 
                    ref={selfVideoRef}
                    autoPlay 
                    muted 
                    playsInline
                    className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
                 />
                 {!isCameraOn && (
                     <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                         <User size={80} className="text-slate-700" />
                     </div>
                 )}
                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white font-medium border border-white/10">
                    You
                 </div>
            </div>

      </main>

      {/* Bottom Controls */}
      <footer className="h-20 bg-slate-950 flex items-center justify-center z-50 px-8 pb-4">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-800 shadow-xl">
          <ControlButton 
            isActive={isMicOn} 
            onClick={() => {
                setIsMicOn(!isMicOn);
                // toggle track logic
            }} 
            onIcon={<Mic size={20} />} 
            offIcon={<MicOff size={20} />}
            label="Mic"
          />
          
          <ControlButton 
            isActive={isCameraOn} 
            onClick={() => setIsCameraOn(!isCameraOn)} 
            onIcon={<Video size={20} />} 
            offIcon={<VideoOff size={20} />}
            label="Camera"
          />

          <div className="w-px h-6 bg-slate-700 mx-2"></div>

          <button 
            onClick={handleEndInterview}
            className="flex items-center justify-center h-10 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all focus:outline-none shadow-lg active:scale-95 gap-2"
          >
            <PhoneOff size={16} />
            <span className="font-bold text-xs tracking-wide uppercase">End Call</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

const ControlButton = ({ isActive, onClick, onIcon, offIcon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
      focus:outline-none
      ${isActive 
        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white' 
        : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20'
      }
    `}
    title={label}
  >
    {isActive ? onIcon : offIcon}
  </button>
);

const CheckCircleIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);