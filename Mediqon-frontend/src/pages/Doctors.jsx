import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Clock, ArrowRight, ShieldCheck, Star, X, Loader2, Calendar as CalendarIcon, CheckCircle2, Award, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useSearchParams } from 'react-router-dom';
import BookingModal from '../components/ui/BookingModal';

const SPECIALTIES = ['All', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Endocrinologist', 'Oncologist', 'Nephrologist', 'Gastroenterologist', 'Psychiatrist', 'Radiologist', 'Orthopedic Surgeon', 'Pediatrician'];

const matchesSpecialty = (doc, targetSpecialty) => {
  if (!targetSpecialty || targetSpecialty === 'All') return true;

  const spec = (doc.specialty || '').toLowerCase();
  const specialization = (doc.specialization || '').toLowerCase();
  const target = targetSpecialty.toLowerCase();

  if (spec.includes(target) || specialization.includes(target) || target.includes(spec) || target.includes(specialization)) {
    return true;
  }

  const specialtyMap = {
    'neurologist': ['neuro', 'neurolog'],
    'cardiologist': ['cardio', 'cardiac', 'heart'],
    'oncologist': ['onco', 'cancer'],
    'psychiatrist': ['psych', 'mental'],
    'radiologist': ['radio', 'xray', 'mri', 'imaging'],
    'gastroenterologist': ['gastro', 'gut', 'digest'],
    'dermatologist': ['dermat', 'skin'],
    'orthopedic surgeon': ['ortho', 'bone', 'joint'],
    'pediatrician': ['pediat', 'child'],
    'endocrinologist': ['endo', 'diab'],
    'nephrologist': ['nephro', 'kidney']
  };

  const keywords = specialtyMap[target] || [target.slice(0, 4)];
  return keywords.some(kw => spec.includes(kw) || specialization.includes(kw));
};

export default function Doctors() {
  const { user } = useAuth();
  const { cityDoctors, currentCity } = useLocationContext();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await api.getDoctors();
        const merged = (data && data.length > 0) ? [...cityDoctors, ...data] : cityDoctors;

        const finalDoctors = merged.map((doc, idx) => {
           return {
              ...doc,
              fullName: doc.fullName || doc.name,
              image: doc.image || doc.photo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(doc.fullName || doc.name || 'Doctor')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
              fee: doc.fee || 1500,
              experienceYears: doc.experienceYears || doc.experience || 15,
              bio: doc.bio || 'Authorized board-certified clinical consultant focusing on precision patient diagnostics and integrative medicine.',
              specialty: doc.specialty || doc.specialization || 'Diagnostic Specialist'
           };
        });
        setDoctors(finalDoctors);
      } catch (err) {
        setDoctors(cityDoctors);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [cityDoctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSpec = matchesSpecialty(doc, selectedSpecialty);
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = 
        !query ||
        (doc.fullName || doc.name || '').toLowerCase().includes(query) || 
        (doc.specialty || '').toLowerCase().includes(query) ||
        (doc.specialization || '').toLowerCase().includes(query) ||
        (doc.hospital?.name || doc.hospital || '').toLowerCase().includes(query);

      return matchesSpec && matchesQuery;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
         <div className="relative">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
         </div>
         <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Advanced Clinician Registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto py-12 px-4 space-y-16 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border/50">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
             <div className="h-px w-8 bg-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Certified Network</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none italic">Verified Clinicians</h1>
          <p className="text-muted-foreground text-base font-medium max-w-lg">Access board-certified healthcare professionals authorized for primary clinical diagnostic sessions.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50 backdrop-blur-sm">
           <div className="bg-card w-12 h-12 rounded-xl border border-border flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-primary h-6 w-6" />
           </div>
           <div className="pr-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">100% Verified</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase">Clinical Accreditation</p>
           </div>
        </div>
      </header>

      <section className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, hospital, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-card border border-border rounded-2xl pl-12 pr-6 text-foreground text-sm outline-none focus:border-primary/30 transition-all font-medium placeholder:text-muted-foreground/40 shadow-sm"
            />
          </div>
          
          <div className="lg:col-span-8 flex items-center gap-2 overflow-x-auto no-scrollbar bg-card/50 border border-border p-1.5 rounded-2xl backdrop-blur-sm">
            {SPECIALTIES.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${
                  selectedSpecialty === spec
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full py-16 px-6 bg-card border border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">No Clinicians Found</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  No medical specialists matching "{selectedSpecialty}" were found in {currentCity?.name || 'your location'}.
                </p>
              </div>
              <button
                onClick={() => { setSelectedSpecialty('All'); setSearchQuery(''); }}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doc, idx) => (
              <motion.div
                layout
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-[2.5rem] overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all shadow-2xl flex flex-col md:flex-row relative"
              >
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/[0.03] to-transparent pointer-events-none" />
                
                {/* Information Panel (Left/Top) */}
                <div className="flex-1 p-8 md:p-10 space-y-8 relative z-10 border-b md:border-b-0 md:border-r border-border/40">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-2 py-1 rounded-md border border-primary/10">Diagnostic Expert</span>
                        {idx === 0 && <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1"><Star size={10} className="fill-current" /> Leading Specialist</span>}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-foreground tracking-tighter leading-none mb-2">{doc.fullName}</h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{doc.specialty}</p>
                      </div>
                   </div>

                   <p className="text-xs font-medium text-muted-foreground leading-relaxed italic max-w-sm opacity-80">
                      "{doc.bio || 'Authorized board-certified clinical consultant focusing on precision patient diagnostics and integrative medicine.'}"
                   </p>

                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            <MapPin size={12} />
                         </div>
                         <p className="text-[11px] font-black text-foreground/80 uppercase tracking-tight">{doc.hospital?.name || doc.hospital}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {(doc.tags || ['Verified Clinician']).map(tag => (
                            <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border/50 text-[9px] font-black text-muted-foreground/60 uppercase">
                               <CheckCircle2 size={10} className="text-emerald-500" />
                               {tag}
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 pb-2">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Fee Structure</p>
                         <p className="text-xl font-black text-foreground tracking-tight">₹{doc.fee}<span className="text-xs opacity-40 ml-1">INR</span></p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Experience</p>
                         <p className="text-xl font-black text-foreground tracking-tight">{doc.experienceYears || '15'} YRS<span className="text-xs opacity-40 ml-1">+</span></p>
                      </div>
                   </div>
                </div>

                {/* Portrait Panel (Right/Bottom) */}
                <div className="w-full md:w-[240px] bg-muted/20 relative group-hover:bg-muted/30 transition-colors p-8 flex flex-col items-center justify-center space-y-6">
                   <div className="relative">
                      <div className="h-40 w-40 rounded-[2rem] overflow-hidden bg-muted border border-border shadow-2xl relative">
                         <img 
                            src={doc.image} 
                            alt={doc.fullName} 
                            className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>
                      <div className="absolute -top-3 -right-3 h-[52px] w-[52px] bg-card rounded-2xl border-2 border-border flex items-center justify-center shadow-xl">
                         <ShieldCheck className="text-primary h-7 w-7" strokeWidth={2.5} />
                      </div>
                   </div>

                   <div className="w-full space-y-4">
                      <div className="flex items-center justify-center gap-4">
                         <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-7 w-7 rounded-lg ring-2 ring-card bg-muted border border-border overflow-hidden">
                                 <img src={`https://i.pravatar.cc/100?img=${doc.id + i}`} alt="Patient" className="h-full w-full grayscale opacity-60" />
                              </div>
                            ))}
                         </div>
                         <p className="text-[10px] font-black text-foreground/60 uppercase">86+ PATIENTS</p>
                      </div>

                      <button 
                         onClick={() => setSelectedDoctor(doc)}
                         className="w-full h-14 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-[0.98]"
                      >
                         SCHEDULING
                         <ArrowRight size={14} className="opacity-50" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </div>
      </section>

      {/* Unified Quick Booking Modal */}
      <BookingModal
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
        onBookSuccess={() => {
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
