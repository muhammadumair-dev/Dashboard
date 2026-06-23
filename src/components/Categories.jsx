import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabaseClient';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();

    const subscription = supabase
      .channel('categories-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.CATEGORIES },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCategories((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setCategories((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    const name = newCategory.trim();
    if (!name) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from(TABLES.CATEGORIES)
        .insert([{ name }]);
      if (error) {
        if (error.code === '23505') {
          throw new Error('Category already exists.');
        }
        throw error;
      }
      setNewCategory('');
      setSuccessMsg('Category added!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to add category.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from(TABLES.CATEGORIES).delete().eq('id', id);
      if (error) throw error;
      setSuccessMsg('Category deleted.');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  const iconColors = [
    'bg-emerald-100 text-emerald-600',
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
    'bg-orange-100 text-orange-600',
    'bg-indigo-100 text-indigo-600',
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
        <p className="text-sm text-gray-500">Organize your products with categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add category form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-fit">
          <h4 className="text-base font-semibold text-gray-800 mb-4">Add New Category</h4>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="e.g., Electronics"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newCategory.trim()}
              className="w-full px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Category list */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-800">
              All Categories ({categories.length})
            </h4>
          </div>

          {error && (
            <div className="m-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="m-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              {successMsg}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No categories yet. Add your first one!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        iconColors[idx % iconColors.length]
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        ID: {cat.id?.slice(0, 8) || '—'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingId === cat.id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
