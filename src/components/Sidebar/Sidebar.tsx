import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  MessageSquare, 
  Layers, 
  Archive, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    products, 
    orders, 
    reviews 
  } = useApp();

  // Compute notification badges
  const lowStockCount = products.filter(p => p.quantity <= 5).length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;

  const navItems = [
    { 
      path: '/', 
       label: 'Dashboard', 
      icon: <ShoppingBag className="w-5 h-5" />
    },
  
    { 
      path: '/categories', 
      label: 'Categories', 
      icon: <Layers className="w-5 h-5" /> 
    },
    { 
      path: '/orders', 
      label: 'Orders', 
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-indigo-600 text-white'
    },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: <Archive className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      path: '/warranty', 
      label: 'Warranty', 
      icon: <ShieldCheck className="w-5 h-5" /> 
    },
    { 
      path: '/comments', 
      label: 'Comments', 
      icon: <MessageSquare className="w-5 h-5" />,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent tracking-tight shrink-0">
                ApexAdmin
              </span>
            )}
          </div>
          
          {/* Collapse toggle button (desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
              `}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              
              {sidebarOpen ? (
                <span className="flex-1 truncate transition-opacity duration-200">{item.label}</span>
              ) : (
                <span className="absolute left-16 scale-0 group-hover:scale-100 transition-transform origin-left z-50 px-2 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
                  {item.label}
                </span>
              )}

              {/* Badges */}
              {item.badge !== undefined && (
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${item.badgeColor} ${!sidebarOpen && 'absolute top-1 right-2 scale-90'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer/Profile Profile Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Alex Morgan</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Lead Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
