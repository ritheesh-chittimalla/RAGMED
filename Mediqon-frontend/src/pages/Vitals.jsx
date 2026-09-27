import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Heart, Thermometer, Wind, Droplets, 
  ChevronRight, Info, ShieldCheck, Zap, ArrowRight, Plus, Download, FileText, ChevronDown, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

const DEFAULT_HEART_RATE_DATA = [
  { time: '08:00', value: 72 }, { time: '09:00', value: 75 }, { time: '10:00', value: 82 },
  { time: '11:00', value: 78 }, { time: '12:00', value: 74 }, { time: '13:00', value: 76 },
  { time: '14:00', value: 72 }
];

const DEFAULT_METRICS = [
  { id: 1, key: 'heartRate', label: 'Heart Rate', value: '72', unit: 'bpm', trend: '+2%', status: 'Normal', icon: Heart, color: 'emerald' },
  { id: 2, key: 'bloodPressure', label: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'Stable', status: 'Optimal', icon: Activity, color: 'emerald' },
  { id: 3, key: 'oxygen', label: 'Oxygen', value: '98', unit: '%', trend: '0%', status: 'Normal', icon: Droplets, color: 'emerald' },
  { id: 4, key: 'temperature', label: 'Temperature', value: '98.6', unit: '°F', trend: 'Stable', status: 'Normal', icon: Thermometer, color: 'emerald' },
];

export default function Vitals() {
  const navigate = useNavigate();
  const toast = useToast();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [selectedMetric, setSelectedMetric] = useState(DEFAULT_METRICS[0]);
  const [vitalsLogs, setVitalsLogs] = useState([]);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('healthVitalsLog') || '[]');
      setVitalsLogs(logs);

      if (logs.length > 0) {
        const latest = logs[0].metrics || {};
        setMetrics(prevMetrics => 
          prevMetrics.map(m => {
            if (m.key && latest[m.key]) {
              return { ...m, value: latest[m.key] };
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.warn('Error reading vitals logs:', err);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (msg, type = 'success') => {
    if (toast?.addToast) toast.addToast(msg, type);
    else if (toast?.showToast) toast.showToast(msg, type);
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    setExportMenuOpen(false);
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.slice(0, 10);

    const exportObject = {
      title: 'Mediqon Health Vitals & Clinical Metrics',
      exportedAt: timestamp,
      currentBiometrics: metrics.map(m => ({
        label: m.label,
        value: m.value,
        unit: m.unit,
        status: m.status,
        trend: m.trend
      })),
      timelineData: DEFAULT_HEART_RATE_DATA,
      historicalLogs: vitalsLogs
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `mediqon_vitals_${dateStr}.json`);
      triggerToast('Health Vitals exported successfully as JSON file.', 'success');
    } else if (format === 'csv') {
      let csvContent = 'MEDIQON HEALTH VITALS REPORT\n';
      csvContent += `Export Timestamp,${timestamp}\n\n`;
      
      csvContent += 'CURRENT CLINICAL METRICS\n';
      csvContent += 'Metric,Value,Unit,Status,Trend\n';
      metrics.forEach(m => {
        csvContent += `"${m.label}","${m.value}","${m.unit}","${m.status}","${m.trend}"\n`;
      });

      csvContent += '\n24H TIMELINE TREND (HEART RATE)\n';
      csvContent += 'Time,Value (bpm)\n';
      DEFAULT_HEART_RATE_DATA.forEach(d => {
        csvContent += `"${d.time}","${d.value}"\n`;
      });

      if (vitalsLogs.length > 0) {
        csvContent += '\nHISTORICAL BIOMETRIC LOGS\n';
        csvContent += 'Date/Time,Heart Rate,Blood Pressure,Oxygen,Respiration,Temperature\n';
        vitalsLogs.forEach(log => {
          const m = log.metrics || {};
          csvContent += `"${log.displayDate || log.timestamp}","${m.heartRate || '-'}","${m.bloodPressure || '-'}","${m.oxygen || '-'}","${m.respiration || '-'}","${m.temperature || '-'}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `mediqon_vitals_${dateStr}.csv`);
      triggerToast('Health Vitals exported successfully as CSV file.', 'success');
    } else if (format === 'print') {
      window.print();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4 space-y-10 antialiased">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight uppercase">Health Metrics</h1>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest italic">Clinical Data Summary • Live Stream</p>
        </div>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/vitals/add')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
                <Plus className="h-3.5 w-3.5" />
                Add Record
            </button>
            <div className="relative" ref={exportMenuRef}>
              <button 
                onClick={() => setExportMenuOpen(prev => !prev)}
                className="bg-card border border-border text-muted-foreground hover:text-foreground px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-all shadow-sm flex items-center gap-2 active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-emerald-500" />
                Export
                <ChevronDown className={`h-3 w-3 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {exportMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden p-1 space-y-1"
                  >
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-emerald-500" />
                        Export CSV
                      </span>
                      <Download className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-blue-500" />
                        Export JSON
                      </span>
                      <Download className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleExport('print')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Printer className="h-3.5 w-3.5 text-amber-500" />
                        Print / PDF
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
            <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric)}
                className={`bg-card border p-5 rounded-2xl flex flex-col items-start gap-4 transition-all text-left shadow-sm hover:border-border ${
                    selectedMetric.id === metric.id ? 'border-primary/30 bg-muted' : 'border-border hover:bg-muted'
                }`}
            >
                <div className={`h-9 w-9 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/10 flex items-center justify-center text-${metric.color}-500`}>
                    <metric.icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{metric.label}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-foreground">{metric.value}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase italic px-0.5">{metric.unit}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full mt-2 pt-3 border-t border-border">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{metric.status}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{metric.trend}</span>
                </div>
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border p-8 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground">
                        <Activity className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground uppercase tracking-tight">Timeline Analysis</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Historical clinical data • 24H</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
                    <button className="px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all bg-white/10 text-white shadow-sm border border-white/5">Day</button>
                    <button className="px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all">Week</button>
                </div>
            </div>

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DEFAULT_HEART_RATE_DATA}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.05}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.01)" />
                        <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#404040', fontSize: 9, fontWeight: 700 }} 
                            dy={10}
                        />
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--card)', 
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '10px'
                            }} 
                            itemStyle={{ color: 'var(--foreground)', padding: '0px' }}
                            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#chartGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm h-full">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Recent Records</h4>
                <div className="space-y-3">
                    {vitalsLogs.length > 0 ? (
                      vitalsLogs.slice(0, 3).map((log, index) => (
                        <div key={log.id || index} className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all cursor-pointer group hover:border-primary/20">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">Logged: HR {log.metrics?.heartRate || '72'} | BP {log.metrics?.bloodPressure || '120/80'}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{log.displayDate || 'Recently'}</p>
                                </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      ))
                    ) : (
                      [1, 2, 3].map(item => (
                          <div key={item} className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all cursor-pointer group hover:border-primary/20">
                              <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                      <ShieldCheck className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">Clinical Entry Verified</p>
                                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">2h ago</p>
                                  </div>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                      ))
                    )}
                </div>
            </div>

            <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-900/10 group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                        <Zap className="h-4 w-4 fill-current" />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Medical Health</h3>
                </div>
                <p className="text-xl font-bold text-white uppercase tracking-tight">Status: Prime</p>
            </div>
        </div>
      </div>
    </div>
  );
}
