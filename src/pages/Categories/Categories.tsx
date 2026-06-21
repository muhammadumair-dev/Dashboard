import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { Category } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  Image as ImageIcon, 
  ShoppingBag,
  HelpCircle
} from 'lucide-react';

const CAT_PRESETS = [
  { name: 'Computing', url: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Wearables', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Accessories', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Smart Home', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mobile Devices', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' }
];

export const Categories: React.FC = () => {
  const { 
    categories, 
    products, 
    isLoading, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    addToast 
  } = useApp();

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Trigger Add Modal
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormImage(CAT_PRESETS[0].url);
    setFormStatus('Active');
    setIsFormOpen(true);
  };

  // Trigger Edit Modal
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setFormImage(category.image);
    setFormStatus(category.status);
    setIsFormOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      addToast('error', 'Category name is required.');
      return;
    }

    const payload = {
      name: formName.trim(),
      description: formDescription.trim(),
      image: formImage || CAT_PRESETS[0].url,
      status: formStatus
    };

    let success = false;
    if (editingCategory) {
      success = await updateCategory(editingCategory.id, payload);
    } else {
      success = await addCategory(payload);
    }

    if (success) {
      setIsFormOpen(false);
    }
  };

  // Trigger Delete Confirmation
  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete.id);
      if (success) {
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  // Calculate products count per category name
  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Categories Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Group your products by taxonomy, assign status tags, and manage display categories.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          Add New Category
        </button>
      </div>

      {/* Grid of Categories */}
      {isLoading.categories ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border border-slate-250 dark:border-slate-750 border-slate-200 dark:border-slate-850 animate-pulse bg-white dark:bg-slate-900"></div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No categories found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Start organizing your product catalog by adding a brand new product category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const productCount = getProductCount(category.name);
            
            return (
              <div 
                key={category.id} 
                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                {/* Category Cover Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${
                      category.status === 'Active'
                        ? 'bg-emerald-500/90 border-emerald-400 text-white'
                        : 'bg-rose-500/90 border-rose-400 text-white'
                    }`}>
                      {category.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-base font-bold text-white drop-shadow-sm flex items-center gap-1.5">
                      <Layers className="w-4.5 h-4.5" />
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {category.description || 'No description provided for this category.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <ShoppingBag className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{productCount}</span> products
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(category)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(category)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-750 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Virtual Reality"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide a brief description of what kinds of goods fall under this category..."
              rows={3}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              Category Image URL
            </label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
            
            {/* Preset Picker */}
            <div className="mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Or select a visual preset:</span>
              <div className="flex flex-wrap gap-1.5">
                {CAT_PRESETS.map(img => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setFormImage(img.url)}
                    className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                      formImage === img.url 
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="catStatus"
                  value="Active"
                  checked={formStatus === 'Active'}
                  onChange={() => setFormStatus('Active')}
                  className="accent-indigo-600 w-4 h-4"
                />
                Active (Will display on store)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="catStatus"
                  value="Inactive"
                  checked={formStatus === 'Inactive'}
                  onChange={() => setFormStatus('Inactive')}
                  className="accent-indigo-600 w-4 h-4"
                />
                Inactive (Hidden/Draft)
              </label>
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete <span className="font-bold text-slate-800 dark:text-white">"{categoryToDelete?.name}"</span>? 
            This action cannot be undone and will remove it from the taxonomy list.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              No, Keep
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
