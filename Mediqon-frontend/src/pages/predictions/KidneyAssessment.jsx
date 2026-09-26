import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ArrowLeft, Sparkles, CheckCircle, HelpCircle, Bot, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

import ReportUploadCard from '../../components/ReportUploadCard';

export default function KidneyAssessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: 48,
    bp: 80.0,
    sg: 1.020,
    al: 1,
    su: 0,
    rbc: 0,
    pc: 0,
    pcc: 0,
    ba: 0,
    bgr: 121.0,
    bu: 36.0,
    sc: 1.2,
    sod: 137.0,
    pot: 4.4,
    hemo: 15.4,
    pcv: 44.0,
    wbcc: 7800.0,
    rbcc: 5.2,
    htn: 1,
    dm: 1,
    cad: 0,
    appet: 0,
    pe: 0,
    ane: 0,
  });

  const handleReportMetricsExtracted = (metrics) => {
    const mapped = { ...metrics };
    if (typeof metrics.rbc === 'string') mapped.rbc = metrics.rbc === 'abnormal' ? 1 : 0;
    if (typeof metrics.pc === 'string') mapped.pc = metrics.pc === 'abnormal' ? 1 : 0;
    if (typeof metrics.pcc === 'string') mapped.pcc = metrics.pcc === 'present' ? 1 : 0;
    if (typeof metrics.ba === 'string') mapped.ba = metrics.ba === 'present' ? 1 : 0;
    if (typeof metrics.htn === 'string') mapped.htn = metrics.htn === 'yes' ? 1 : 0;
    if (typeof metrics.dm === 'string') mapped.dm = metrics.dm === 'yes' ? 1 : 0;
    if (typeof metrics.cad === 'string') mapped.cad = metrics.cad === 'yes' ? 1 : 0;
    if (typeof metrics.appet === 'string') mapped.appet = metrics.appet === 'poor' ? 1 : 0;
    if (typeof metrics.pe === 'string') mapped.pe = metrics.pe === 'yes' ? 1 : 0;
    if (typeof metrics.ane === 'string') mapped.ane = metrics.ane === 'yes' ? 1 : 0;
    if (metrics.wc !== undefined) mapped.wbcc = metrics.wc;
    if (metrics.rc !== undefined) mapped.rbcc = metrics.rc;

    setFormData(prev => ({
      ...prev,
      ...mapped
    }));
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fillLowRiskDemo = () => {
    setFormData({
      age: 32,
      bp: 70.0,
      sg: 1.025,
      al: 0,
      su: 0,
      rbc: 0,
      pc: 0,
      pcc: 0,
      ba: 0,
      bgr: 95.0,
      bu: 22.0,
      sc: 0.8,
      sod: 142.0,
      pot: 4.2,
      hemo: 16.2,
      pcv: 48.0,
      wbcc: 6500.0,
      rbcc: 5.5,
      htn: 0,
      dm: 0,
      cad: 0,
      appet: 0,
      pe: 0,
      ane: 0,
    });
    setResult(null);
  };

  const fillHighRiskDemo = () => {
    setFormData({
      age: 65,
      bp: 90.0,
      sg: 1.010,
      al: 3,
      su: 2,
      rbc: 1,
      pc: 1,
      pcc: 1,
      ba: 0,
      bgr: 210.0,
      bu: 85.0,
      sc: 4.5,
      sod: 130.0,
      pot: 5.8,
      hemo: 8.5,
      pcv: 26.0,
      wbcc: 11200.0,
      rbcc: 3.1,
      htn: 1,
      dm: 1,
      cad: 0,
      appet: 1,
      pe: 1,
      ane: 1,
    });
    setResult(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['bp', 'sg', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wbcc', 'rbcc'].includes(name)
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
      const response = await api.predictKidney(formData);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to analyze kidney risk. Ensure backend & ML services are running.');
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
        <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
          <Droplets className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Chronic Kidney Disease Risk Assessment
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            UCI Chronic Kidney Disease (CKD) Random Forest Pipeline
          </p>
        </div>
      </div>

      {/* Report Upload & AI Extraction Banner */}
      <ReportUploadCard diseaseType="kidney" onMetricsExtracted={handleReportMetricsExtracted} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Renal Clinical Parameters
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
                <label className="text-xs font-bold text-muted-foreground block mb-1">Blood Pressure (mm/Hg)</label>
                <input
                  type="number"
                  step="1"
                  name="bp"
                  value={formData.bp}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Serum Creatinine (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  name="sc"
                  value={formData.sc}
                  onChange={handleChange}
                  min="0.4"
                  max="20"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Blood Urea (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  name="bu"
                  value={formData.bu}
                  onChange={handleChange}
                  min="10"
                  max="400"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Urine Specific Gravity (sg)</label>
                <select
                  name="sg"
                  value={formData.sg}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1.005}>1.005</option>
                  <option value={1.010}>1.010</option>
                  <option value={1.015}>1.015</option>
                  <option value={1.020}>1.020</option>
                  <option value={1.025}>1.025</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Albumin (0 to 5)</label>
                <select
                  name="al"
                  value={formData.al}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5 (High)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Hemoglobin (gms)</label>
                <input
                  type="number"
                  step="0.1"
                  name="hemo"
                  value={formData.hemo}
                  onChange={handleChange}
                  min="3"
                  max="20"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Blood Glucose Random (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  name="bgr"
                  value={formData.bgr}
                  onChange={handleChange}
                  min="50"
                  max="500"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Hypertension</label>
                <select
                  name="htn"
                  value={formData.htn}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>No (0)</option>
                  <option value={1}>Yes (1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Diabetes Mellitus</label>
                <select
                  name="dm"
                  value={formData.dm}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>No (0)</option>
                  <option value={1}>Yes (1)</option>
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
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Model Pipeline...
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  Analyze Kidney Risk
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
                          <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
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
                  Fill in the patient renal clinical parameters on the left or click one of the demo buttons above to run the machine learning model.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
