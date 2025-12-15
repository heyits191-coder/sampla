import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Activity, WifiOff, Loader2, AlertTriangle, EyeOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { InterviewContextData } from './PreInterviewSetup';
import { InterviewReportData } from '../types';

interface InterviewRoomProps {
  onLeave: () => void;
  onFinish: (data?: InterviewReportData) => void;
  interviewContext?: InterviewContextData | null;
}

// Audio handling constants
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ onLeave, onFinish, interviewContext }) => {
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'generating_report'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [cameraOffWarning, setCameraOffWarning] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); // active session
  const violationRef = useRef<number>(0); // Mutable ref for tracking
  
  // LOCK SCROLL EFFECT
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isInterviewActive && connectionStatus === 'connected') {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, connectionStatus]);

  // ABUSIVE BEHAVIOR CHECK: CAMERA OFF
  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isInterviewActive && !isCameraOn) {
          // If camera is off, start counting down to termination
          interval = setInterval(() => {
              setCameraOffWarning(prev => {
                  if (prev >= 10) {
                      // Terminate
                      handleEndInterview(true); // true = forced termination
                      return prev;
                  }
                  return prev + 1;
              });
          }, 1000);
      } else {
          setCameraOffWarning(0);
      }
      return () => clearInterval(interval);
  }, [isCameraOn, isInterviewActive]);

  // ABUSIVE BEHAVIOR CHECK: TAB SWITCHING (Focus Loss)
  useEffect(() => {
      const handleVisibilityChange = () => {
          if (document.hidden && isInterviewActive && connectionStatus === 'connected') {
              console.log("[INTEGRITY] Focus Lost");
              violationRef.current += 1;
              setViolationCount(violationRef.current);
              
              // Notify Model of cheating attempt silently
              if (sessionRef.current) {
                  sessionRef.current.sendRealtimeInput([{
                      text: "SYSTEM_ALERT: Candidate has switched tabs or lost focus. This is a potential cheating attempt (reading notes/Googling). Mark this as an integrity violation and react firmly."
                  }]);
              }
          }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleVisibilityChange);

      return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("blur", handleVisibilityChange);
      };
  }, [isInterviewActive, connectionStatus]);

  const cleanupMedia = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
    }
  };

  const handleEndInterview = async (forced = false) => {
    if (connectionStatus === 'generating_report') return;

    // Start Report Generation
    setConnectionStatus('generating_report');
    setIsMicOn(false); // Mute user
    
    // Stop audio processing
    if (scriptProcessorRef.current && inputAudioContextRef.current) {
        scriptProcessorRef.current.disconnect();
    }

    const terminationMsg = forced 
        ? "SYSTEM_TRIGGER: Candidate violated camera rules or abusive behavior detected. TERMINATE IMMEDIATELY. Generate a report with 'Not Recommended' and flag integrity issues."
        : "INTERVIEW_END_TRIGGER: The interview is concluded. Stop speaking. Immediately generate the final evaluation report by calling the submit_report tool.";

    if (sessionRef.current) {
       try {
         await sessionRef.current.sendRealtimeInput([{ text: terminationMsg }]);
         
         // Set a fallback timeout
         setTimeout(() => {
             if (isInterviewActive) {
                 cleanupMedia();
                 onFinish(undefined);
             }
         }, 15000);

       } catch (e) {
           console.error("Failed to send end trigger", e);
           cleanupMedia();
           onFinish(undefined);
       }
    } else {
        cleanupMedia();
        onFinish(undefined);
    }
  };

  // Report Tool Definition
  const reportTool: FunctionDeclaration = {
    name: "submit_report",
    description: "Submits the final interview evaluation report.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, enum: ["Strongly Recommended", "Recommended", "Borderline", "Not Recommended"] },
        summary: { type: Type.STRING },
        scores: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.NUMBER },
              comment: { type: Type.STRING }
            }
          }
        },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        behavioral: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING },
            energy: { type: Type.STRING },
            eyeContact: { type: Type.STRING }
          }
        },
        integrity: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "0-100 score on integrity" },
                flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                status: { type: Type.STRING, enum: ["Clean", "Compromised", "Terminated"] }
            }
        },
        outcome: { type: Type.STRING }
      },
      required: ["verdict", "summary", "scores", "strengths", "weaknesses", "behavioral", "integrity", "outcome"]
    }
  };

  // Construct System Instruction based on Persona and User Data
  const getSystemInstruction = () => {
    const { role, experience, goal, company, name, resumeText } = interviewContext || {};
    const candidateName = name || "Candidate";
    const firstName = candidateName.split(' ')[0];
    const targetCompany = company || "General Tech";
    const resumeContext = resumeText || `Candidate has experience relevant to ${role}.`;

    return `
You are ZELVORA AI HR.

You are a senior corporate interviewer.
You are not a chatbot, not a coach, not a teacher.

--------------------------------------------------
INTEGRITY & ABUSE PROTOCOLS (STRICT)
--------------------------------------------------

You must actively prevent gaming/cheating. You are the judge.

1. READING ANSWERS / EYE CONTACT
   - You are receiving video frames. Monitor gaze constantly.
   - If candidate looks away repeatedly, reads off-screen, or looks down for long periods:
     Action: Interrupt and say "Please look at the camera."
     Penalty: Reduce Integrity Score. Mark as 'Compromised'.

2. SECOND SCREEN / NOTES
   - If their eyes track text off-screen:
     Action: Note it. Ask a complex follow-up immediately to break their flow.
     Penalty: Reduce 'Communication' and 'Integrity' scores.

3. SCRIPTED ANSWERS
   - If an answer sounds too perfect, generic, or read from ChatGPT:
     Action: Interrupt. "That sounds generic. Explain the specific trade-off you made in your own words."
     Penalty: Rejection risk.

4. SILENCE / AUDIO ABUSE
   - If candidate stays silent for >5 seconds or repeatedly asks "Can you repeat?":
     Action: Mark as poor communication. Do not be patient.

5. TERMINATION THRESHOLD
   - If you detect >3 clear integrity violations (reading, distraction, non-compliance):
     Action: End the interview. "We will stop here. The interview integrity is compromised."
     Tool Call: submit_report with Verdict: Not Recommended, Integrity Status: Terminated.

--------------------------------------------------
INPUT CONTEXT
--------------------------------------------------

Candidate Name: ${candidateName}
Selected Role: ${role}
Experience Level: ${experience}
Interview Goal: ${goal}
Target Company: ${targetCompany}
RESUME: ${resumeContext}

--------------------------------------------------
INTERVIEW FLOW
--------------------------------------------------

PHASE 1: INTRODUCTION & PRESENCE CHECK
- Introduction. Verify they are looking at the camera.

PHASE 2: RESUME DRILL
- Pick a project. Ask: "What was the hardest bug you fixed here?"
- If they look away to recall, that is fine. If they look away to READ, penalize.

PHASE 3: DEPTH
- Ask technical questions.
- Interrupt if they waffle.

PHASE 4: CONCLUSION
- Call 'submit_report'.

--------------------------------------------------
FINAL REPORT RULES
--------------------------------------------------

- Verdict: Honest.
- Integrity Section:
  - Clean: Normal behavior.
  - Compromised: Suspicious eye movements, focus loss alerts (SYSTEM_ALERT).
  - Terminated: Blatant cheating.
- Tone: Professional, strict, corporate.
    `;
  };

  // Live API Connection & Audio Handling
  useEffect(() => {
    const connectToGemini = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Initialize Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
        
        // Get User Media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setConnectionStatus('connected');
              
              // Set up Input Stream (Mic -> Gemini)
              const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
              sourceNodeRef.current = source;
              
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              scriptProcessorRef.current = scriptProcessor;
              
              scriptProcessor.onaudioprocess = (e) => {
                if (!isMicOn) return; // Mute logic
                const inputData = e.inputBuffer.getChannelData(0);
                
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                
                let binary = '';
                const bytes = new Uint8Array(int16.buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                   binary += String.fromCharCode(bytes[i]);
                }
                const base64Data = btoa(binary);

                sessionPromise.then((session) => {
                  sessionRef.current = session;
                  session.sendRealtimeInput({
                    media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64Data
                    }
                  });
                });
              };

              // SEND VIDEO FRAMES (For Eye Contact Monitoring)
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const video = document.createElement('video');
              video.srcObject = stream;
              video.play();
              
              const videoInterval = setInterval(() => {
                  if (video.readyState === video.HAVE_ENOUGH_DATA && ctx && isCameraOn) {
                      canvas.width = video.videoWidth * 0.5;
                      canvas.height = video.videoHeight * 0.5;
                      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                      const base64Image = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
                      
                      sessionPromise.then((session) => {
                          session.sendRealtimeInput({
                              media: {
                                  mimeType: 'image/jpeg',
                                  data: base64Image
                              }
                          });
                      });
                  }
              }, 1000);

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);

              return () => clearInterval(videoInterval);
            },
            onmessage: async (message: LiveServerMessage) => {
               // Handle Tool Calls (Report Generation)
               if (message.toolCall) {
                   const functionCalls = message.toolCall.functionCalls;
                   const reportCall = functionCalls.find(fc => fc.name === 'submit_report');
                   
                   if (reportCall) {
                       const args = reportCall.args as any;
                       const reportData: InterviewReportData = {
                           verdict: args.verdict,
                           summary: args.summary,
                           scores: args.scores,
                           strengths: args.strengths,
                           weaknesses: args.weaknesses,
                           behavioral: args.behavioral,
                           integrity: args.integrity,
                           simulationOutcome: args.outcome,
                           meta: {
                               date: new Date().toLocaleDateString(),
                               role: interviewContext?.role || "Candidate",
                               type: "AI HR Assessment",
                               duration: formatTime(timer)
                           }
                       };
                       
                       // Cleanup and Finish
                       setIsInterviewActive(false);
                       cleanupMedia();
                       onFinish(reportData);
                       return;
                   }
               }

               const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
               
               if (base64Audio) {
                 setIsAiSpeaking(true);
                 const ctx = audioContextRef.current;
                 if (!ctx) return;

                 const binaryString = atob(base64Audio);
                 const len = binaryString.length;
                 const bytes = new Uint8Array(len);
                 for (let i = 0; i < len; i++) {
                   bytes[i] = binaryString.charCodeAt(i);
                 }
                 
                 const dataInt16 = new Int16Array(bytes.buffer);
                 const frameCount = dataInt16.length; 
                 const audioBuffer = ctx.createBuffer(1, frameCount, OUTPUT_SAMPLE_RATE);
                 const channelData = audioBuffer.getChannelData(0);
                 for (let i = 0; i < frameCount; i++) {
                    channelData[i] = dataInt16[i] / 32768.0;
                 }

                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                 
                 const source = ctx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(ctx.destination);
                 
                 source.onended = () => {
                    sourcesRef.current.delete(source);
                    if (sourcesRef.current.size === 0) {
                        setIsAiSpeaking(false);
                    }
                 };
                 
                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
               }

               if (message.serverContent?.interrupted) {
                 sourcesRef.current.forEach(s => s.stop());
                 sourcesRef.current.clear();
                 nextStartTimeRef.current = 0;
                 setIsAiSpeaking(false);
               }
            },
            onclose: () => {
              if (connectionStatus !== 'generating_report') {
                  setConnectionStatus('error');
                  setErrorMessage("Connection closed.");
              }
            },
            onerror: (e) => {
              console.error(e);
              setConnectionStatus('error');
              setErrorMessage("Connection error.");
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: getSystemInstruction(),
            tools: [{ functionDeclarations: [reportTool] }],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
          }
        });
        
      } catch (err) {
        console.error(err);
        setConnectionStatus('error');
        setErrorMessage("Failed to initialize interview session.");
      }
    };

    if (isInterviewActive) {
      connectToGemini();
    }

    return () => {
      cleanupMedia();
    };
  }, [isInterviewActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !isMicOn);
    }
  };

  const handleToggleCamera = () => {
    if (isCameraOn) {
        setIsCameraOn(false);
    } else {
        setIsCameraOn(true);
    }
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-sans">
      
      {/* Session Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
         <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 pointer-events-auto">
            <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {connectionStatus === 'connected' ? 'LIVE SESSION' : connectionStatus === 'generating_report' ? 'FINALIZING...' : 'CONNECTING...'}
         </div>
         <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 pointer-events-auto">
            {formatTime(timer)}
         </div>
      </div>

      {/* Warning Overlay for Camera Off */}
      {!isCameraOn && isInterviewActive && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl border border-red-500 flex items-center gap-3 animate-bounce">
              <AlertTriangle className="animate-pulse" />
              <div className="flex flex-col">
                  <span className="font-bold text-sm">CAMERA MUST BE ON</span>
                  <span className="text-xs">Auto-termination in {10 - cameraOffWarning}s</span>
              </div>
          </div>
      )}

      {/* Focus Violation Toast */}
      {violationCount > 0 && (
          <div className="absolute top-20 right-4 z-40 bg-amber-500/90 text-white px-4 py-2 rounded shadow-lg text-xs font-bold flex items-center gap-2">
             <EyeOff size={14} /> 
             Focus Violations: {violationCount}
          </div>
      )}

      {/* Main Grid: 2 Columns, Equal Size, Centered */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-950">
        
        {/* REPORT GENERATION OVERLAY */}
        {connectionStatus === 'generating_report' && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Generating Evaluation Report</h2>
                <p className="text-slate-400">Analyzing interview performance and integrity...</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl h-full max-h-[80vh] items-center justify-center">
            
            {/* Box 1: AI HR (Visualizer) */}
            <div className="w-full aspect-video bg-slate-900 rounded-2xl ring-1 ring-slate-800 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl order-1 md:order-none">
                {/* AI Visualizer Animation */}
                <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-blue-500 rounded-full blur-3xl transition-opacity duration-300 ${isAiSpeaking ? 'opacity-40' : 'opacity-10'}`}></div>
                    <div className={`w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center relative z-10 transition-all duration-200 ${isAiSpeaking ? 'ring-8 ring-blue-500/20 scale-105 border-blue-500' : ''}`}>
                        <Activity size={56} className={`transition-colors duration-200 ${isAiSpeaking ? 'text-blue-400' : 'text-slate-500'}`} />
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-sm text-white font-medium border border-white/10">
                    AI HR Interviewer
                </div>
                
                {(connectionStatus !== 'connected' && connectionStatus !== 'generating_report') && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="flex flex-col items-center text-amber-500 gap-2">
                           <WifiOff />
                           <span className="text-sm font-bold tracking-wider">{errorMessage || "CONNECTING..."}</span>
                        </div>
                     </div>
                )}
            </div>

            {/* Box 2: Candidate (Self) */}
            <div className="w-full aspect-video bg-slate-900 rounded-2xl ring-1 ring-slate-800 relative overflow-hidden shadow-2xl order-2 md:order-none group">
                 <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline
                    className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
                 />
                 
                 {!isCameraOn && (
                     <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                         <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center animate-pulse">
                            <AlertTriangle size={48} className="text-red-500" />
                         </div>
                     </div>
                 )}

                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-sm text-white font-medium border border-white/10">
                    You
                 </div>
                 
                 {/* Mic Status Indicator */}
                 <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur p-2 rounded-full border border-white/10">
                    {isMicOn ? <Mic size={16} className="text-green-400" /> : <MicOff size={16} className="text-red-400" />}
                 </div>
            </div>

        </div>
      </main>

      {/* Controls Bar - Fixed Bottom Center */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-center z-50 pointer-events-none pb-4">
        <div className="flex items-center space-x-6 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-8 py-3 rounded-full border border-slate-700 shadow-2xl">
          <ControlButton 
            isActive={isMicOn} 
            onClick={handleToggleMic} 
            onIcon={<Mic size={24} />} 
            offIcon={<MicOff size={24} />}
            label="Microphone"
          />
          
          <ControlButton 
            isActive={isCameraOn} 
            onClick={handleToggleCamera} 
            onIcon={<Video size={24} />} 
            offIcon={<VideoOff size={24} />}
            label="Camera"
          />

          <div className="w-px h-8 bg-slate-700 mx-2"></div>

          <button 
            onClick={() => handleEndInterview(false)}
            className="group flex items-center justify-center h-12 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-red-900 active:scale-95 shadow-lg shadow-red-900/20"
          >
            <PhoneOff size={20} className="mr-2" />
            <span className="font-bold text-sm tracking-wide">END INTERVIEW</span>
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
      flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
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