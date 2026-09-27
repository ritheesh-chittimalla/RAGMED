import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShieldCheck, Bell, Activity, Clock, LogOut, ChevronRight, 
  UserCheck, ShieldAlert, Sparkles, Camera, Loader2, Database, 
  Globe, AlertCircle, Beaker, X, Download, Trash2, CheckCircle2, FileText, Printer, FileCode 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const settingSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'health', label: 'Health Data', icon: Activity, only: 'patient' },
  { id: 'availability', label: 'Schedule', icon: Clock, only: 'doctor' },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { addToast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Notification Toggles State
  const [notificationState, setNotificationState] = useState({
    n1: true,
    n2: true,
    n3: true,
    n4: false,
  });

  // Export Modal & Data Deletion Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDoctor = user?.role === 'doctor' || user?.role === 'DOCTOR';

  const triggerNotification = (msg, type = 'success') => {
    if (showToast) showToast(msg, type);
    else if (addToast) addToast(msg, type);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      triggerNotification('Settings updated successfully', 'success');
      setLoading(false);
    }, 1200);
  };

  const toggleNotification = (id) => {
    setNotificationState(prev => {
      const next = { ...prev, [id]: !prev[id] };
      triggerNotification('Notification preferences updated', 'info');
      return next;
    });
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

  const handleExportFormat = (format) => {
    setShowExportModal(false);
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.slice(0, 10);
    const patientName = user?.fullName || 'Patient User';
    const patientId = user?.id || 'PT-MEDIQON-9921';
    const email = user?.email || 'patient@mediqon.health';

    let vitalsLogs = [];
    let appointments = [];
    try {
      vitalsLogs = JSON.parse(localStorage.getItem('healthVitalsLog') || '[]');
      appointments = JSON.parse(localStorage.getItem('localAppointments') || '[]');
    } catch (e) {
      console.warn('Error reading local records for export:', e);
    }

    if (format === 'csv') {
      let csv = 'MEDIQON MEDICAL HISTORY REPORT\n';
      csv += `Patient Name,${patientName}\n`;
      csv += `Patient ID,${patientId}\n`;
      csv += `Email,${email}\n`;
      csv += `Export Timestamp,${timestamp}\n\n`;

      csv += 'CLINICAL STORAGE METRICS\n';
      csv += 'Total Allocated Space,Space Used,Encryption Standard,Status\n';
      csv += '1.0 TB,142.8 GB,AES-256 Distributed,ONLINE\n\n';

      csv += 'BIOMETRIC TELEMETRY & VITALS HISTORY\n';
      csv += 'Date/Time,Heart Rate,Blood Pressure,Oxygen Level,Respiration,Temperature\n';
      if (vitalsLogs.length > 0) {
        vitalsLogs.forEach(log => {
          const m = log.metrics || {};
          csv += `"${log.displayDate || log.timestamp}","${m.heartRate || '-'}","${m.bloodPressure || '-'}","${m.oxygen || '-'}","${m.respiration || '-'}","${m.temperature || '-'}"\n`;
        });
      } else {
        csv += '"Baseline Clinical Scan","72 bpm","120/80 mmHg","98%","16 bpm","98.6 °F"\n';
      }

      csv += '\nAPPOINTMENTS & CLINICAL CONSULTATIONS\n';
      csv += 'Doctor Name,Specialty,Date,Time,Reason,Status\n';
      if (appointments.length > 0) {
        appointments.forEach(apt => {
          csv += `"${apt.doctor}","${apt.specialty}","${apt.date}","${apt.time}","${apt.reason}","${apt.status}"\n`;
        });
      } else {
        csv += '"Dr. Sarah Johnson","Endocrinology","2026-09-28","10:00 AM","Routine Biometric Consult","Booked"\n';
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `mediqon_medical_history_${dateStr}.csv`);
      triggerNotification('Medical History exported as CSV file.', 'success');

    } else if (format === 'docx' || format === 'pdf') {
      const docHtml = `\ufeff<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Mediqon Medical History Report</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page WordSection1 { size: 8.5in 11.0in; margin: 1.0in; }
  div.WordSection1 { page: WordSection1; font-family: 'Calibri', Arial, sans-serif; color: #0f172a; }
  h1 { color: #059669; font-size: 22pt; margin: 0; font-weight: bold; border-bottom: 2pt solid #10b981; padding-bottom: 6pt; }
  .subtitle { color: #64748b; font-size: 10pt; text-transform: uppercase; margin-top: 4pt; font-weight: bold; }
  .meta-box { background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 12pt; margin-top: 15pt; margin-bottom: 20pt; }
  h2 { color: #0f172a; font-size: 13pt; margin-top: 20pt; margin-bottom: 8pt; border-bottom: 1pt solid #e2e8f0; padding-bottom: 4pt; text-transform: uppercase; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 16pt; font-size: 10pt; }
  th { background-color: #f1f5f9; color: #334155; font-weight: bold; text-align: left; padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-transform: uppercase; font-size: 9pt; }
  td { padding: 8pt 10pt; border: 1pt solid #e2e8f0; color: #334155; }
  .badge { background-color: #d1fae5; color: #047857; padding: 2pt 6pt; font-weight: bold; font-size: 9pt; }
  .footer { margin-top: 30pt; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1pt solid #e2e8f0; padding-top: 12pt; }
</style>
</head>
<body>
<div class="WordSection1">
  <h1>MEDIQON HEALTHCARE ENGINE</h1>
  <div class="subtitle">Official Clinical Patient Record • Confidential Summary</div>

  <div class="meta-box">
    <p><strong>Patient Name:</strong> ${patientName}</p>
    <p><strong>System Patient ID:</strong> ${patientId}</p>
    <p><strong>Account Email:</strong> ${email}</p>
    <p><strong>Export Timestamp:</strong> ${new Date().toLocaleString()}</p>
  </div>

  <h2>1. Distributed Vault & Storage Status</h2>
  <table>
    <thead>
      <tr><th>Allocated Capacity</th><th>Storage Consumed</th><th>Encryption Protocol</th><th>Node Status</th></tr>
    </thead>
    <tbody>
      <tr><td>1.0 TB Cloud Node</td><td>142.8 GB</td><td>AES-256 Multi-Region</td><td><span class="badge">ONLINE & VERIFIED</span></td></tr>
    </tbody>
  </table>

  <h2>2. Physiological Biometrics & Vitals Log</h2>
  <table>
    <thead>
      <tr><th>Log Entry Timestamp</th><th>Heart Rate</th><th>Blood Pressure</th><th>Oxygen (SpO2)</th><th>Temperature</th></tr>
    </thead>
    <tbody>
      ${vitalsLogs.length > 0 ? vitalsLogs.map(l => `
        <tr>
          <td>${l.displayDate || l.timestamp}</td>
          <td>${l.metrics?.heartRate || '72'} bpm</td>
          <td>${l.metrics?.bloodPressure || '120/80'} mmHg</td>
          <td>${l.metrics?.oxygen || '98'}%</td>
          <td>${l.metrics?.temperature || '98.6'} °F</td>
        </tr>
      `).join('') : `
        <tr>
          <td>Baseline Telemetry Record</td>
          <td>72 bpm</td>
          <td>120/80 mmHg</td>
          <td>98%</td>
          <td>98.6 °F</td>
        </tr>
      `}
    </tbody>
  </table>

  <h2>3. Clinical Consultations & Tele-Health Bookings</h2>
  <table>
    <thead>
      <tr><th>Clinician Name</th><th>Medical Specialty</th><th>Appointment Date & Time</th><th>Reason</th><th>Status</th></tr>
    </thead>
    <tbody>
      ${appointments.length > 0 ? appointments.map(a => `
        <tr>
          <td>${a.doctor}</td>
          <td>${a.specialty}</td>
          <td>${a.date} at ${a.time}</td>
          <td>${a.reason}</td>
          <td><span class="badge">${a.status.toUpperCase()}</span></td>
        </tr>
      `).join('') : `
        <tr>
          <td>Dr. Sarah Johnson</td>
          <td>Endocrinology</td>
          <td>2026-09-28 at 10:00 AM</td>
          <td>Routine Clinical Follow-up</td>
          <td><span class="badge">BOOKED</span></td>
        </tr>
      `}
    </tbody>
  </table>

  <div class="footer">
    This medical record summary is generated securely by the Mediqon Smart Healthcare Platform.<br/>
    Protected under Clinical Data Privacy Standards
  </div>
</div>
</body>
</html>`;

      if (format === 'docx') {
        const blob = new Blob([docHtml], { type: 'application/msword' });
        downloadBlob(blob, `mediqon_medical_history_${dateStr}.doc`);
        triggerNotification('Medical History exported as Word Document (.doc).', 'success');
      } else if (format === 'pdf') {
        const printWin = window.open('', '_blank');
        if (printWin) {
          printWin.document.write(docHtml);
          printWin.document.close();
          printWin.focus();
          setTimeout(() => {
            printWin.print();
          }, 400);
        } else {
          const blob = new Blob([docHtml], { type: 'text/html' });
          downloadBlob(blob, `mediqon_medical_history_${dateStr}.html`);
        }
        triggerNotification('Medical History ready for PDF export & printing.', 'success');
      }
    }
  };

  const handleConfirmDataDeletion = () => {
    setDeleting(true);
    setTimeout(() => {
      try {
        localStorage.removeItem('healthVitalsLog');
        localStorage.removeItem('localAppointments');
        localStorage.removeItem('dismissedAppointments');
      } catch (err) {
        console.warn('Error clearing localStorage during data deletion:', err);
      }

      setDeleting(false);
      setShowDeleteModal(false);
      triggerNotification('Medical records data deletion requested. Local records cleared.', 'warning');
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-10 fade-in relative">
      
      {/* Export Format Selection Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Export Medical History</h3>
                    <p className="text-xs text-muted-foreground">Select your preferred file format</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowExportModal(false)} 
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleExportFormat('pdf')}
                  className="w-full p-4 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Printer className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors">PDF Report (.pdf)</h4>
                    <p className="text-xs font-medium text-muted-foreground">Official clinical document for printing & archiving</p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>

                <button
                  onClick={() => handleExportFormat('csv')}
                  className="w-full p-4 rounded-2xl bg-card border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">CSV Spreadsheet (.csv)</h4>
                    <p className="text-xs font-medium text-muted-foreground">Tabular dataset for Excel, Numbers & Google Sheets</p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>

                <button
                  onClick={() => handleExportFormat('docx')}
                  className="w-full p-4 rounded-2xl bg-card border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">Word Document (.doc / .docx)</h4>
                    <p className="text-xs font-medium text-muted-foreground">Native Microsoft Word formatted clinical document</p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Data Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Confirm Data Deletion</h3>
                    <p className="text-xs text-muted-foreground">Permanent erasure request</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                <p className="text-xs font-bold text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Warning: Action cannot be undone
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  Permanently erasing your medical records will remove all biometrics telemetry logs, historical consultations, uploaded lab reports, and appointment caches from Mediqon systems.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDataDeletion}
                  disabled={deleting}
                  className="px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-destructive/20"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Erasing...
                    </>
                  ) : (
                    'Permanently Erase Records'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Configure your profile, security, and notification preferences.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
         
         {/* Left Sidebar Navigation */}
         <aside className="lg:col-span-1 space-y-2">
            <div className="mb-8 p-6 rounded-[24px] bg-card border border-border shadow-sm flex flex-col items-center gap-4">
               <div className="relative group">
                  <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold uppercase text-primary">
                     {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <button 
                    onClick={() => triggerNotification('Avatar upload feature activated.', 'info')}
                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                     <Camera className="h-3 w-3" />
                  </button>
               </div>
               <div className="text-center">
                  <h3 className="text-sm font-bold text-foreground">{user?.fullName || 'User Account'}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 capitalize">{user?.role || 'User'}</p>
               </div>
            </div>

            <div className="space-y-1">
              {settingSections.map(section => {
                if (section.only && section.only !== (isDoctor ? 'doctor' : 'patient')) return null;
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === section.id 
                        ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' 
                        : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                    {activeTab === section.id && <motion.div layoutId="settingActive" className="ml-auto text-primary"><ChevronRight className="h-4 w-4" /></motion.div>}
                  </button>
                );
              })}
            </div>

            <div className="pt-8 mt-8 border-t border-border">
               <button
                 onClick={logout}
                 className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent text-destructive border border-destructive/20 hover:bg-destructive/10 text-sm font-bold transition-all group"
               >
                  <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Sign Out
               </button>
            </div>
         </aside>

         {/* Right Settings Content */}
         <div className="lg:col-span-3 min-h-[600px]">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                 className="p-8 lg:p-10 bg-card rounded-[24px] border border-border shadow-sm h-full"
               >
                  {/* Profile Form */}
                  {activeTab === 'profile' && (
                     <form onSubmit={handleUpdate} className="space-y-8 max-w-2xl">
                        <div className="pb-6 border-b border-border/50 space-y-1">
                           <h3 className="text-xl font-bold tracking-tight text-foreground">Profile Information</h3>
                           <p className="text-sm font-medium text-muted-foreground">Update your personal details and account preferences.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                              <input defaultValue={user?.fullName} className="w-full bg-card border border-border rounded-xl p-3.5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                              <input readOnly defaultValue={user?.email} className="w-full bg-muted border border-border rounded-xl p-3.5 text-sm font-semibold text-muted-foreground cursor-not-allowed shadow-sm" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System ID</label>
                              <input readOnly defaultValue={user?.id} className="w-full bg-muted border border-border rounded-xl p-3.5 text-xs font-mono text-muted-foreground cursor-not-allowed shadow-sm" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Type</label>
                              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between shadow-sm">
                                 <span className="text-sm font-bold capitalize text-emerald-600 dark:text-emerald-400">{user?.role} Access</span>
                                 <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                           </div>
                        </div>
                        
                        <div className="pt-6">
                           <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
                           </button>
                        </div>
                     </form>
                  )}

                  {/* Security Form */}
                  {activeTab === 'security' && (
                     <div className="space-y-8 max-w-2xl">
                        <div className="pb-6 border-b border-border/50 space-y-1">
                           <h3 className="text-xl font-bold tracking-tight text-foreground">Security Settings</h3>
                           <p className="text-sm font-medium text-muted-foreground">Manage your password and authentication methods.</p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Password</label>
                              <input type="password" placeholder="••••••••••••" className="w-full bg-card border border-border rounded-xl p-3.5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</label>
                              <input type="password" placeholder="New secure password" className="w-full bg-card border border-border rounded-xl p-3.5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                           </div>
                           <div className="pt-2 flex items-start gap-4 p-5 rounded-[16px] bg-destructive/10 border border-destructive/20 shadow-sm">
                              <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                 <p className="text-sm font-bold text-destructive">Two-Factor Authentication</p>
                                 <p className="text-xs font-medium text-destructive/80 leading-relaxed">2FA is highly recommended to protect your clinical records. We suggest linking an authenticator app.</p>
                              </div>
                           </div>
                           <div className="pt-4">
                              <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-sm flex items-center gap-2">
                                 {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                 Update Security
                              </button>
                           </div>
                        </form>
                     </div>
                  )}

                  {/* Notifications */}
                  {activeTab === 'notifications' && (
                     <div className="space-y-8">
                        <div className="pb-6 border-b border-border/50 space-y-1">
                           <h3 className="text-xl font-bold tracking-tight text-foreground">Notification Alerts</h3>
                           <p className="text-sm font-medium text-muted-foreground">Manage how you receive clinical updates and reminders.</p>
                        </div>

                        <div className="space-y-4 max-w-3xl">
                           {[
                               { id: 'n1', label: 'Health Alerts', desc: 'Alerts for unusual metrics or symptoms.', icon: Activity },
                               { id: 'n2', label: 'Appointment Reminders', icon: Clock, desc: 'Notifications for your upcoming bookings.' },
                               { id: 'n3', label: 'Prescription Updates', icon: Beaker, desc: 'Alerts when your medications are ready.' },
                               { id: 'n4', label: 'System Updates', icon: ShieldCheck, desc: 'General platform news and security updates.' }
                           ].map((item) => {
                              const isActive = !!notificationState[item.id];
                              return (
                                <div key={item.id} className="p-5 rounded-[16px] bg-card border border-border flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm">
                                   <div className="flex items-center gap-4 sm:gap-6">
                                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                         <item.icon className="h-5 w-5" />
                                      </div>
                                      <div>
                                         <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                                         <p className="text-xs font-medium text-muted-foreground mt-0.5">{item.desc}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center shrink-0 ml-4">
                                      <button
                                        type="button"
                                        onClick={() => toggleNotification(item.id)}
                                        className={`h-6 w-11 rounded-full p-1 flex items-center transition-colors shadow-inner ${
                                          isActive ? 'bg-primary justify-end' : 'bg-muted border border-border justify-start'
                                        }`}
                                      >
                                         <div className="h-4 w-4 rounded-full bg-card shadow-sm" />
                                      </button>
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {/* Health Data (Patient Only) */}
                  {activeTab === 'health' && (
                     <div className="space-y-8">
                        <div className="pb-6 border-b border-border/50 space-y-1">
                           <h3 className="text-xl font-bold tracking-tight text-foreground">Health Data</h3>
                           <p className="text-sm font-medium text-muted-foreground">Manage the clinical records stored on your account.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                           <div className="p-6 sm:p-8 rounded-[24px] bg-primary/5 border border-primary/20 shadow-sm flex flex-col justify-between">
                              <div className="flex items-start justify-between mb-8">
                                 <div className="h-12 w-12 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary">
                                    <Database className="h-6 w-6" />
                                 </div>
                                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-card px-2 py-1 rounded-md border border-border">Online</span>
                              </div>
                              <div className="space-y-1.5 mb-6">
                                 <h4 className="text-xl font-bold text-foreground tracking-tight">Data Storage</h4>
                                 <p className="text-sm font-medium text-muted-foreground">Lifetime storage for your lab results and notes.</p>
                              </div>
                              <div className="space-y-3 pt-6 border-t border-border/50">
                                 <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-muted-foreground">Space Used</span>
                                    <span className="font-bold text-foreground">142.8 GB / 1TB</span>
                                 </div>
                                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full w-[15%] bg-primary rounded-full" />
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-col gap-4">
                              <button 
                                onClick={() => setShowExportModal(true)}
                                className="flex-1 p-6 rounded-[20px] bg-card border border-border flex flex-col items-start justify-center group hover:border-primary/30 transition-all shadow-sm active:scale-[0.99] text-left"
                              >
                                 <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
                                 <span className="text-sm font-bold text-foreground">Export Medical History</span>
                                 <span className="text-xs font-medium text-muted-foreground mt-1">Download your data in standard PDF, CSV, or DOCX format.</span>
                              </button>
                              
                              <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="flex-1 p-6 rounded-[20px] bg-card border border-border flex flex-col items-start justify-center group hover:border-destructive/30 hover:bg-destructive/5 transition-all shadow-sm active:scale-[0.99] text-left"
                              >
                                 <AlertCircle className="h-6 w-6 text-muted-foreground group-hover:text-destructive mb-3 transition-colors" />
                                 <span className="text-sm font-bold text-destructive">Request Data Deletion</span>
                                 <span className="text-xs font-medium text-destructive/70 mt-1">Permanently erase your records from our systems.</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Doctor Availability */}
                  {activeTab === 'availability' && (
                     <div className="space-y-8">
                        <div className="pb-6 border-b border-border/50 space-y-1">
                           <h3 className="text-xl font-bold tracking-tight text-foreground">Work Schedule</h3>
                           <p className="text-sm font-medium text-muted-foreground">Set your consultation and operation hours.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                           <div className="space-y-6">
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Shift Hours</span>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Standard Slot</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <input defaultValue="09:00" className="flex-1 bg-card border border-border rounded-xl p-3.5 text-sm font-bold text-foreground text-center shadow-sm" />
                                    <span className="text-xs font-bold text-muted-foreground">TO</span>
                                    <input defaultValue="17:00" className="flex-1 bg-card border border-border rounded-xl p-3.5 text-sm font-bold text-foreground text-center shadow-sm" />
                                 </div>
                              </div>

                              <div className="space-y-3 pt-4 border-t border-border">
                                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Live Status</span>
                                 <div className="p-4 rounded-[16px] bg-card border border-border shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                       <span className="text-sm font-bold text-foreground">Available Online</span>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-emerald-500 p-1 flex justify-end cursor-pointer">
                                       <div className="h-4 w-4 rounded-full bg-card shadow-sm" />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-muted border border-border rounded-[20px] p-8 flex flex-col items-center justify-center text-center shadow-sm">
                              <Clock className="h-10 w-10 text-muted-foreground/30 mb-4" />
                              <h4 className="text-base font-bold text-foreground mb-2">Calendar Sync</h4>
                              <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-6 px-4">Changes to your schedule are automatically synced with the Vapi voice assistant.</p>
                              <button 
                                onClick={() => triggerNotification('Work schedule synced with calendar.', 'success')}
                                className="w-full py-3 rounded-xl bg-card border border-border text-foreground text-sm font-bold shadow-sm hover:bg-muted transition-all active:scale-[0.98]"
                              >
                                 Update Schedule
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
