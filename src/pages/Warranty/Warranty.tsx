import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { TableSkeleton } from '../../components/Skeletons/Skeletons';
import { Warranty as WarrantyType } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Link2, 
  Check, 
  HelpCircle
} from 'lucide-react';

export const Warranty: React.FC = () => {
  const { 
    warranties, 
    products, 
    isLoading, 
    addWarranty, 
    updateWarranty, 
    deleteWarranty,
    updateProduct,
    addToast 
  } = useApp();

  // Modals Control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<WarrantyType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [warrantyToDelete, setWarrantyToDelete] = useState<WarrantyType | null>(null);
  
  // Assign Modal Control
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeWarrantyForAssign, setActiveWarrantyForAssign] = useState<WarrantyType | null>(null);
  const [assignedProductsLocal, setAssignedProductsLocal] = useState<string[]>([]); // product IDs

  // Form states
  const [formName, setFormName] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formType, setFormType] = useState<WarrantyType['type']>('Manufacturer');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Trigger Add
  const handleOpenAdd = () => {
    setEditingWarranty(null);
    setFormName('');
    setFormDuration('12 Months');
    setFormType('Manufacturer');
    setFormStatus('Active');
    setIsFormOpen(true);
  };

  // Trigger Edit
  const handleOpenEdit = (w: WarrantyType) => {
    setEditingWarranty(w);
    setFormName(w.name);
    setFormDuration(w.duration);
    setFormType(w.type);
    setFormStatus(w.status);
    setIsFormOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formDuration.trim()) {
      addToast('error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      name: formName.trim(),
      duration: formDuration.trim(),
      type: formType,
      status: formStatus
    };

    let success = false;
    if (editingWarranty) {
      success = await updateWarranty(editingWarranty.id, payload);
    } else {
      success = await addWarranty(payload);
    }

    if (success) {
      setIsFormOpen(false);
    }
  };

  // Trigger Delete
  const handleOpenDelete = (w: WarrantyType) => {
    setWarrantyToDelete(w);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (warrantyToDelete) {
      const success = await deleteWarranty(warrantyToDelete.id);
      if (success) {
        setIsDeleteOpen(false);
        setWarrantyToDelete(null);
      }
    }
  };

  // Trigger Assign Products
  const handleOpenAssign = (w: WarrantyType) => {
    setActiveWarrantyForAssign(w);
    // Find all product IDs currently assigned to this warranty
    const currentlyAssigned = products
      .filter(p => p.warrantyId === w.id)
      .map(p => p.id);
    setAssignedProductsLocal(currentlyAssigned);
    setIsAssignOpen(true);
  };

  // Handle product assignment checkbox toggle
  const handleToggleProductAssign = (productId: string) => {
    if (assignedProductsLocal.includes(productId)) {
      setAssignedProductsLocal(assignedProductsLocal.filter(id => id !== productId));
    } else {
      setAssignedProductsLocal([...assignedProductsLocal, productId]);
    }
  };

  // Save product assignments
  const handleSaveAssignments = async () => {
    if (!activeWarrantyForAssign) return;

    let successCount = 0;
    
    // For each product in the store:
    // If it is checked, assign this warrantyId.
    // If it was checked but is now unchecked AND had this warrantyId, set it to ""
    for (const prod of products) {
      const isChecked = assignedProductsLocal.includes(prod.id);
      const isCurrentlyThisWarranty = prod.warrantyId === activeWarrantyForAssign.id;
      
      if (isChecked && !isCurrentlyThisWarranty) {
        // Assign new warranty
        await updateProduct(prod.id, { warrantyId: activeWarrantyForAssign.id });
        successCount++;
      } else if (!isChecked && isCurrentlyThisWarranty) {
        // Remove warranty
        await updateProduct(prod.id, { warrantyId: '' });
        successCount++;
      }
    }

    addToast('success', `Product warranty coverage updated for policy "${activeWarrantyForAssign.name}".`);
    setIsAssignOpen(false);
    setActiveWarrantyForAssign(null);
  };

  // Get list of products covered under a warranty
  const getCoveredProducts = (warrantyId: string) => {
    return products.filter(p => p.warrantyId === warrantyId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Warranty Policies
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure warranty timelines, assign coverage plans, and bind hardware protection policies to catalog products.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Warranty Policy
        </button>
      </div>

      {/* Warranty List Table */}
      {isLoading.warranties ? (
        <TableSkeleton rows={4} cols={5} />
      ) : warranties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No policies found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Configure standard manufacturing, extended merchant, or lifetime replacement policies.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Policy Name</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Covered Catalog Items</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {warranties.map(policy => {
                  const covered = getCoveredProducts(policy.id);
                  
                  return (
                    <tr 
                      key={policy.id} 
                      className="hover:bg-slate-50/85 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Shield className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {policy.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {policy.duration}
                      </td>

                      {/* Type Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          policy.type === 'Lifetime'
                            ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40'
                            : policy.type === 'Extended'
                            ? 'bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/40'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800'
                        }`}>
                          {policy.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          policy.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                        }`}>
                          ● {policy.status}
                        </span>
                      </td>

                      {/* Covered Products Count & Quick assign link */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {covered.length} Products
                          </span>
                          <button
                            onClick={() => handleOpenAssign(policy)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/25 transition-all"
                            title="Assign to Products"
                          >
                            <Link2 className="w-3 h-3" />
                            Assign / Link
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(policy)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit policy"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(policy)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-750 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete policy"
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

      {/* Add / Edit Warranty Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingWarranty ? `Edit Policy: ${editingWarranty.name}` : 'Create Warranty Policy'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Policy Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Policy Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. 2-Year Platinum Protection Plan"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Warranty Duration *
            </label>
            <input
              type="text"
              required
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              placeholder="e.g. 24 Months, 3 Years, Lifetime"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Coverage Type
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Manufacturer">Manufacturer (Standard)</option>
              <option value="Extended">Extended (Merchant Addon)</option>
              <option value="Lifetime">Lifetime (Hardware Replacement)</option>
            </select>
          </div>

          {/* Status radio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Policy Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="warStatus"
                  value="Active"
                  checked={formStatus === 'Active'}
                  onChange={() => setFormStatus('Active')}
                  className="accent-indigo-600 w-4 h-4"
                />
                Active (Assignable)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="warStatus"
                  value="Inactive"
                  checked={formStatus === 'Inactive'}
                  onChange={() => setFormStatus('Inactive')}
                  className="accent-indigo-600 w-4 h-4"
                />
                Inactive (Deactivated)
              </label>
            </div>
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
              Save Policy
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Products Modal */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title={`Assign Policy: "${activeWarrantyForAssign?.name}"`}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Toggle the checkboxes below to quickly bind or remove products from this policy. Checked items will be covered; unchecked items will have this policy removed.
          </p>

          {products.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">No products exist in your catalog to assign.</p>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(product => {
                const isChecked = assignedProductsLocal.includes(product.id);
                
                return (
                  <label 
                    key={product.id} 
                    className="flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleProductAssign(product.id)}
                      className="w-4.5 h-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block truncate">
                        {product.name}
                      </span>
                      <span className="text-xs text-slate-400 block font-mono">
                        {product.sku} | Category: {product.category}
                      </span>
                    </div>
                    {product.warrantyId && product.warrantyId !== activeWarrantyForAssign?.id && (
                      <span className="text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-750 px-2 py-0.5 rounded">
                        Has other policy
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAssignOpen(false)}
              className="px-4.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAssignments}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
            >
              <Check className="w-4 h-4" />
              Save Assignments
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Warranty Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Warranty Policy"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete <span className="font-bold text-slate-800 dark:text-white">"{warrantyToDelete?.name}"</span>? 
            This policy will be deleted from the database.
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
