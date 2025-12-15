import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MoreHorizontal, Maximize2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Interview: React.FC = () => {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [status, setStatus] = useState("Connecting to secure server...");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    // Simulation sequence
    const timers = [
      setTimeout(() => setStatus("Verifying Resume Integrity..."), 1500),
      setTimeout(() => setStatus("Establishing AI Handshake..."), 3000),
      setTimeout(() => {
        setStatus("Live Evaluation in Progress");
        setAiSpeaking(true);
        setTranscript(prev => [...prev, "AI: Good morning. I've reviewed your resume. Let's start with your experience at your last internship."]);
      }, 4500),
      setTimeout(() => setAiSpeaking(false), 8000), // AI stops speaking
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEndCall = () => {
    if (window.confirm("End the interview? This will generate your final report.")) {
      navigate('/reports');
    }
  };

  return (
    <div className="bg-black h-[calc(100vh-80px)] w-full flex flex-col relative overflow-hidden">
      
      {/* Status Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
        <div className={`h-2.5 w-2.5 rounded-full ${status.includes('Progress') ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
        <span className="text-slate-200 text-xs font-medium tracking-wide uppercase">{status}</span>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
         <div className="bg-slate-900/80 px-3 py-1 rounded text-slate-400 text-xs">
           Session ID: ZEL-8821X
         </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        
        {/* Main Speaker (AI or User) */}
        <div className="md:col-span-3 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Placeholder for Video Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className={`transition-all duration-500 ${aiSpeaking ? 'scale-110 shadow-emerald-500/20 shadow-2xl' : 'scale-100'}`}>
                    <div className="h-32 w-32 rounded-full bg-slate-950 border-4 border-slate-700 flex items-center justify-center relative">
                        {aiSpeaking && (
                             <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20"></span>
                        )}
                        <Activity className={`h-12 w-12 ${aiSpeaking ? 'text-emerald-500' : 'text-slate-600'}`} />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white font-semibold text-lg bg-black/50 px-3 py-1 rounded">
                AI HR Director
            </div>
        </div>

        {/* Side Panel / Self View */}
        <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex-1 bg-slate-800 rounded-lg relative overflow-hidden border border-slate-700">
                 {cameraOn ? (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                         <p className="text-slate-500 text-xs">[ YOUR CAMERA FEED ]</p>
                    </div>
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className="text-slate-500 font-bold">YOU</span>
                        </div>
                    </div>
                 )}
                 <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                    You (Candidate)
                </div>
            </div>

            {/* Transcript / Notes snippet */}
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 overflow-y-auto">
                <h4 className="text-xs text-slate-500 uppercase font-bold mb-2">Live Transcript</h4>
                <div className="space-y-2">
                    {transcript.map((t, i) => (
                        <p key={i} className="text-xs text-slate-300 font-mono leading-relaxed border-l-2 border-emerald-500/50 pl-2">
                            {t}
                        </p>
                    ))}
                    {transcript.length === 0 && <p className="text-xs text-slate-600 italic">Waiting for speech...</p>}
                </div>
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
           <Activity className="h-4 w-4" />
           <span>Audio Quality: High</span>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={() => setMicOn(!micOn)}
                className={`p-4 rounded-full transition-colors ${micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button 
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-4 rounded-full transition-colors ${cameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
                {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
             <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
            </button>
            <button 
                onClick={handleEndCall}
                className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors ml-4 flex items-center"
            >
                <PhoneOff className="h-4 w-4 mr-2" /> End Interview
            </button>
        </div>

        <div className="hidden md:block">
            <button className="text-slate-400 hover:text-white">
                <Maximize2 className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
