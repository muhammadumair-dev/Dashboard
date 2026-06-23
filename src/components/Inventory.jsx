import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabaseClient';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out, instock
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchProducts();

    const subscription = supabase
      .channel('inventory-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.PRODUCTS },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .order('stock', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStock(id, newStock) {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from(TABLES.PRODUCTS)
        .update({ stock: parseInt(newStock, 10) || 0 })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      alert('Failed to update stock: ' + err.message);
      fetchProducts();
    } finally {
      setUpdatingId(null);
    }
  }

  const lowStockThreshold = 5;
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;
  const lowStock = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < lowStockThreshold).length;
  const inStock = products.filter((p) => (p.stock ?? 0) >= lowStockThreshold).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

  const filtered = products.filter((p) => {
    const s = p.stock ?? 0;
    if (filter === 'low') return s > 0 && s < lowStockThreshold;
    if (filter === 'out') return s === 0;
    if (filter === 'instock') return s >= lowStockThreshold;
    return true;
  });

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      color: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'In Stock',
      value: inStock,
      color: 'bg-emerald-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      label: 'Low Stock',
      value: lowStock,
      color: 'bg-yellow-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      color: 'bg-red-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Inventory</h3>
        <p className="text-sm text-gray-500">Track and manage stock levels across your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} text-white flex items-center justify-center`}>
                {s.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'instock', label: 'In Stock' },
          { id: 'low', label: 'Low Stock' },
          { id: 'out', label: 'Out of Stock' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">No inventory items match this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => {
                  const stock = product.stock ?? 0;
                  const status =
                    stock === 0
                      ? { text: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
                      : stock < lowStockThreshold
                      ? { text: 'Low Stock', cls: 'bg-yellow-100 text-yellow-700' }
                      : { text: 'In Stock', cls: 'bg-emerald-100 text-emerald-700' };
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.style.display = 'none')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            {product.category && (
                              <p className="text-xs text-gray-500">{product.category}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateStock(product.id, stock - 1)}
                            disabled={updatingId === product.id || stock === 0}
                            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-10 text-center">
                            {stock}
                          </span>
                          <button
                            onClick={() => updateStock(product.id, stock + 1)}
                            disabled={updatingId === product.id}
                            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                        ${((product.price || 0) * stock).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
