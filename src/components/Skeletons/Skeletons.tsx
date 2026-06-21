import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mx-2"></div>
        ))}
      </div>
      
      {/* Rows Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex px-6 py-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="flex-1 h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-2"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-36"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
      </div>
      
      {/* Simulated Bars or Waves */}
      <div className="flex items-end gap-3 h-48 px-2">
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[40%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[65%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[50%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[80%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[35%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[95%]"></div>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[60%]"></div>
      </div>
      
      {/* Bottom Axis Line */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-full mt-4"></div>
    </div>
  );
};
