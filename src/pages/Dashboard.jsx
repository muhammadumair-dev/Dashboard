import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabaseClient';

function StatCard({ label, value, change, color, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-lg ${color} text-white flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              change.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    comments: 0,
    categories: 0,
    lowStock: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [
        { count: productCount },
        { count: orderCount },
        { count: commentCount },
        { count: categoryCount },
        { data: lowStock },
        { data: orders },
      ] = await Promise.all([
        supabase.from(TABLES.PRODUCTS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.ORDERS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.COMMENTS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.CATEGORIES).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.PRODUCTS).select('*').lt('stock', 5).gt('stock', 0).limit(5),
        supabase.from(TABLES.ORDERS).select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const revenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        products: productCount || 0,
        orders: orderCount || 0,
        comments: commentCount || 0,
        categories: categoryCount || 0,
        lowStock: lowStock?.length || 0,
        revenue,
      });
      setRecentOrders(orders || []);
      setLowStockItems(lowStock || []);
    } catch (err) {
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      color: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      color: 'bg-emerald-500',
      change: { positive: true, value: '12%' },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Comments',
      value: stats.comments,
      color: 'bg-purple-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: 'Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      color: 'bg-orange-500',
      change: { positive: true, value: '8%' },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
        <p className="text-sm text-gray-500">Your store at a glance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-800">Recent Orders</h4>
                <span className="text-xs text-gray-500">{recentOrders.length} items</span>
              </div>
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No recent orders to display.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <li key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name || 'Customer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.product_name} · Qty {order.quantity || 1}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Low stock */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-800">Low Stock Alerts</h4>
                <span className="text-xs text-red-600 font-medium">{lowStockItems.length} items</span>
              </div>
              {lowStockItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  🎉 All products are well-stocked.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {lowStockItems.map((p) => (
                    <li key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        {p.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
