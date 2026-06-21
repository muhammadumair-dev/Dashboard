import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { TableSkeleton } from '../../components/Skeletons/Skeletons';
import { Product } from '../../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Filter, 
  X, 
  DollarSign, 
  Layers, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Speaker', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Keyboard', url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80' },
];

export const Products: React.FC = () => {
  const { 
    products, 
    categories, 
    warranties, 
    isLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addToast
  } = useApp();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formWarrantyId, setFormWarrantyId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Draft' | 'Out of Stock'>('Active');
  
  // Variants tag input
  const [variantInput, setVariantInput] = useState('');
  const [formVariants, setFormVariants] = useState<string[]>([]);

  // Trigger Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormImage(PRESET_IMAGES[0].url);
    setFormCategory(categories[0]?.name || 'Computing');
    setFormPrice('');
    setFormSalePrice('');
    setFormQuantity('');
    setFormSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormWarrantyId(warranties[0]?.id || '');
    setFormDescription('');
    setFormStatus('Active');
    setFormVariants([]);
    setVariantInput('');
    setIsFormOpen(true);
  };

  // Trigger Edit Product Modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormImage(product.image);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormSalePrice(product.salePrice.toString());
    setFormQuantity(product.quantity.toString());
    setFormSku(product.sku);
    setFormWarrantyId(product.warrantyId);
    setFormDescription(product.description);
    setFormStatus(product.status);
    setFormVariants([...product.variants]);
    setVariantInput('');
    setIsFormOpen(true);
  };

  // Handle Form Submission
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formSku.trim() || !formPrice || !formQuantity) {
      addToast('error', 'Please fill in all required fields.');
      return;
    }

    const parsedPrice = parseFloat(formPrice);
    const parsedSalePrice = formSalePrice ? parseFloat(formSalePrice) : parsedPrice;
    const parsedQty = parseInt(formQuantity);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      addToast('error', 'Price must be a valid positive number.');
      return;
    }
    if (parsedSalePrice > parsedPrice) {
      addToast('error', 'Sale price cannot be higher than regular price.');
      return;
    }
    if (isNaN(parsedQty) || parsedQty < 0) {
      addToast('error', 'Stock quantity cannot be negative.');
      return;
    }

    const payload = {
      name: formName,
      sku: formSku,
      price: parsedPrice,
      salePrice: parsedSalePrice,
      quantity: parsedQty,
      description: formDescription,
      category: formCategory,
      status: parsedQty === 0 ? 'Out of Stock' : formStatus,
      image: formImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      warrantyId: formWarrantyId,
      variants: formVariants
    };

    let success = false;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, payload);
    } else {
      success = await addProduct(payload);
    }

    if (success) {
      setIsFormOpen(false);
    }
  };

  // Handle Delete Confirmation
  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete.id);
      if (success) {
        setIsDeleteOpen(false);
        setProductToDelete(null);
      }
    }
  };

  // Variants handlers
  const handleAddVariant = () => {
    if (variantInput.trim() && !formVariants.includes(variantInput.trim())) {
      setFormVariants([...formVariants, variantInput.trim()]);
      setVariantInput('');
    }
  };

  const handleRemoveVariant = (variant: string) => {
    setFormVariants(formVariants.filter(v => v !== variant));
  };

  const handleVariantKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariant();
    }
  };

  // Filtered listing
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus !== 'All') {
      matchesStatus = product.status === selectedStatus;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Products Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your store offerings, track variant inventory, SKUs, and warranty assignments.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          Add New Product
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, SKU or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all dark:text-white"
          />
        </div>

        {/* Categories Dropdown Filter */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50 dark:bg-slate-950 h-11 w-full sm:w-auto">
            <Layers className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none dark:text-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50 dark:bg-slate-950 h-11 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none dark:text-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Listing */}
      {isLoading.products ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No products found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try adjusting your search keywords, clearing your filters, or adding a brand new product to the catalog.
          </p>
        </div>
      ) : (
        /* Product Table */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Warranty</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredProducts.map(product => {
                  // Find warranty name
                  const w = warranties.find(war => war.id === product.warrantyId);
                  
                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-slate-50/85 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Product Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-150 dark:border-slate-800 shrink-0 bg-slate-50"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[200px]" title={product.name}>
                              {product.name}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-1">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {product.sku}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div>
                          {product.salePrice < product.price ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                                {formatCurrency(product.salePrice)}
                              </span>
                              <span className="text-xs text-slate-400 line-through block">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`font-bold ${
                            product.quantity === 0 
                              ? 'text-rose-500' 
                              : product.quantity <= 5 
                              ? 'text-amber-500' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {product.quantity}
                          </span>
                          {product.quantity <= 5 && product.quantity > 0 && (
                            <span className="block text-[10px] font-bold text-amber-500 animate-pulse">
                              Low Stock Alert
                            </span>
                          )}
                          {product.quantity === 0 && (
                            <span className="block text-[10px] font-bold text-rose-500">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          product.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                            : product.status === 'Out of Stock'
                            ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40'
                            : 'bg-slate-55 bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>

                      {/* Assigned Warranty */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {w ? w.name : <span className="text-slate-400 italic">None</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmitProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column Fields */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. FitPulse Smartwatch v5"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  placeholder="e.g. FP-SMWV5-09"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Regular Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="199.99"
                      className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Sale Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formSalePrice}
                      onChange={(e) => setFormSalePrice(e.target.value)}
                      placeholder="179.99"
                      className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                  placeholder="25"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="space-y-4">
              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  Product Image URL
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Or select a high-res tech preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map(img => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormImage(img.url)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                          formImage === img.url 
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-250 dark:border-slate-750 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assigned Warranty Policy */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  Assign Warranty Policy
                </label>
                <select
                  value={formWarrantyId}
                  onChange={(e) => setFormWarrantyId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="">No warranty assigned</option>
                  {warranties.map(war => (
                    <option key={war.id} value={war.id}>{war.name} ({war.duration})</option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Catalog Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Product Variants tag component */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Product Variants (e.g. Colors, Storage)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={variantInput}
                    onChange={(e) => setVariantInput(e.target.value)}
                    onKeyDown={handleVariantKeyDown}
                    placeholder="Type variant (e.g. Space Gray) and press Enter"
                    className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Variant Chips */}
                {formVariants.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    {formVariants.map(variant => (
                      <span
                        key={variant}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20"
                      >
                        {variant}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant)}
                          className="hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Product Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide a compelling product description detailing hardware specifications, usability, etc..."
              rows={3}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Form Action Buttons */}
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
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete <span className="font-bold text-slate-800 dark:text-white">"{productToDelete?.name}"</span>? 
            This action cannot be undone.
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
