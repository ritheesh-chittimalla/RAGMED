import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  User, CheckCircle2, XCircle, Search, Filter, MoreHorizontal
} from "lucide-react";

const getStatusColor = (status) => {
  const norm = (status || '').toLowerCase();
  if (norm.includes('booked') || norm.includes('confirmed')) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (norm.includes('cancel')) return "bg-destructive/10 text-destructive border-destructive/20";
  if (norm.includes('completed')) return "bg-primary/10 text-primary border-primary/20";
  return "bg-amber-500/10 text-amber-600 border-amber-500/20";
};

export default function BookingsDashboard({ appointments, loading, onCancel }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isUpcoming = (a) => {
    if (!a) return false;
    const status = (a.status || '').toLowerCase();
    if (status.includes('cancel') || status.includes('completed')) return false;

    if (a.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let aptDate;
      if (typeof a.date === 'string') {
        const parts = a.date.split('T')[0].split('-');
        if (parts.length === 3) {
          aptDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        } else {
          aptDate = new Date(a.date);
        }
      } else {
        aptDate = new Date(a.date);
      }

      if (aptDate && !isNaN(aptDate.getTime())) {
        aptDate.setHours(23, 59, 59, 999);
        if (aptDate < today) {
          return false;
        }
      }
    }
    return true;
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    let result = appointments;
    
    if (filter === 'active') {
      result = result.filter(isUpcoming);
    } else if (filter === 'cancelled') {
      result = result.filter(a => !isUpcoming(a));
    }

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        result = result.filter(a => 
            (a.doctor || '').toLowerCase().includes(query) || 
            (a.patient_name || '').toLowerCase().includes(query) ||
            String(a.token_number || '').includes(query)
        );
    }
    
    return result;
  }, [appointments, filter, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-full rounded-xl bg-card border border-border" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full rounded-2xl bg-card border border-border" />
        ))}
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-muted/30 py-32 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm border border-border text-muted-foreground">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">No Appointments Found</h3>
        <p className="max-w-xs text-muted-foreground text-sm font-medium leading-relaxed">
          Your schedule is clear. Book a consultation or speak to the smart assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-2 border border-border rounded-[16px] shadow-sm">
        
        {/* Toggle Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-muted">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-5 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            All View
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={`px-5 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all ${filter === 'active' ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('cancelled')} 
            className={`px-5 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all ${filter === 'cancelled' ? 'bg-card text-destructive shadow-sm border border-destructive/20' : 'text-muted-foreground hover:text-destructive'}`}
          >
            Expired
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search doctor or patient..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 rounded-[10px] border border-border bg-card pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-muted transition-colors">
                <Filter className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Hybrid List/Card View */}
      <div className="flex flex-col gap-3">
        {filteredAppointments.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-neutral-200/60 rounded-[20px] shadow-sm">
             <Search className="h-8 w-8 text-neutral-300 mb-4" />
             <p className="text-neutral-500 text-sm font-semibold">No results matching your filters.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAppointments.map((apt) => (
              <motion.div
                key={apt.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)" }}
                className="bg-card border border-border rounded-[16px] shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                
                {/* Left: Date Block + Doctor Info */}
                <div className="flex items-center gap-5 xl:w-[45%]">
                    {/* Date Block */}
                    <div className="hidden sm:flex flex-col items-center justify-center h-[60px] w-[60px] rounded-2xl bg-muted border border-border shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{apt.date ? apt.date.split('-')[1] : 'M'}</span>
                        <span className="text-xl font-bold text-foreground leading-none mt-0.5">{apt.date ? apt.date.split('-')[2] : 'D'}</span>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col group cursor-pointer w-full">
                        <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{apt.doctor || 'Doctor'}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground/60" /> {apt.specialty || 'General'}</span>
                            <span className="text-border hidden md:block">•</span>
                            <span className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-0.5 rounded-md"><User className="h-3.5 w-3.5" /> {apt.patient_name || 'Patient'}</span>
                        </div>
                    </div>
                </div>

                {/* Center: Token & Schedule Details */}
                <div className="flex items-center gap-6 xl:w-[35%] py-3 md:py-0 border-y md:border-y-0 md:border-l border-border md:pl-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Time</span>
                        <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-indigo-500" /> {apt.time || 'TBD'}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Queue ID</span>
                        <span className="text-sm font-bold text-foreground font-mono bg-muted px-2 py-0.5 rounded-md">
                            #{String(apt.token_number || "0").padStart(3, '0')}
                        </span>
                    </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 xl:w-[20%]">
                    <div className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-widest w-fit min-w-[100px] text-center ${getStatusColor(apt.status)}`}>
                        {apt.status || "Pending"}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {apt.status !== 'cancelled' ? (
                            <button 
                                onClick={() => onCancel(apt.id)}
                                className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button 
                                onClick={() => onDismiss && onDismiss(apt.id)}
                                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground border border-border text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-all shadow-sm"
                            >
                                Dismiss
                            </button>
                        )}
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100/10 hover:text-neutral-900 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
