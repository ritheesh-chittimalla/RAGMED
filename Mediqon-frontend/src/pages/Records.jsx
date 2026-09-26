import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, Search, Plus, MoreVertical, Download, Eye, 
  FilePieChart, Beaker, FileBadge, Calendar, Share2, Trash2, Bot, X, 
  Sparkles, Activity, ArrowRight, UploadCloud, CheckCircle, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

const INITIAL_RECORDS = [
  {
    id: 1,
    title: 'Post-Surgery Lab Results',
    category: 'Lab Report',
    date: '15 Mar 2026',
    doctor: 'Dr. Sarah Johnson',
    size: '1.2 MB',
    type: 'PDF',
    status: 'Verified',
  },
  {
    id: 2,
    title: 'Daily Medication Schedule',
    category: 'Prescription',
    date: '10 Mar 2026',
    doctor: 'Dr. Michael Chen',
    size: '450 KB',
    type: 'DOCX',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Annual Health Screening 2026',
    category: 'Full Summary',
    date: '20 Jan 2026',
    doctor: 'Multiple Specialists',
    size: '5.8 MB',
    type: 'PDF',
    status: 'Archived',
  },
  {
    id: 4,
    title: 'X-Ray Chest PA View',
    category: 'Imaging',
    date: '15 Feb 2026',
    doctor: 'Dr. Elena Rodriguez',
    size: '12.4 MB',
    type: 'JPG',
    status: 'Verified',
  },
];

const CATEGORIES = [
  { name: 'All', icon: FileText },
  { name: 'Lab Reports', icon: Beaker },
  { name: 'Prescriptions', icon: FileBadge },
  { name: 'Imaging', icon: FilePieChart },
];

export default function Records() {
  const { showToast } = useToast();
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Lab Report');
  const [newDocDoctor, setNewDocDoctor] = useState('Dr. Sarah Johnson');

  const filteredRecords = records.filter(rec => {
    const matchesCategory = selectedCategory === 'All' || rec.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1));
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setUploading(true);
    setTimeout(() => {
      const newRecord = {
        id: Date.now(),
        title: newDocTitle,
        category: newDocCategory,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        doctor: newDocDoctor,
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        type: newDocTitle.toLowerCase().includes('png') || newDocTitle.toLowerCase().includes('jpg') ? 'PNG' : 'PDF',
        status: 'Verified'
      };

      setRecords(prev => [newRecord, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
      setNewDocTitle('');
      if (showToast) showToast(`Document "${newRecord.title}" uploaded to Medical Vault successfully.`, 'success');
    }, 1000);
  };

  const handleDownload = (record) => {
    if (showToast) showToast(`Downloading "${record.title}" (${record.size})...`, 'info');
  };

  const handleShare = (record) => {
    navigator.clipboard.writeText(`https://mediqon.health/vault/share/${record.id}`);
    if (showToast) showToast(`Secure share link copied to clipboard for "${record.title}".`, 'success');
  };

  const handleDelete = (recordId, title) => {
    setRecords(prev => prev.filter(r => r.id !== recordId));
    if (showToast) showToast(`Deleted "${title}" from vault.`, 'info');
  };

  return (
    <div className="space-y-8 py-4 fade-in relative max-w-[1400px] mx-auto">
      
      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Upload Medical Document</h3>
                    <p className="text-xs text-muted-foreground">Store encrypted lab reports & prescriptions</p>
                  </div>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Lipid Panel Blood Test Report"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Category</label>
                    <select
                      value={newDocCategory}
                      onChange={(e) => setNewDocCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-bold outline-none focus:border-primary"
                    >
                      <option value="Lab Report">Lab Report</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Imaging">Imaging (X-Ray/MRI)</option>
                      <option value="Full Summary">Full Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Clinician / Origin</label>
                    <input
                      type="text"
                      value={newDocDoctor}
                      onChange={(e) => setNewDocDoctor(e.target.value)}
                      placeholder="Doctor Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-6 rounded-2xl text-center space-y-2 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-xs font-bold text-foreground">Click or drag file to attach (PDF, PNG, DOCX)</p>
                  <p className="text-[10px] text-muted-foreground">Files are encrypted with AES-256 before upload</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save to Vault'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">AI Document Analysis</h3>
                    <p className="text-xs text-muted-foreground">{selectedReport.title}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                       <Activity className="h-4 w-4" />
                       Clinical Synthesis
                    </h4>
                    <p className="text-xs text-foreground leading-relaxed italic">
                      "Analysis of {selectedReport.category.toLowerCase()} '{selectedReport.title}' indicates all key biomarkers remain stable. AI scan detects no critical anomalies requiring immediate intervention."
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-muted border border-border">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">OCR Confidence</p>
                       <p className="text-sm font-extrabold text-foreground">99.4% Verified</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-muted border border-border">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Risk Rating</p>
                       <p className="text-sm font-extrabold text-emerald-500">Low Risk</p>
                    </div>
                 </div>
              </div>

              <div className="pt-2 flex justify-end">
                 <button onClick={() => setSelectedReport(null)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    Close Analysis
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Medical Vault</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Encrypted Medical Document Storage (AES-256)
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Vault Files', value: records.length, icon: FileText },
          { label: 'Encrypted Storage', value: '24.2 MB', icon: FilePieChart },
          { label: 'Verified Lab Reports', value: records.filter(r => r.category === 'Lab Report').length, icon: Beaker },
          { label: 'Active Prescriptions', value: records.filter(r => r.category === 'Prescription').length, icon: FileBadge },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <h4 className="text-2xl font-extrabold text-foreground">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Main Filter & Table Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Category Sidebar */}
        <div className="w-full lg:w-64 space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Categories</p>
            <div className="space-y-1">
              {CATEGORIES.map((cat, i) => {
                const count = cat.name === 'All' 
                  ? records.length 
                  : records.filter(r => r.category.toLowerCase().includes(cat.name.toLowerCase().slice(0, -1))).length;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      selectedCategory === cat.name 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon className="h-4 w-4" />
                      {cat.name}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <h5 className="text-xs font-bold text-foreground">Privacy Guard Active</h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All documents are encrypted before being stored in distributed medical nodes.
            </p>
          </div>
        </div>

        {/* Document Table */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents by filename, doctor, or category..."
              className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Document Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Clinician</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-muted border border-border text-primary shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <h6 className="text-xs font-bold text-foreground">{rec.title}</h6>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {rec.date} • {rec.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-muted-foreground">
                          <span className="px-2.5 py-1 bg-muted border border-border rounded-lg text-[10px]">
                            {rec.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-foreground">
                          {rec.doctor}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedReport(rec)}
                              title="AI Report Scan"
                              className="p-2 rounded-lg text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(rec)}
                              title="Download File"
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleShare(rec)}
                              title="Share Document"
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rec.id, rec.title)}
                              title="Delete Document"
                              className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-xs text-muted-foreground">
                        No medical records found matching "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
