import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, Calendar as CalendarIcon, CheckCircle2, Stethoscope, Loader2, MapPin, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocationContext } from "../contexts/LocationContext";
import BookingModal from "./ui/BookingModal";

const SPECIALTY_KEYS = ["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "GeneralMedicine"];

export default function SmartBooking({ onBook, onStartAssistant }) {
  const { t } = useLanguage();
  const { cityDoctors, currentCity } = useLocationContext();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [cityDoctors]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctors();
      const merged = (data && data.length > 0) ? [...cityDoctors, ...data] : cityDoctors;

      const enhanced = merged.map((doc, idx) => ({
        ...doc,
        specialization: doc.specialization || doc.specialty || 'GeneralMedicine',
        rating: doc.rating || (4.7 + (idx % 3) * 0.1).toFixed(1),
        experience: doc.experience || (10 + idx * 2),
        fee: doc.fee || doc.price || 1200,
        photo: doc.photo || doc.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(doc.name || doc.fullName || 'Doctor')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
      }));

      setDoctors(enhanced);
    } catch (err) {
      setDoctors(cityDoctors);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchSpec = selectedSpecialty === "All" || (doc.specialization || "").toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchQuery = (doc.name || "").toLowerCase().includes(search.toLowerCase()) || 
                         (doc.specialization || "").toLowerCase().includes(search.toLowerCase()) ||
                         (doc.hospital?.name || "").toLowerCase().includes(search.toLowerCase());
      return matchSpec && matchQuery;
    });
  }, [doctors, search, selectedSpecialty]);

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4 bg-card border border-border rounded-[24px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium text-sm">Loading verified specialists in {currentCity.name}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* City Badge & Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 border border-border rounded-[20px] shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-xs shrink-0">
          <MapPin className="h-4 w-4" />
          <span>Showing Clinicians in {currentCity.name}</span>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={t('SearchDoctorsPlaceholder', 'Search by doctor name or condition...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {SPECIALTY_KEYS.map((specKey) => (
            <button
              key={specKey}
              onClick={() => setSelectedSpecialty(specKey)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedSpecialty === specKey
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
              }`}
            >
              {t(specKey, specKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc, idx) => (
          <motion.div
            key={doc.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="bg-card border border-border rounded-[20px] p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-border bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-foreground text-sm truncate">{doc.name}</h3>
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-primary">{t(doc.specialization, doc.specialization)}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" /> {doc.hospital?.name || `${currentCity.name} General Hospital`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50 mb-5">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doc.rating}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" /> {doc.experience} {t('YearsExp', 'yrs exp')}
                </span>
                <span className="text-border">•</span>
                <span className="text-foreground font-bold">
                  ₹{doc.fee}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenBooking(doc)}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {t('BookAppointment', 'Book Appointment')}
            </button>
          </motion.div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-card border border-border rounded-[20px]">
            <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <h4 className="text-sm font-bold text-foreground">No Specialists Found in {currentCity.name}</h4>
            <p className="text-muted-foreground text-xs mt-1">Try selecting another specialty or clear your search query.</p>
          </div>
        )}
      </div>

      {/* Unified Quick Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onBookSuccess={() => {
          if (onBook) onBook();
        }}
      />
    </div>
  );
}
