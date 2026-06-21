import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/Cards/StatCard';
import { TableSkeleton, ChartSkeleton } from '../../components/Skeletons/Skeletons';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  ShoppingCart, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  User,
  Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { products, orders, categories, isLoading, theme } = useApp();

  // 1. Calculations
  const totalProducts = products.length;
  const totalOrders = orders.length;
  
  // Only count Paid orders in revenue
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalCategories = categories.length;
  const lowStockProducts = products.filter(p => p.quantity <= 5).length;

  // 2. Mock Chart Data (Dynamic-looking weekly sales)
  const salesData = [
    { name: 'Mon', Sales: 4, Revenue: 240 },
    { name: 'Tue', Sales: 3, Revenue: 180 },
    { name: 'Wed', Sales: 7, Revenue: 480 },
    { name: 'Thu', Sales: 5, Revenue: 350 },
    { name: 'Fri', Sales: 8, Revenue: 620 },
    { name: 'Sat', Sales: 12, Revenue: 1100 },
    { name: 'Sun', Sales: 15, Revenue: 1450 },
  ];

  const revenueData = [
    { name: 'Jan', Target: 8000, Actual: 7200 },
    { name: 'Feb', Target: 9000, Actual: 8400 },
    { name: 'Mar', Target: 10000, Actual: 11950 },
    { name: 'Apr', Target: 11000, Actual: 10500 },
    { name: 'May', Target: 12000, Actual: 13000 },
    { name: 'Jun', Target: 14000, Actual: 15200 },
  ];

  // 3. Status Badges
  const getStatusBadge = (status: string) => {
    const map: { [key: string]: string } = {
      Pending: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
      Processing: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
      Shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50',
      Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
      Cancelled: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${map[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const map: { [key: string]: string } = {
      Paid: 'text-emerald-600 dark:text-emerald-400',
      Unpaid: 'text-amber-500',
      Refunded: 'text-rose-500',
    };
    return (
      <span className={`text-xs font-bold ${map[status] || 'text-slate-500'}`}>
        ● {status}
      </span>
    );
  };

  // 4. Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get recent 4 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics, business metrics, and critical system health alerts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Last sync: Just now</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-5 h-5" />}
          change={12.4}
          changeLabel="from last month"
          isLoading={isLoading.global}
          color="indigo"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          change={8.2}
          changeLabel="from last month"
          isLoading={isLoading.global}
          color="emerald"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<ShoppingBag className="w-5 h-5" />}
          change={3.1}
          changeLabel="new catalog items"
          isLoading={isLoading.global}
          color="sky"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<Layers className="w-5 h-5" />}
          isLoading={isLoading.global}
          color="amber"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts}
          icon={<AlertTriangle className="w-5 h-5" />}
          isLoading={isLoading.global}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Analytics Area Chart */}
        {isLoading.global ? (
          <ChartSkeleton />
        ) : (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Sales & Order Volumetrics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Frequency of successful website orders</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                +24.8% Weekly
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                    }} 
                  />
                  <Area type="monotone" dataKey="Sales" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Revenue Targets Bar Chart */}
        {isLoading.global ? (
          <ChartSkeleton />
        ) : (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Revenue targets vs Actuals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comparison of revenue goals with invoicing</p>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">USD ($) in thousands</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Target" fill="#94a3b8" opacity={0.3} radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Purchases</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest customer transactions streaming from website</p>
          </div>
          <Link 
            to="/orders" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
          >
            View All Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading.global ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Order Status</th>
                    <th className="px-6 py-4">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block">{order.customerName}</span>
                              <span className="text-xs text-slate-400">{order.customerEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.orderStatus)}
                        </td>
                        <td className="px-6 py-4">
                          {getPaymentBadge(order.paymentStatus)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
