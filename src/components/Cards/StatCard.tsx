import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number; // e.g. +12.5 or -3.2
  changeLabel?: string; // e.g. "from last month"
  isLoading?: boolean;
  color?: string; // e.g. "indigo", "rose", "emerald", "amber"
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel = 'vs last month',
  isLoading = false,
  color = 'indigo'
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
      </div>
    );
  }

  // Define background/text colors for the icon container based on color prop
  const colorStyles: { [key: string]: string } = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50',
    sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50',
  };

  const isPositive = change && change >= 0;

  return (
    <div className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-transform group-hover:scale-110 duration-300 ${colorStyles[color] || colorStyles.indigo}`}>
          {icon}
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {value}
        </h3>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
            isPositive 
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' 
              : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-slate-400 dark:text-slate-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};
