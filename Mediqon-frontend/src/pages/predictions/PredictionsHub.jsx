import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, History, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function PredictionsHub() {
  const navigate = useNavigate();

  const assessmentModules = [
    {
      id: 'heart',
      title: 'Heart Disease Assessment',
      category: 'Cardiovascular Risk',
      description: 'Evaluate overall cardiac risk probability based on Cleveland Heart Disease features (BP, Cholesterol, ECG, Angina, ST depression).',
      icon: Heart,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      route: '/predictions/heart',
      metrics: '13 Medical Parameters',
    },
    {
      id: 'diabetes',
      title: 'Diabetes Risk Assessment',
      category: 'Metabolic Health',
      description: 'Assess metabolic diabetes risk probability using Pima Indians features (Glucose, Insulin, BMI, Pedigree score, Age).',
      icon: Activity,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      route: '/predictions/diabetes',
      metrics: '8 Metabolic Indicators',
    },
    {
      id: 'kidney',
      title: 'Kidney Disease Assessment',
      category: 'Renal Function',
      description: 'Screen chronic kidney disease risk probability based on UCI CKD metrics (Serum Creatinine, Albumin, Urea, Hemoglobin).',
      icon: Droplets,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-500',
      badgeBg: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
      route: '/predictions/kidney',
      metrics: '24 Clinical Parameters',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              AI Multi-Disease Risk Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Predictive Health Intelligence
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Academic machine learning decision support prototype. Select a disease module below to perform risk assessment using validated clinical dataset features.
            </p>
          </div>

          <button
            onClick={() => navigate('/predictions/history')}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm border border-border transition-all shadow-sm hover:shadow-md"
          >
            <History className="w-4 h-4 text-primary group-hover:rotate-[-12deg] transition-transform" />
            <span>Prediction History</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Module Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assessmentModules.map((module) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate(module.route)}
              className={`group cursor-pointer rounded-3xl border bg-gradient-to-b ${module.color} p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-card/80 border border-border/50 shadow-sm backdrop-blur-md">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${module.badgeBg}`}>
                    {module.metrics}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {module.category}
                  </span>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-1">
                    {module.title}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  Start Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Random Forest Pipeline</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Academic Prototype Medical Safety Disclaimer */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
          <p className="font-bold uppercase tracking-wider">Academic Prototype Notice & Non-Diagnostic Disclaimer</p>
          <p className="leading-relaxed">
            This platform is an academic research prototype designed solely for demonstration and educational purposes. The underlying machine learning algorithms generate statistical probability estimates based on supplied input parameters. Predictions do not constitute a medical diagnosis, clinical evaluation, or doctor recommendation. Always consult a qualified physician for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
