import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  RefreshCw, 
  Cpu,
  Wifi
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    theme, 
    toggleTheme, 
    refreshAllData,
    systemStatus,
    isLoading
  } = useApp();
  
  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Mobile & Desktop Sidebar toggle if hidden) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Quick Search */}
        <div className="relative hidden md:flex items-center w-64 lg:w-80">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* System Health / Axios Metrics Widget */}
        {systemStatus && (
          <div className="relative">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">API:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{systemStatus.apiGateway}</span>
            </button>

            {showMetrics && (
              <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 animate-fade-in text-xs text-slate-600 dark:text-slate-400 space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  Axios Diagnostics
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400">Gateway Status:</div>
                  <div className="text-right font-semibold text-emerald-500">{systemStatus.apiGateway}</div>
                  
                  <div className="text-slate-400">Latency / Ping:</div>
                  <div className="text-right font-semibold text-slate-800 dark:text-slate-200">{systemStatus.ping}</div>
                  
                  <div className="text-slate-400">Database Engine:</div>
                  <div className="text-right font-semibold text-indigo-500 truncate" title={systemStatus.databaseType}>
                    {systemStatus.databaseType.split(' ')[0]}
                  </div>

                  <div className="text-slate-400">Axios Live Fetch:</div>
                  <div className="text-right font-semibold text-slate-800 dark:text-slate-200 truncate" title={systemStatus.demoTodoFetched}>
                    {systemStatus.demoTodoFetched.slice(0, 15)}...
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 italic text-center border-t border-slate-100 dark:border-slate-800 pt-2">
                  Live response fetched via Axios from public API
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sync/Refresh Button */}
        <button
          onClick={refreshAllData}
          disabled={isLoading.global}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Sync Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading.global ? 'animate-spin text-indigo-500' : ''}`} />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Profile Avatar Trigger */}
        <div className="h-9 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
            alt="User avatar"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
        </div>
      </div>
    </header>
  );
};
