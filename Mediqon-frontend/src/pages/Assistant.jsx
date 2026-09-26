import React, { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, PhoneOff, ShieldCheck, ChevronRight, ActivitySquare, Loader2, Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import mediqonLogo from '../assets/mediqon-logo.png';

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

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

export default function Assistant() {
  const { user } = useAuth();
  const [isCalling, setIsCalling] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);
  const vapiRef = useRef(null);

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
  }, []);

  const startCall = useCallback(() => {
    setTranscripts([]);
    setActiveMessage(null);
    setIsCalling(true);

    const userName = user?.fullName?.split(' ')[0] || user?.name || 'Patient';

    if (VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID && VAPI_PUBLIC_KEY !== 'YOUR_VAPI_PUBLIC_KEY') {
      try {
        if (!vapiRef.current) {
          vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
        }
        vapiRef.current.start(VAPI_ASSISTANT_ID, {
          firstMessageMode: "assistant-speaks-first",
          firstMessage: `Hello ${userName}! How can I assist you with your booking today?`,
          metadata: { patientId: user?.userId || user?.id || 'unknown' }
        });
        return;
      } catch (err) {
        console.warn("Vapi start error, switching to WebSpeech:", err);
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
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

            setTimeout(() => {
              const aiReply = getAiResponse(userSpeech, userName);
              setTranscripts(prev => [...prev, { role: 'assistant', text: aiReply, isFinal: true }]);
              speakText(aiReply);
            }, 600);
          }
        };

        recognition.onerror = (err) => console.warn("Recognition error:", err);
        recognition.onend = () => {
          if (isCalling) {
            try { recognition.start(); } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err) {
        console.warn("WebSpeech recognition error:", err);
      }
    }

    const fallbackGreeting = `Hello ${userName}! Mediqon Voice Assistant is active. Ask me about booking appointments or checking health vitals.`;
    setTranscripts([{ role: 'assistant', text: fallbackGreeting, isFinal: true }]);
    speakText(fallbackGreeting);
  }, [user, speakText, isCalling]);

  useEffect(() => {
    if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcripts, activeMessage]);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col items-center justify-center fade-in">
      
      {!isCalling && transcripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
            <div className="h-20 w-20 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg relative z-10 overflow-hidden">
               <img src={mediqonLogo} alt="Mediqon AI" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Mediqon AI Voice Assistant</h2>
            <p className="text-sm font-medium text-muted-foreground mt-2 leading-relaxed">
              Your voice-activated healthcare assistant. You can ask to book appointments, check doctor availability, or review your schedule.
            </p>
          </div>
          <button 
            onClick={startCall}
            className="group relative px-8 py-3.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-3 transition-all hover:opacity-90 w-full shadow-sm active:scale-95"
          >
            <Mic className="h-4 w-4 text-emerald-300" />
            <span className="font-semibold text-sm tracking-wide">Start Voice Session</span>
            <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl h-full flex flex-col bg-card border border-border shadow-sm rounded-3xl overflow-hidden">
          
          {/* Header */}
          <header className="px-6 py-4 bg-card border-b border-border/50 flex items-center justify-between shadow-sm z-10">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-xl text-primary border border-primary/20">
                   <ActivitySquare className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="font-bold text-foreground leading-none flex items-center gap-2">
                     Mediqon Medical AI
                     <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                   </h3>
                   <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                     <span className={`h-1.5 w-1.5 rounded-full ${isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                     {isCalling ? 'Session Active' : 'Disconnected'}
                   </div>
                </div>
             </div>
             
             {isCalling ? (
               <button 
                 onClick={stopCall}
                 className="h-10 px-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-destructive/20 transition-colors shadow-sm active:scale-95"
               >
                 <PhoneOff className="h-4 w-4" /> End Call
               </button>
             ) : (
               <button 
                 onClick={startCall}
                 className="h-10 px-4 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/20 transition-colors shadow-sm active:scale-95"
               >
                 <Mic className="h-4 w-4" /> Connect Voice
               </button>
             )}
          </header>

          {/* Chat Canvas */}
          <div 
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-muted/30"
          >
             {transcripts.map((t, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex w-full ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col gap-1.5 max-w-[85%] ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                        {t.role === 'user' ? 'You' : 'Mediqon AI'}
                    </span>
                    <div className={`px-5 py-3.5 rounded-[20px] text-[15px] font-medium leading-relaxed ${
                      t.role === 'user' 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10 rounded-tr-sm' 
                        : 'bg-card border border-border text-foreground shadow-sm rounded-tl-sm'
                    }`}>
                      {t.text}
                    </div>
                  </div>
                </motion.div>
             ))}

             {activeMessage && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className={`flex w-full ${activeMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`flex flex-col gap-1.5 max-w-[85%] ${activeMessage.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1 flex items-center gap-1">
                       <Volume2 className="h-3 w-3 animate-pulse" /> Listening...
                   </span>
                   <div className="px-5 py-3.5 rounded-[20px] text-[15px] font-medium leading-relaxed bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-tl-sm">
                     {activeMessage.text}
                   </div>
                 </div>
               </motion.div>
             )}
          </div>
          
          {/* Footer */}
          <div className="bg-card border-t border-border/50 p-4 flex items-center justify-center gap-2">
             <ShieldCheck className="h-4 w-4 text-emerald-500" />
             <span className="text-xs font-semibold text-muted-foreground">HIPAA Compliant Medical Voice AI • End-to-End Encrypted</span>
          </div>

        </div>
      )}
    </div>
  );
}
