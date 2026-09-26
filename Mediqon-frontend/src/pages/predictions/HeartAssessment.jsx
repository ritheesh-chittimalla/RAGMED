import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, AlertTriangle, CheckCircle, HelpCircle, Bot, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

import ReportUploadCard from '../../components/ReportUploadCard';

export default function HeartAssessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: 55,
    sex: 1,
    cp: 2,
    trestbps: 135,
    chol: 240,
    fbs: 0,
    restecg: 1,
    thalach: 145,
    exang: 0,
    oldpeak: 1.2,
    slope: 1,
    ca: 0,
    thal: 2,
  });

  const handleReportMetricsExtracted = (metrics) => {
    setFormData(prev => ({
      ...prev,
      ...metrics
    }));
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);

  const fillLowRiskDemo = () => {
    setFormData({
      age: 34,
      sex: 0,
      cp: 1,
      trestbps: 115,
      chol: 180,
      fbs: 0,
      restecg: 0,
      thalach: 172,
      exang: 0,
      oldpeak: 0.0,
      slope: 0,
      ca: 0,
      thal: 1,
    });
    setResult(null);
    setAiExplanation(null);
  };

  const fillHighRiskDemo = () => {
    setFormData({
      age: 63,
      sex: 1,
      cp: 0,
      trestbps: 165,
      chol: 295,
      fbs: 1,
      restecg: 2,
      thalach: 110,
      exang: 1,
      oldpeak: 3.2,
      slope: 2,
      ca: 3,
      thal: 3,
    });
    setResult(null);
    setAiExplanation(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'oldpeak' ? parseFloat(value) || 0 : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.predictHeart(formData);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to analyze heart risk. Ensure backend & ML services are running.');
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
        <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <Heart className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Heart Disease Risk Assessment
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            UCI Cleveland Heart Disease Random Forest Pipeline
          </p>
        </div>
      </div>

      {/* Report Upload & AI Extraction Banner */}
      <ReportUploadCard diseaseType="heart" onMetricsExtracted={handleReportMetricsExtracted} />

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
                <label className="text-xs font-bold text-muted-foreground block mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Male (1)</option>
                  <option value={0}>Female (0)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Chest Pain Type</label>
                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>Typical Angina (0)</option>
                  <option value={1}>Atypical Angina (1)</option>
                  <option value={2}>Non-anginal Pain (2)</option>
                  <option value={3}>Asymptomatic (3)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Resting BP (mm Hg)</label>
                <input
                  type="number"
                  name="trestbps"
                  value={formData.trestbps}
                  onChange={handleChange}
                  min="80"
                  max="240"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Serum Cholesterol (mg/dl)</label>
                <input
                  type="number"
                  name="chol"
                  value={formData.chol}
                  onChange={handleChange}
                  min="100"
                  max="600"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Fasting Sugar &gt; 120 mg/dl</label>
                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>False (0)</option>
                  <option value={1}>True (1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Resting ECG</label>
                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>Normal (0)</option>
                  <option value={1}>ST-T Abnormality (1)</option>
                  <option value={2}>LV Hypertrophy (2)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Max Heart Rate (thalach)</label>
                <input
                  type="number"
                  name="thalach"
                  value={formData.thalach}
                  onChange={handleChange}
                  min="60"
                  max="220"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Exercise Angina</label>
                <select
                  name="exang"
                  value={formData.exang}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>No (0)</option>
                  <option value={1}>Yes (1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">ST Depression (oldpeak)</label>
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  value={formData.oldpeak}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">ST Slope</label>
                <select
                  name="slope"
                  value={formData.slope}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>Upsloping (0)</option>
                  <option value={1}>Flat (1)</option>
                  <option value={2}>Downsloping (2)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Fluoroscopy Major Vessels</label>
                <select
                  name="ca"
                  value={formData.ca}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>0 Major Vessels</option>
                  <option value={1}>1 Major Vessel</option>
                  <option value={2}>2 Major Vessels</option>
                  <option value={3}>3 Major Vessels</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground block mb-1">Thalassemia Status</label>
                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Normal (1)</option>
                  <option value={2}>Fixed Defect (2)</option>
                  <option value={3}>Reversible Defect (3)</option>
                </select>
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
              className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Model Pipeline...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Analyze Heart Risk
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
                          <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
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
                  Fill in the patient clinical parameters on the left or click one of the demo buttons above to run the machine learning model.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
