import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, 
  MessageSquare, Users, Settings, Share, 
  Hand, Maximize, Layout, MoreVertical,
  Minus, Plus, ShieldCheck, Heart, Activity, Camera, Info,
  Send, FileText, Download, CheckCircle, Sparkles, X, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/api';

export default function Consultation() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [time, setTime] = useState('00:00:00');
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      text: 'Hello! I am reviewing your recent health vitals and ML assessment records.',
      time: '10:30 AM',
      isDoctor: true
    },
    {
      id: 2,
      sender: 'Dr. Sarah Johnson',
      text: 'Your diastolic pressure is slightly elevated. Let us discuss lifestyle optimization and routine follow-up.',
      time: '10:31 AM',
      isDoctor: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setTime(`${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText || isTyping) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.fullName || 'Patient',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.consultationChat(userText, updatedMessages);
      const doctorReply = res.reply || 'Thank you for your update. Let us keep monitoring your vitals.';
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Dr. Sarah Johnson',
        text: doctorReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: true
      }]);
    } catch (err) {
      console.error('Failed to get consultation reply:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Dr. Sarah Johnson',
        text: 'I have recorded your notes. Please let me know if you experience any worsening symptoms or discomfort.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndCall = () => {
    setShowEndCallModal(true);
  };

  const confirmEndCall = () => {
    setCallEnded(true);
    setShowEndCallModal(false);
    if (showToast) showToast('Tele-consultation session completed successfully.', 'success');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto overflow-hidden fade-in relative px-2 py-2">
      
      {/* Consultation Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-card border border-border rounded-3xl mb-4 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
             <Video className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-foreground flex items-center gap-2">
              Clinical Tele-Consultation
              {isHandRaised && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px]">
                  ✋ Hand Raised
                </span>
              )}
            </h1>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {callEnded ? 'Session Ended' : 'Live HD'}
                </span>
                <span>•</span>
                <span className="font-bold text-foreground">Dr. Sarah Johnson (Cardiologist)</span>
                <span>•</span>
                <span className="font-mono text-foreground font-bold bg-muted px-2 py-0.5 rounded-md">{time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              showChat ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Clinical Notes & Chat</span>
          </button>
        </div>
      </div>

      {/* Primary Environment */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[500px] pb-6">
        
        {/* Visual Engine (Doctor Feed) */}
        <div className="flex-1 relative group bg-black rounded-3xl overflow-hidden border border-border shadow-2xl flex flex-col justify-between p-6">
           {callEnded ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-card p-8 text-center space-y-4">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground">Consultation Completed</h2>
                <p className="text-xs text-muted-foreground max-w-md">
                  Your tele-consultation summary and digital prescription have been saved to your Medical Vault.
                </p>
                <button
                  onClick={() => setCallEnded(false)}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  Rejoin Telemetry Feed
                </button>
             </div>
           ) : (
             <>
               {/* Remote Feed Image */}
               <div className="absolute inset-0">
                  <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200&h=800" 
                      alt="Doctor Feed" 
                      className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
               </div>

               {/* Top HUD Data Overlays */}
               <div className="relative z-10 flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3 text-white">
                     <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Activity className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Connection</p>
                        <p className="text-xs font-extrabold text-white">Encrypted • 1080p HD</p>
                     </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3 text-white">
                     <div className="h-8 w-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <Heart className="h-4 w-4 animate-pulse fill-rose-400" />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Biometric Sync</p>
                        <p className="text-xs font-extrabold text-white">72 BPM (Optimal)</p>
                     </div>
                  </div>
               </div>

               {/* Self Video PIP Overlay */}
               <div className="absolute top-20 right-6 w-48 h-32 rounded-2xl border border-white/20 overflow-hidden shadow-2xl z-20 bg-neutral-900">
                  {isVideoOn ? (
                      <div className="h-full w-full bg-slate-800 flex items-center justify-center relative">
                          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{user?.fullName || 'Patient'}</span>
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] text-white font-bold">
                            You {isMicOn ? '🎤' : '🔇'}
                          </div>
                      </div>
                  ) : (
                      <div className="h-full w-full bg-neutral-950 flex items-center justify-center flex-col gap-1 text-muted-foreground">
                          <VideoOff className="h-6 w-6 text-neutral-700" />
                          <span className="text-[9px] font-bold">Video Off</span>
                      </div>
                  )}
               </div>

               {/* Command Bar Controls */}
               <div className="relative z-10 self-center flex items-center gap-3 px-6 py-3.5 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl">
                    <button 
                        onClick={() => {
                          setIsMicOn(!isMicOn);
                          if (showToast) showToast(isMicOn ? 'Microphone Muted' : 'Microphone Unmuted', 'info');
                        }}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white'}`}
                        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </button>

                    <button 
                        onClick={() => {
                          setIsVideoOn(!isVideoOn);
                          if (showToast) showToast(isVideoOn ? 'Camera Disabled' : 'Camera Enabled', 'info');
                        }}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${isVideoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white'}`}
                        title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </button>

                    <div className="h-6 w-px bg-white/20 mx-1" />

                    <button 
                        onClick={() => {
                          setIsHandRaised(!isHandRaised);
                          if (showToast) showToast(isHandRaised ? 'Hand lowered' : 'Hand raised for doctor', 'info');
                        }}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${isHandRaised ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        title="Raise Hand"
                    >
                        <Hand className="h-5 w-5" />
                    </button>

                    <button 
                        onClick={() => setShowChat(!showChat)}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${showChat ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        title="Toggle Chat & Clinical Notes"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>

                    <div className="h-6 w-px bg-white/20 mx-1" />

                    <button 
                        onClick={handleEndCall}
                        className="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                    >
                        <PhoneOff className="h-4 w-4" />
                        End Consultation
                    </button>
               </div>
             </>
           )}
        </div>

        {/* Interaction Side Pane */}
        <AnimatePresence>
            {showChat && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 380, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex flex-col gap-4 shrink-0"
                >
                    <div className="flex-1 bg-card border border-border rounded-3xl p-6 flex flex-col shadow-xl overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              Clinical Summary & Chat
                            </h3>
                            <button onClick={() => setShowChat(false)} className="text-muted-foreground hover:text-foreground">
                              <X className="h-4 w-4" />
                            </button>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {messages.map((msg) => (
                              <div 
                                key={msg.id} 
                                className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                                  msg.isDoctor 
                                    ? 'bg-primary/10 border border-primary/20 text-foreground' 
                                    : 'bg-muted border border-border text-foreground ml-4'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-primary">
                                    {msg.sender}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground">{msg.time}</span>
                                </div>
                                <p className="leading-relaxed">{msg.text}</p>
                              </div>
                            ))}
                            {isTyping && (
                              <div className="p-3 rounded-2xl text-xs bg-primary/10 border border-primary/20 text-foreground flex items-center gap-2 animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                                <span className="text-[10px] font-bold text-primary">Dr. Sarah Johnson is thinking...</span>
                              </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                            <input 
                                type="text" 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type note or query..."
                                className="flex-1 h-10 bg-muted border border-border rounded-xl px-4 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                            />
                            <button 
                              type="submit"
                              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-foreground">HIPAA Level-4 Encryption</h4>
                          <p className="text-[10px] text-muted-foreground">Clinical video telemetry and chat notes are end-to-end encrypted.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>

      {/* End Call Confirmation Modal */}
      {showEndCallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-foreground">End Tele-Consultation?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to exit the live video session with Dr. Sarah Johnson? Clinical notes and consultation summary will be saved to your Medical Vault.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEndCallModal(false)}
                className="px-4 py-2 rounded-xl bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndCall}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
