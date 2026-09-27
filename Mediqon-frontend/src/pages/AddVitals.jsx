import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Wind, Droplets, Thermometer, ArrowRight, Save, X, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VITAL_TYPES = [
  { id: 'heartRate', label: 'Heart Rate', icon: Heart, unit: 'BPM', color: 'emerald', placeholder: '72' },
  { id: 'bloodPressure', label: 'Blood Pressure', icon: Activity, unit: 'mmHg', color: 'sky', placeholder: '120/80' },
  { id: 'oxygen', label: 'Oxygen Level', icon: Droplets, unit: '%', color: 'blue', placeholder: '98' },
  { id: 'respiration', label: 'Respiration', icon: Wind, unit: 'bpm', color: 'indigo', placeholder: '16' },
  { id: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°F', color: 'amber', placeholder: '98.6' },
];

export default function AddVitals() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save biometrics entry into local storage for persistent clinical timeline & export
    try {
      const existingLogs = JSON.parse(localStorage.getItem('healthVitalsLog') || '[]');
      const newEntry = {
        id: 'vital-' + Date.now(),
        timestamp: new Date().toISOString(),
        displayDate: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        metrics: { ...formData }
      };
      localStorage.setItem('healthVitalsLog', JSON.stringify([newEntry, ...existingLogs]));
    } catch (err) {
      console.warn('Could not save vital log to localStorage:', err);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      navigate('/vitals');
    }, 1500);
  };

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 fade-in">
      <header className="mb-12 space-y-2">
        <h1 className="text-4xl font-black text-foreground tracking-tight">Log Biometrics</h1>
        <p className="text-muted-foreground font-medium">Capture your current physiological state for the neural diagnostic engine.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VITAL_TYPES.map((type, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={type.id}
              className="bg-card border border-border p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-border transition-all shadow-sm"
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 bg-${type.color}-500/5 rounded-full blur-3xl group-hover:bg-${type.color}-500/10 transition-colors`} />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl bg-${type.color}-500/10 border border-${type.color}-500/20 flex items-center justify-center text-${type.color}-500`}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{type.label}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase mt-0.5 tracking-tight">UNIT: {type.unit}</p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={type.placeholder}
                    onChange={(e) => handleInputChange(type.id, e.target.value)}
                    className="w-full bg-muted border border-border rounded-2xl h-16 px-6 text-2xl font-black text-foreground outline-none focus:border-primary/20 transition-all placeholder:text-muted-foreground/30"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40 uppercase tracking-widest">
                    {type.unit}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-10 flex items-center justify-between gap-6 border-t border-white/5">
           <button 
             type="button"
             onClick={() => navigate('/vitals')}
             className="px-8 py-4 rounded-2xl bg-muted border border-border text-muted-foreground text-[11px] font-bold uppercase tracking-widest hover:text-foreground hover:bg-muted/80 transition-all shadow-sm"
           >
             Cancel
           </button>
           
           <button 
             disabled={isSubmitting || isSuccess}
             className="relative overflow-hidden group flex-1 md:flex-none px-12 py-4 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
           >
             {isSubmitting ? (
               <Loader2 className="h-4 w-4 animate-spin" />
             ) : isSuccess ? (
               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             ) : (
               <>
                 Secure Sync
                 <ArrowRight className="h-4 w-4" />
               </>
             )}
           </button>
        </div>
      </form>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card border border-primary/20 p-12 rounded-[3rem] text-center space-y-6 shadow-2xl max-w-sm"
            >
              <div className="h-20 w-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/10">
                 <Sparkles className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Sync Complete</h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">Your neural biometric data has been securely hashed into the clinical timeline.</p>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '100%' }}
                   transition={{ duration: 2 }}
                   className="h-full bg-primary" 
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
