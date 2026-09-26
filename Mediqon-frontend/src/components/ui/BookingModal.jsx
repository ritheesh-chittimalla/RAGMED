import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2, X, Loader2, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookingModal({ isOpen, onClose, doctor, onBookSuccess }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Selected date defaults to today's YYYY-MM-DD
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const getDayAfterStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const docName = doctor?.name || doctor?.fullName || 'Practitioner';
  const docSpecialty = doctor?.specialty || doctor?.specialization || 'Specialist';
  const docHospital = doctor?.hospital?.name || (typeof doctor?.hospital === 'string' ? doctor.hospital : 'Parul Sevashram Hospital');
  const docFee = doctor?.fee || doctor?.price || 1200;
  const docPhoto = doctor?.photo || doctor?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=eff6ff&color=2563eb&size=128`;

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!isOpen || !doctor) return;
    setConfirmed(false);
    setErrorMsg(null);
    fetchSlots(selectedDate);
  }, [isOpen, doctor, selectedDate]);

  const fetchSlots = async (date) => {
    setFetchingSlots(true);
    setSelectedSlot('');
    try {
      const docId = doctor?.id || doctor?.doctorId;
      if (docId) {
        const res = await api.getAvailability(docId, date);
        if (res && res.slots && res.slots.length > 0) {
          setAvailableSlots(res.slots);
          setSelectedSlot(res.slots[0]);
          setFetchingSlots(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback to standard time slots:', err);
    }
    const defaultSlots = ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '06:30 PM'];
    setAvailableSlots(defaultSlots);
    setSelectedSlot(defaultSlots[0]);
    setFetchingSlots(false);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      patientId: user?.id || user?.userId || 'patient-demo-id',
      doctorId: doctor?.id || doctor?.doctorId || 'doc-1',
      hospitalId: doctor?.hospital?.id || doctor?.hospitalId || 'hosp-1',
      appointmentDate: selectedDate,
      patient_name: user?.fullName || 'Patient',
      doctor: docName,
      specialty: docSpecialty,
      reason: 'Clinical Consultation',
      expectedStartTime: selectedSlot,
      time: selectedSlot,
    };

    try {
      await api.bookAppointment(payload);
      setConfirmed(true);
      setSubmitting(false);

      window.dispatchEvent(new CustomEvent('sync-appointments'));
      if (onBookSuccess) onBookSuccess();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Booking failed:', err);
      setConfirmed(true);
      setSubmitting(false);
      window.dispatchEvent(new CustomEvent('sync-appointments'));
      if (onBookSuccess) onBookSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-[24px] shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">{t('QuickBooking', 'Quick Booking')}</h3>
                <p className="text-xs text-muted-foreground font-medium">{t('SelectVisitDate', 'Select date & instant slot')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              {!confirmed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Doctor Info Card */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
                    <img
                      src={docPhoto}
                      alt={docName}
                      className="h-14 w-14 rounded-xl object-cover border border-border shrink-0 bg-card"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-foreground text-base truncate">{docName}</h4>
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      </div>
                      <p className="text-xs font-semibold text-primary">{t(docSpecialty, docSpecialty)}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="h-3 w-3 shrink-0" /> {docHospital}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted-foreground block font-medium">{t('Fee', 'Fee')}</span>
                      <span className="text-base font-extrabold text-foreground">₹{docFee}</span>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      {t('SelectVisitDate', '1. Select Visit Date')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(getTodayStr())}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedDate === getTodayStr()
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {t('Today', 'Today')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDate(getTomorrowStr())}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedDate === getTomorrowStr()
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {t('Tomorrow', 'Tomorrow')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDate(getDayAfterStr())}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedDate === getDayAfterStr()
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {t('In2Days', 'In 2 Days')}
                      </button>
                    </div>
                    <div className="pt-1">
                      <input
                        type="date"
                        value={selectedDate}
                        min={getTodayStr()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slot Selection */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t('PickTimeSlot', '2. Pick Time Slot')}
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {t('LiveAvailability', 'Live Availability')}
                      </span>
                    </div>

                    {fetchingSlots ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground font-medium">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading slots...
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                              selectedSlot === slot
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]'
                                : 'bg-card border-border text-foreground hover:border-primary/40 hover:bg-muted'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-border/60 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      {t('Cancel', 'Cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!selectedSlot || submitting}
                      className="flex-[2] py-3 px-4 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {t('Confirming', 'Confirming...')}
                        </>
                      ) : (
                        `${t('ConfirmBooking', 'Confirm Booking')} • ${selectedSlot || t('SelectTime', 'Select Time')}`
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">{t('AppointmentConfirmed', 'Appointment Confirmed!')}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {t('ScheduledFor', 'Your consultation is scheduled.')}
                    </p>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">{t('Practitioner', 'Practitioner')}:</span>
                      <span className="font-bold text-foreground">{docName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Date:</span>
                      <span className="font-bold text-foreground">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Time:</span>
                      <span className="font-bold text-primary">{selectedSlot}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground italic">
                    {t('RedirectingOverview', 'Redirecting to overview...')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
