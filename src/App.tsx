import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Products } from './pages/Products/Products';
import { Categories } from './pages/Categories/Categories';
import { Orders } from './pages/Orders/Orders';
import { Inventory } from './pages/Inventory/Inventory';
import { Warranty } from './pages/Warranty/Warranty';
import { Comments } from './pages/Comments/Comments';
import { AlertTriangle } from 'lucide-react';

// Simple Fallback Page for 404 routes
const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-900/30">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
        The administration panel route you are trying to access does not exist or has been relocated.
      </p>
      <a 
        href="#/" 
        className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-550/15"
      >
        Return to Dashboard
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            {/* Navigational Subroutes */}
            <Route index element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="comments" element={<Comments />} />
            
            {/* 404 Fallback */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
