import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/20 bg-white/90 dark:bg-slate-900/90 shadow-emerald-500/5 dark:shadow-emerald-500/2',
    error: 'border-rose-500/20 bg-white/90 dark:bg-slate-900/90 shadow-rose-500/5 dark:shadow-rose-500/2',
    warning: 'border-amber-500/20 bg-white/90 dark:bg-slate-900/90 shadow-amber-500/5 dark:shadow-amber-500/2',
    info: 'border-sky-500/20 bg-white/90 dark:bg-slate-900/90 shadow-sky-500/5 dark:shadow-sky-500/2',
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-x-0 animate-slide-in ${borderMap[toast.type]}`}
          role="alert"
        >
          {iconMap[toast.type]}
          <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
