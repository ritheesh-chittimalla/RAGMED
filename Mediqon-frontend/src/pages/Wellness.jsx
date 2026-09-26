import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Leaf, Brain, Heart, Sparkles, ArrowRight, Zap, Microchip, ShieldCheck, X, CheckCircle2, Clock, FileText, Activity } from 'lucide-react';
import Articles from '../components/Articles';
import { useToast } from '../contexts/ToastContext';

export default function Wellness() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed to clinical updates transmission!', 'success');
    setEmailInput('');
  };

  return (
    <div className="flex flex-col gap-10 pb-24 fade-in px-2 max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Integrative Health Protocol Hero */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 lg:p-14 shadow-md transition-colors">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -z-0 opacity-50" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
           <div className="lg:col-span-7 space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                 <div className="h-px w-8 bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Integrative Wellness Protocols</span>
              </motion.div>
              
              <div className="space-y-4">
                 <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                    Optimizing Health through <br />
                    <span className="text-primary font-extrabold">Evidence-Based</span> Excellence.
                 </motion.h1>
                 <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm lg:text-base text-muted-foreground font-medium leading-relaxed max-w-lg">
                    Access a curated library of clinical health protocols, preventative research, and evidence-based medical paradigms.
                 </motion.p>
              </div>
              
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-3">
                 <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <input 
                       type="text" 
                       placeholder="Search clinical protocols or topics..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-11 pr-4 text-foreground text-xs outline-none focus:bg-card focus:border-primary transition-all font-medium placeholder:text-muted-foreground/60 shadow-sm"
                    />
                 </div>
                 <button 
                  onClick={() => setSelectedCategory('All')}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 transition-all whitespace-nowrap active:scale-95 shrink-0"
                 >
                    Explore Protocols
                 </button>
              </motion.div>
           </div>

           {/* Interactive Protocol Categories */}
           <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">
              {[
                 { id: 'Performance', icon: Zap, label: 'Performance', count: '12', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                 { id: 'Cognition', icon: Brain, label: 'Cognition', count: '24', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
                 { id: 'Longevity', icon: Microchip, label: 'Longevity', count: '08', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
                 { id: 'Preventative', icon: ShieldCheck, label: 'Preventative', count: '16', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
              ].map((card) => {
                 const isSelected = selectedCategory === card.id;
                 return (
                  <motion.div 
                     key={card.id}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setSelectedCategory(isSelected ? 'All' : card.id)}
                     className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                        isSelected 
                          ? 'bg-primary/10 border-primary shadow-md' 
                          : 'bg-card border-border hover:border-primary/40 hover:bg-muted/40'
                     }`}
                  >
                     <div className={`h-9 w-9 rounded-xl ${card.color} border shadow-sm flex items-center justify-center mb-3`}>
                        <card.icon className="h-4 w-4" />
                     </div>
                     <h3 className="text-sm font-bold text-foreground mb-0.5 tracking-tight">{card.label}</h3>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{card.count} Protocols</p>
                  </motion.div>
                 );
              })}
           </div>
        </div>
      </section>

      {/* Embedded Component Container */}
      <section>
        <Articles 
          searchQuery={searchQuery} 
          category={selectedCategory} 
          onSelectArticle={(article) => setSelectedProtocol(article)}
        />
      </section>

      {/* Clinical Updates Transmission Subscriptions */}
      <section className="relative rounded-[2.5rem] p-8 lg:p-14 overflow-hidden border border-border shadow-md flex flex-col items-center text-center gap-8 bg-card transition-colors">
         <div className="max-w-2xl relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Clinical Transmission</span>
                <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-foreground tracking-tight">Stay Informed on Healthcare.</h2>
            <p className="text-muted-foreground text-xs lg:text-sm font-medium max-w-lg mx-auto leading-relaxed">
               The latest medical breakthroughs, preventative protocols, and biological insights delivered to your queue.
            </p>
         </div>

         <form onSubmit={handleSubscribe} className="w-full max-w-md relative z-10 flex flex-col sm:flex-row items-center gap-2.5">
            <input 
               type="email" 
               required
               value={emailInput}
               onChange={(e) => setEmailInput(e.target.value)}
               placeholder="Enter your email address..."
               className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-primary transition-all text-xs"
            />
            <button type="submit" className="h-12 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md shrink-0 whitespace-nowrap">
               Subscribe
            </button>
         </form>
      </section>

      {/* Protocol Reader Modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProtocol(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }} 
              className="relative w-full max-w-2xl bg-card border border-border rounded-[24px] shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
            >
              <div className="relative h-48 sm:h-64 overflow-hidden shrink-0">
                <img src={selectedProtocol.image} alt={selectedProtocol.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <button 
                  onClick={() => setSelectedProtocol(null)}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded-md">
                    {selectedProtocol.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">{selectedProtocol.title}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-foreground">
                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-b border-border pb-4">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> {selectedProtocol.readTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-emerald-500 font-bold"><CheckCircle2 className="h-3.5 w-3.5" /> Peer Reviewed Protocol</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Clinical Summary</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{selectedProtocol.subtitle}</p>
                </div>

                <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Protocol Implementation Steps
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> Maintain consistent circadian rhythm with 7-8 hours sleep.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> Integrate preventative metabolic screenings every 6 months.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> Follow personalized dietary micro-nutrition guidelines.</li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => setSelectedProtocol(null)}
                    className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
                  >
                    Close Protocol
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
