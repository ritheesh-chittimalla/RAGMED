import React, { useState, useRef, useEffect } from 'react';
import { useLocationContext, CITIES } from '../../contexts/LocationContext';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationSelector() {
  const { cityId, changeCity, currentCity } = useLocationContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="font-bold">{currentCity.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-card border border-border shadow-xl py-1.5 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
              Select City Location
            </div>
            <div className="py-1">
              {CITIES.map((city) => {
                const isSelected = city.id === cityId;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      changeCity(city.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{city.name}</span>
                      <span className="text-[10px] text-muted-foreground">({city.state})</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
