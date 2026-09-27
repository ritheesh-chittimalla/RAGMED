import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, showToast: addToast }}>
      {children}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-xl border shadow-lg flex items-center gap-4 bg-white ${
                toast.type === 'success' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' :
                toast.type === 'error' ? 'border-rose-100 text-rose-600 bg-rose-50' :
                toast.type === 'warning' ? 'border-amber-100 text-amber-600 bg-amber-50' :
                'border-blue-100 text-blue-600 bg-blue-50'
              }`}
            >
              <div className="flex-shrink-0">
                {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                {toast.type === 'warning' && <AlertCircle className="h-5 w-5" />}
                {toast.type === 'info' && <Bell className="h-5 w-5" />}
              </div>
              <div className="flex-1 text-sm font-semibold tracking-tight text-neutral-900">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
