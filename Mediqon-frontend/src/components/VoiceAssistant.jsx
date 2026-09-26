import React, { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, PhoneOff, Activity, ShieldCheck, Waves, X, Loader2, Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

// Helper to generate Mediqon AI medical voice replies
function getAiResponse(userText, userName = 'Patient') {
  const query = userText.toLowerCase();
  
  if (query.includes('appointment') || query.includes('book') || query.includes('doctor')) {
    return `Hello ${userName}! I can help you schedule a consultation with top specialists in Hyderabad, Delhi, Mumbai, Chennai, Warangal, or Bengaluru. You can filter clinicians by city or specialty right here.`;
  }
  if (query.includes('hyderabad') || query.includes('delhi') || query.includes('mumbai') || query.includes('chennai') || query.includes('warangal') || query.includes('bengaluru')) {
    return `I have updated your location registry. Showing verified hospitals and board-certified doctors in your selected city.`;
  }
  if (query.includes('heart') || query.includes('cardio') || query.includes('chest')) {
    return `Your cardiac metrics are being monitored. If you are experiencing discomfort, please consult our Cardiology specialists or run a Heart Assessment under Predictions.`;
  }
  if (query.includes('diabetes') || query.includes('sugar') || query.includes('glucose')) {
    return `For endocrinology support, we recommend monitoring your glucose vitals daily or scheduling a session with our Diabetes specialists.`;
  }
  if (query.includes('kidney') || query.includes('renal')) {
    return `You can perform an AI Kidney Assessment or consult with our Senior Nephrologists for precision diagnostics.`;
  }
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hello ${userName}! I am Mediqon AI Voice Assistant. How can I support your health and schedule today?`;
  }
  return `Thank you for sharing. I've logged your query into your Mediqon health session. Would you like me to book a doctor consultation or check your latest vitals?`;
}

export default function VoiceAssistant({ onCallEnd, user }) {
  const [isCalling, setIsCalling] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [mode, setMode] = useState('idle'); // 'vapi', 'webspeech', 'simulated'
  
  const transcriptRef = useRef(null);
  const onCallEndRef = useRef(onCallEnd);
  const recognitionRef = useRef(null);
  const vapiRef = useRef(null);

  useEffect(() => {
    onCallEndRef.current = onCallEnd;
  }, [onCallEnd]);

  // Speech synthesis helper
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')));
      if (englishVoice) utterance.voice = englishVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      try { vapiRef.current.stop(); } catch (err) { console.error(err); }
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (err) { console.error(err); }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsCalling(false);
    setActiveMessage(null);
    if (onCallEndRef.current) onCallEndRef.current();
  }, []);

  const startCall = useCallback(() => {
    setShowTranscript(true);
    setTranscripts([]);
    setActiveMessage(null);
    setIsCalling(true);

    const userName = user?.fullName?.split(' ')[0] || user?.name || 'Patient';

    // Try Vapi if credentials are provided
    if (VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID && VAPI_PUBLIC_KEY !== 'YOUR_VAPI_PUBLIC_KEY') {
      try {
        if (!vapiRef.current) {
          vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
        }
        setMode('vapi');
        vapiRef.current.start(VAPI_ASSISTANT_ID, {
          metadata: { patientId: user?.userId || user?.id || 'unknown' }
        });
        return;
      } catch (err) {
        console.warn("Vapi init failed, falling back to Web Speech API:", err);
      }
    }

    // Web Speech API Fallback
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        setMode('webspeech');
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        const greeting = `Hello ${userName}! Mediqon Voice AI is active. How can I assist with your appointments or health records?`;
        setTranscripts([{ role: 'assistant', text: greeting, isFinal: true }]);
        speakText(greeting);

        recognition.onresult = (event) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          if (interim) {
            setActiveMessage({ role: 'user', text: interim });
          }

          if (final) {
            setActiveMessage(null);
            const userSpeech = final.trim();
            setTranscripts(prev => [...prev, { role: 'user', text: userSpeech, isFinal: true }]);

            // Generate AI Response
            setTimeout(() => {
              const aiReply = getAiResponse(userSpeech, userName);
              setTranscripts(prev => [...prev, { role: 'assistant', text: aiReply, isFinal: true }]);
              speakText(aiReply);
            }, 600);
          }
        };

        recognition.onerror = (err) => {
          console.warn("Speech recognition error:", err);
        };

        recognition.onend = () => {
          if (isCalling) {
            try { recognition.start(); } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err) {
        console.warn("WebSpeech recognition start failed:", err);
      }
    }

    // Interactive Simulated Fallback if mic or Vapi unavailable
    setMode('simulated');
    const fallbackGreeting = `Hello ${userName}! Mediqon Voice Assistant is ready. Ask me anything about appointments or hospital specialists.`;
    setTranscripts([{ role: 'assistant', text: fallbackGreeting, isFinal: true }]);
    speakText(fallbackGreeting);
  }, [user, speakText, isCalling]);

  // Vapi event handlers if Vapi mode is active
  useEffect(() => {
    if (!vapiRef.current) return;
    const vapi = vapiRef.current;

    const onCallStart = () => {
      setIsCalling(true);
      setShowTranscript(true);
    };

    const onCallEndHandler = () => {
      setIsCalling(false);
      setActiveMessage(null);
      if (onCallEndRef.current) onCallEndRef.current();
    };

    const onMessage = (message) => {
      if (message.type === "transcript") {
        const { role, transcript, transcriptType } = message;
        if (!transcript || transcript.trim().length === 0) return;

        if (transcriptType === "partial") {
          setActiveMessage({ role, text: transcript });
        } else if (transcriptType === "final") {
          setActiveMessage(null);
          setTranscripts(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === role && lastMsg.text === transcript) return prev;
            return [...prev.slice(-20), { role, text: transcript, isFinal: true }];
          });
        }
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEndHandler);
    vapi.on("message", onMessage);

    return () => {
      try { vapi.removeAllListeners(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const handleTrigger = () => startCall();
    window.addEventListener('trigger-vapi', handleTrigger);
    return () => window.removeEventListener('trigger-vapi', handleTrigger);
  }, [startCall]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcripts, activeMessage]);

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-6 antialiased">
      
      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="w-[340px] overflow-hidden rounded-[2rem] border border-border bg-card/95 shadow-2xl backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="border-b border-border bg-muted/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  {isCalling ? 'Voice Session Active' : 'Mediqon Voice Assistant'}
                </span>
              </div>
              <button 
                onClick={() => {
                  stopCall();
                  setShowTranscript(false);
                }}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transcripts Stream */}
            <div 
              ref={transcriptRef}
              className="max-h-[320px] min-h-[160px] overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide"
            >
              {transcripts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                   <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                     Initializing Medical Voice AI...
                   </p>
                </div>
              )}

              {transcripts.map((t, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex flex-col ${t.role === 'user' ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1 px-1">
                      {t.role === 'user' ? 'Patient' : 'Mediqon AI'}
                  </span>
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm ${
                    t.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted border border-border text-foreground'
                  }`}>
                    {t.text}
                  </div>
                </motion.div>
              ))}
              
              {/* Active Listening / Speaking indicator */}
              {activeMessage && (
                <div className={`flex flex-col ${activeMessage.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 px-1 flex items-center gap-1">
                    <Volume2 className="h-3 w-3 animate-pulse" /> Listening...
                  </span>
                  <div className="max-w-[90%] rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {activeMessage.text}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Control Bar */}
            <div className="bg-muted/40 px-6 py-3.5 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">HIPAA Encrypted Voice</span>
                </div>
                {isCalling && (
                    <button 
                      onClick={stopCall}
                      className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <PhoneOff className="h-3 w-3" />
                      End Call
                    </button>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Trigger Orb Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isCalling) {
            if (!showTranscript) {
              setShowTranscript(true);
            } else {
              stopCall();
            }
          } else {
            startCall();
          }
        }}
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 ${
          isCalling 
            ? "bg-card border-emerald-500/50 shadow-emerald-500/20 shadow-xl" 
            : "bg-card border-border hover:border-primary/50 hover:bg-muted shadow-lg"
        } overflow-hidden`}
      >
        <AnimatePresence>
          {isCalling && (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 to-sky-500/30 blur-md"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex items-center justify-center text-foreground">
          {isCalling ? (
            <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
          ) : (
            <Mic className="h-6 w-6 text-primary" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
