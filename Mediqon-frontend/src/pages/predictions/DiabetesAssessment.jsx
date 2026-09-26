import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowLeft, Sparkles, CheckCircle, HelpCircle, Bot, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

import ReportUploadCard from '../../components/ReportUploadCard';

export default function DiabetesAssessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pregnancies: 2,
    glucose: 138.0,
    blood_pressure: 72.0,
    skin_thickness: 35.0,
    insulin: 0.0,
    bmi: 33.6,
    dpf: 0.627,
    age: 47,
  });

  const handleReportMetricsExtracted = (metrics) => {
    setFormData(prev => ({
      ...prev,
      ...metrics,
      blood_pressure: metrics.bloodPressure ?? metrics.blood_pressure ?? prev.blood_pressure,
      skin_thickness: metrics.skinThickness ?? metrics.skin_thickness ?? prev.skin_thickness,
      dpf: metrics.diabetesPedigreeFunction ?? metrics.dpf ?? prev.dpf,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fillLowRiskDemo = () => {
    setFormData({
      pregnancies: 1,
      glucose: 85.0,
      blood_pressure: 66.0,
      skin_thickness: 20.0,
      insulin: 70.0,
      bmi: 22.5,
      dpf: 0.254,
      age: 26,
    });
    setResult(null);
  };

  const fillHighRiskDemo = () => {
    setFormData({
      pregnancies: 6,
      glucose: 178.0,
      blood_pressure: 90.0,
      skin_thickness: 42.0,
      insulin: 210.0,
      bmi: 40.2,
      dpf: 1.25,
      age: 58,
    });
    setResult(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'dpf'].includes(name)
        ? parseFloat(value) || 0
        : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.predictDiabetes(formData);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to analyze diabetes risk. Ensure backend & ML services are running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'Moderate':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/predictions')}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillLowRiskDemo}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            Demo Low Risk
          </button>
          <button
            type="button"
            onClick={fillHighRiskDemo}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            Demo High Risk
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Activity className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Diabetes Risk Assessment
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Pima Indians Diabetes Random Forest Pipeline
          </p>
        </div>
      </div>

      {/* Report Upload & AI Extraction Banner */}
      <ReportUploadCard diseaseType="diabetes" onMetricsExtracted={handleReportMetricsExtracted} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Patient Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Pregnancies Count</label>
                <input
                  type="number"
                  name="pregnancies"
                  value={formData.pregnancies}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Plasma Glucose (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  min="0"
                  max="300"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Diastolic BP (mm Hg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Skin Thickness (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="skin_thickness"
                  value={formData.skin_thickness}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Serum Insulin (mu U/ml)</label>
                <input
                  type="number"
                  step="0.1"
                  name="insulin"
                  value={formData.insulin}
                  onChange={handleChange}
                  min="0"
                  max="900"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Body Mass Index (BMI)</label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  min="0"
                  max="70"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Diabetes Pedigree Function</label>
                <input
                  type="number"
                  step="0.001"
                  name="dpf"
                  value={formData.dpf}
                  onChange={handleChange}
                  min="0"
                  max="3"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Model Pipeline...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Analyze Diabetes Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                {/* Result Card */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prediction Output</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getRiskBadgeColor(result.risk_level)}`}>
                      {result.risk_level} Risk
                    </span>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                      {(result.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {result.prediction_label}
                    </p>
                  </div>

                  {/* Key Factors */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Key Risk Factors</span>
                    <ul className="space-y-2">
                      {result.top_risk_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-foreground bg-muted/40 p-2.5 rounded-xl border border-border/40">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{result.disclaimer}</span>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-3 bg-card/40">
                <HelpCircle className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                <h3 className="text-sm font-bold text-foreground">No Active Assessment</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Fill in the patient metabolic parameters on the left or click one of the demo buttons above to run the machine learning model.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
