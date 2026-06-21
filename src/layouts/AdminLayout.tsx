import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';
import { ToastContainer } from '../components/Toast/Toast';
import { useApp } from '../context/AppContext';

export const AdminLayout: React.FC = () => {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Panel Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
        `}
      >
        {/* Sticky Header Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Alerts Container */}
      <ToastContainer />
    </div>
  );
};
