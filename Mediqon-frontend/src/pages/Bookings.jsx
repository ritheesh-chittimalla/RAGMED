import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, PlusCircle, Globe, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

import BookingsDashboard from "../components/BookingsDashboard";
import SmartBooking from "../components/SmartBooking";
import VoiceAssistant from "../components/VoiceAssistant";

export default function Bookings() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const { user } = useAuth();
  const { t } = useLanguage();

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.getBookings();
      const dismissed = JSON.parse(localStorage.getItem('dismissedAppointments') || '[]');
      setAppointments((data || []).filter(apt => !dismissed.includes(apt.id)));
      setError(null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      if (!silent) setError("Sync Error: Unable to reach the hospital server.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(false);
    
    const onSync = () => fetchAppointments(true);
    window.addEventListener('sync-appointments', onSync);

    const interval = setInterval(() => {
      fetchAppointments(true);
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sync-appointments', onSync);
    };
  }, [fetchAppointments]);

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

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(isUpcoming).length;
    const completed = appointments.filter(a => !isUpcoming(a)).length;
    return { total, upcoming, completed };
  }, [appointments]);

  const handleCancel = async (id) => {
    if (!window.confirm("Confirm cancellation of this appointment?")) return;
    try {
      await api.cancelAppointment(id);
      setAppointments((prev) =>
        prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
      );
    } catch (err) {
      console.error(err);
      alert("System Error: Failed to process cancellation.");
    }
  };

  const handleDismiss = (id) => {
    setAppointments((prev) => prev.filter(apt => apt.id !== id));
    const dismissed = JSON.parse(localStorage.getItem('dismissedAppointments') || '[]');
    if (!dismissed.includes(id)) {
      localStorage.setItem('dismissedAppointments', JSON.stringify([...dismissed, id]));
    }
  };

  const handleBookComplete = () => {
    fetchAppointments(true);
    setActiveTab("dashboard");
  };

  const handleStartAssistant = () => window.dispatchEvent(new CustomEvent('trigger-vapi'));

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-10 fade-in">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t('Appointments', 'Appointments')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            {t('PatientOverview', 'Manage your schedule, book new visits, or review queue status.')}
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-xl border border-border shadow-inner">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "dashboard" 
                ? "bg-card text-foreground shadow-sm border border-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 text-primary" />
            {t('Overview', 'Overview')}
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "new" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {t('BookNew', 'Book New')}
          </button>
        </div>
      </header>

      {/* Quick Summary Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{t('UpcomingVisits', 'Upcoming Visits')}</span>
            <span className="text-2xl font-black text-foreground mt-0.5 block">{stats.upcoming}</span>
          </div>
          <div className="h-10 w-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{t('TotalScheduled', 'Total Scheduled')}</span>
            <span className="text-2xl font-black text-foreground mt-0.5 block">{stats.total}</span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{t('LiveQueue', 'Live Queue')}</span>
            <span className="text-2xl font-black text-primary mt-0.5 block">{stats.upcoming > 0 ? '#003' : '--'}</span>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold">
          <Globe className="h-4 w-4 animate-spin shrink-0" />
          {error}
        </div>
      )}

      {/* Main Content Pane */}
      <main className="min-h-[450px] relative">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.2 }}
            >
              <BookingsDashboard appointments={appointments} loading={loading} onCancel={handleCancel} onDismiss={handleDismiss} />
            </motion.section>
          ) : (
            <motion.section
              key="new"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.2 }}
            >
              <SmartBooking onBook={handleBookComplete} onStartAssistant={handleStartAssistant} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <VoiceAssistant user={user} onCallEnd={() => fetchAppointments()} />
    </div>
  );
}
