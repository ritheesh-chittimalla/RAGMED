import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowLeft, Bot, Loader2, Calendar, FileText, X, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';

export default function PredictionHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPredictionHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load prediction history. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
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
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/predictions')}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Prediction Hub
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <History className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Prediction History
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Saved Machine Learning Risk Assessment Audit Log
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Loading History Records...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium text-center">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4 bg-card/40">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Assessment Records Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven't executed any disease risk predictions yet. Select a disease module from the hub to get started.
          </p>
          <button
            onClick={() => navigate('/predictions')}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            Go to Predictions Hub
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Disease Assessment</th>
                  <th className="px-6 py-4">Predicted Risk Score</th>
                  <th className="px-6 py-4">Risk Category</th>
                  <th className="px-6 py-4">Assessment Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{record.disease}</td>
                    <td className="px-6 py-4 font-extrabold text-foreground">
                      {(record.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getRiskBadgeColor(record.riskLevel)}`}>
                        {record.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground flex items-center gap-1.5 pt-5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(record)}
                        className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Assessment Record</span>
                <h2 className="text-2xl font-extrabold text-foreground">{selectedRecord.disease}</h2>
                <p className="text-xs text-muted-foreground">
                  Recorded on {new Date(selectedRecord.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Probability</span>
                  <span className="text-2xl font-extrabold text-foreground">{(selectedRecord.probability * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Category</span>
                  <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-extrabold border ${getRiskBadgeColor(selectedRecord.riskLevel)}`}>
                    {selectedRecord.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Input Data Parameters */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Input Parameters</span>
                <div className="p-4 rounded-2xl bg-muted/30 border border-border font-mono text-xs text-foreground overflow-x-auto max-h-40">
                  <pre>{JSON.stringify(selectedRecord.inputData, null, 2)}</pre>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
