import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import { 
  HeartPulse, Calendar as CalendarIcon, ShieldCheck, 
  Activity, ArrowRight, Clock, MapPin, Search, ChevronRight, UserCircle, Bot, FileText
} from 'lucide-react';
import VoiceAssistant from '../components/VoiceAssistant';
import BookingModal from '../components/ui/BookingModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleDoctor, setRescheduleDoctor] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.getBookings();
      setAppointments(data || []);
    } catch (err) {
      console.error('Dashboard data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartAssistant = () => window.dispatchEvent(new CustomEvent('trigger-vapi'));
  const isDoctor = user?.role?.toLowerCase() === 'doctor';

  const upcomingApt = appointments.find(a => a.status !== 'cancelled' && a.status !== 'completed');
  const activeCount = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-10 fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Hello, {user?.fullName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium italic">
            Patient Medical Overview • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={handleStartAssistant}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-sm w-fit active:scale-95"
        >
          <Activity className="h-3.5 w-3.5" />
          Voice Consultation
        </button>
      </header>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <div className="bg-card/50 border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 tracking-tight uppercase">Optimal</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cardiac Status</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">Normal</h2>
            </div>
         </div>

         <div className="bg-card/50 border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Sessions</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">{activeCount}</h2>
            </div>
         </div>

         <div className="bg-card/50 border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-9 w-9 rounded-xl bg-neutral-500/10 text-neutral-400 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Medical Compliance</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">100%</h2>
            </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
          <div className="lg:col-span-2 space-y-8">
             {/* Quick Actions Grid */}
             <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Network', icon: UserCircle, path: '/doctors', color: 'emerald', detail: 'Specialists' },
                  { label: 'Schedule', icon: CalendarIcon, path: '/bookings', color: 'indigo', detail: 'Visits' },
                  { label: 'Records', icon: FileText, path: '/records', color: 'rose', detail: 'Data Vault' },
                  { label: 'Assistant', icon: Bot, path: '/assistant', color: 'amber', detail: 'AI Health' },
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="group bg-card border border-border p-5 rounded-2xl flex flex-col items-start gap-3 hover:border-primary/20 hover:bg-white/[0.02] transition-all text-left shadow-sm"
                  >
                     <div className={`h-10 w-10 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/10 flex items-center justify-center text-${action.color}-500 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-4.5 w-4.5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">{action.label}</p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-tighter mt-0.5">{action.detail}</p>
                     </div>
                  </button>
                ))}
             </section>

             <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Next Appointment</h3>
                 <button 
                  onClick={() => navigate('/bookings')}
                  className="text-sm font-medium text-primary hover:opacity-80 flex items-center gap-1"
                 >
                   View full schedule <ArrowRight className="h-4 w-4" />
                 </button>
               </div>
              
              {upcomingApt ? (
                <div className="bg-card rounded-[24px] border border-border p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {upcomingApt.date.includes('-') ? new Date(upcomingApt.date).toLocaleString('default', { month: 'short' }) : 'Next'}
                      </span>
                      <span className="text-xl font-semibold text-foreground leading-none mt-1">
                        {upcomingApt.date.includes('-') ? upcomingApt.date.split('-')[2].substring(0,2) : 'Apt'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{upcomingApt.doctor}</h4>
                      <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {upcomingApt.time}
                        <span className="mx-1.5 text-border">•</span>
                        <MapPin className="h-3.5 w-3.5" /> General Hospital
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {upcomingApt.status}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                          {upcomingApt.reason || 'Consultation'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:w-32 shrink-0">
                    <button 
                      onClick={() => navigate('/bookings')} 
                      className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                    >
                      Manage
                    </button>
                    <button 
                      onClick={() => setRescheduleDoctor({ 
                        name: upcomingApt.doctor, 
                        specialty: upcomingApt.specialty, 
                        hospital: upcomingApt.hospital || 'Parul Sevashram Hospital' 
                      })} 
                      className="w-full bg-card border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-all"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-[24px] border border-border p-10 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground mb-4">
                     <CalendarIcon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-medium text-foreground">No Upcoming Appointments</h4>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm">You have a clear schedule. You can use the smart assistant to book your next consultation.</p>
                </div>
              )}
            </section>
         </div>
         
         {/* Right Column: AI Insights / Timeline Preview */}
         <div className="flex flex-col gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">AI Insights</h3>
              </div>
              
              <div className="bg-card rounded-[24px] border border-border p-6 flex flex-col gap-5 shadow-sm">
                 <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-24 opacity-10 group-hover:opacity-30 transition-opacity">
                         <div className="h-full w-full flex items-end px-2 pb-2 gap-[2px]">
                             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                 <div key={i} className="flex-1 bg-amber-500 rounded-sm" style={{ height: `${h}%` }} />
                             ))}
                         </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 relative z-10">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="relative z-10">
                      <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-semibold">Sleep Pattern Irregular</h5>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Your smart watch detected inconsistent sleep cycles over the last 3 days.</p>
                    </div>
                 </div>
                 
                 <div className="h-px w-full bg-border/50" />
                 
                 <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-24 opacity-10 group-hover:opacity-30 transition-opacity">
                         <div className="h-full w-full flex items-end px-2 pb-2 gap-[2px]">
                             {[60, 62, 58, 65, 63, 61, 60].map((h, i) => (
                                 <div key={i} className="flex-1 bg-emerald-500 rounded-sm" style={{ height: `${h}%` }} />
                             ))}
                         </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 relative z-10">
                      <HeartPulse className="h-4 w-4" />
                    </div>
                    <div className="relative z-10">
                      <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-semibold">Blood Pressure Normal</h5>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Latest readings show perfectly stabilized blood pressure levels.</p>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => window.location.href = '/vitals'}
                  className="w-full mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                 >
                    View Full Report <ChevronRight className="h-3 w-3" />
                 </button>
              </div>
            </section>
         </div>

      </div>
      
      {/* Reschedule Booking Modal */}
      <BookingModal
        isOpen={Boolean(rescheduleDoctor)}
        onClose={() => setRescheduleDoctor(null)}
        doctor={rescheduleDoctor}
        onBookSuccess={() => {
          setRescheduleDoctor(null);
          fetchData();
        }}
      />

      {/* Invisible Voice Agent */}
      <VoiceAssistant user={user} onCallEnd={fetchData} />
    </div>
  );
}
