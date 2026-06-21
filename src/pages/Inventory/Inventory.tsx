import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { TableSkeleton } from '../../components/Skeletons/Skeletons';
import { Product } from '../../types';
import { 
  Archive, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Plus, 
  Minus, 
  FileText, 
  Clock, 
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const Inventory: React.FC = () => {
  const { 
    products, 
    inventoryLogs, 
    isLoading, 
    adjustStock,
    addToast 
  } = useApp();

  // Tab State: 'ledger' | 'history' | 'reports'
  const [activeTab, setActiveTab] = useState<'ledger' | 'history' | 'reports'>('ledger');

  // Modal Controls
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('5');
  const [adjustType, setAdjustType] = useState<'Increase' | 'Decrease'>('Increase');
  const [adjustReason, setAdjustReason] = useState('Standard restock');

  // Export report state
  const [exportingType, setExportingType] = useState<'CSV' | 'PDF' | null>(null);

  // Compute stats
  const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  
  const assetValuation = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  
  const lowStockCount = products.filter(p => p.quantity <= 5 && p.quantity > 0).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  // Open adjustment modal
  const handleOpenAdjust = (product: Product, type: 'Increase' | 'Decrease') => {
    setSelectedProduct(product);
    setAdjustType(type);
    setAdjustAmount('5');
    setAdjustReason(type === 'Increase' ? 'Restocked from supplier' : 'Damaged/Expired stock removal');
    setIsAdjustOpen(true);
  };

  // Submit Adjustment
  const handleSubmitAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const amountNum = parseInt(adjustAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      addToast('error', 'Adjustment quantity must be a positive number.');
      return;
    }

    if (!adjustReason.trim()) {
      addToast('error', 'Please write a brief reason for this inventory change.');
      return;
    }

    const netAdjustment = adjustType === 'Increase' ? amountNum : -amountNum;
    
    // Safety check for decrease
    if (adjustType === 'Decrease' && selectedProduct.quantity < amountNum) {
      addToast('error', `Cannot decrease by ${amountNum}. Current stock is only ${selectedProduct.quantity}.`);
      return;
    }

    const success = await adjustStock(selectedProduct.id, netAdjustment, adjustReason.trim());
    if (success) {
      setIsAdjustOpen(false);
      setSelectedProduct(null);
    }
  };

  // Export Report Simulation
  const handleExport = (type: 'CSV' | 'PDF') => {
    setExportingType(type);
    setTimeout(() => {
      setExportingType(null);
      addToast('success', `Inventory ${type} Report successfully downloaded to your device.`);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Inventory Control
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor real-time warehouse counts, trace audit trails, handle replenishments, and generate valuations.
        </p>
      </div>

      {/* Inventory KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Total Stock */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">WAREHOUSE STOCK</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{totalStockUnits} Units</span>
          </div>
        </div>

        {/* Valuation */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">ASSET VALUATION</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{formatCurrency(assetValuation)}</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">LOW STOCK ALERTS</span>
            <span className={`text-xl font-extrabold mt-0.5 ${lowStockCount > 0 ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
              {lowStockCount} Products
            </span>
          </div>
        </div>

        {/* Out of stock */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">OUT OF STOCK</span>
            <span className={`text-xl font-extrabold mt-0.5 ${outOfStockCount > 0 ? 'text-rose-550 text-rose-500' : 'text-slate-800 dark:text-white'}`}>
              {outOfStockCount} Products
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ledger'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Archive className="w-4 h-4" />
          Stock Ledger
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Audit Trail Log
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Reports & Export
        </button>
      </div>

      {/* Tab Contents */}
      {isLoading.products || isLoading.inventoryLogs ? (
        <TableSkeleton rows={5} cols={5} />
      ) : activeTab === 'ledger' ? (
        /* TAB 1: STOCK LEDGER */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Product Catalog Item</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Warehouse Level</th>
                  <th className="px-6 py-4">Status & Health</th>
                  <th className="px-6 py-4 text-right">Inventory Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {products.map(product => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-slate-50/85 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[220px]">
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-650 text-slate-500 dark:text-slate-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-base ${
                        product.quantity === 0 
                          ? 'text-rose-500' 
                          : product.quantity <= 5 
                          ? 'text-amber-500' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantity === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
                          OUT OF STOCK
                        </span>
                      ) : product.quantity <= 5 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-250 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 animate-pulse">
                          CRITICAL LOW STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                          ADEQUATE STOCK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAdjust(product, 'Increase')}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          title="Restock (Add Quantity)"
                        >
                          <Plus className="w-4.5 h-4.5 text-emerald-500" />
                        </button>
                        <button
                          onClick={() => handleOpenAdjust(product, 'Decrease')}
                          disabled={product.quantity === 0}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Deduct Stock (Sub Quantity)"
                        >
                          <Minus className="w-4.5 h-4.5 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'history' ? (
        /* TAB 2: AUDIT TRAIL LOGS */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Adjustment Action</th>
                  <th className="px-6 py-4">Quantity Change</th>
                  <th className="px-6 py-4">New Stock Level</th>
                  <th className="px-6 py-4">Trigger / Audit Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {inventoryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No stock movement audit records found.
                    </td>
                  </tr>
                ) : (
                  inventoryLogs.map(log => (
                    <tr 
                      key={log.id} 
                      className="hover:bg-slate-50/85 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {new Date(log.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {log.productName}
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {log.sku}
                      </td>

                      {/* Adjustment Action type badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'Restock' || log.type === 'Increase'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                        }`}>
                          {(log.type === 'Restock' || log.type === 'Increase') ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {log.type.toUpperCase()}
                        </span>
                      </td>

                      {/* Quantity change */}
                      <td className="px-6 py-4 font-bold">
                        <span className={log.quantityChanged > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}>
                          {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                        </span>
                      </td>

                      {/* New Stock level */}
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                        {log.newQuantity}
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-semibold italic max-w-xs truncate" title={log.reason}>
                        {log.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 3: REPORTS & VALUATION */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inventory summary reports card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Stock Turnover & Asset Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export aggregate warehouse records including product names, current quantities, active manufacturer warranties, pricing tables, and net asset valuations. Download compiled files for accounting audits.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-400 block font-semibold">Total Catalog Cost value:</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">{formatCurrency(assetValuation)}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-400 block font-semibold">Average Product Price:</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">
                  {formatCurrency(products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0)}
                </span>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleExport('CSV')}
                disabled={exportingType !== null}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-55 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500" />
                {exportingType === 'CSV' ? 'Exporting Spreadsheet...' : 'Export Excel / CSV'}
                <Download className="w-3.5 h-3.5 ml-1" />
              </button>
              <button
                onClick={() => handleExport('PDF')}
                disabled={exportingType !== null}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                <FileText className="w-4.5 h-4.5" />
                {exportingType === 'PDF' ? 'Generating Document...' : 'Download PDF Report'}
                <Download className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          {/* Low Stock Warning List Panel */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Active Replenishment Warnings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The following products are currently out of stock or below the critical replenishment threshold (5 units). Immediate restocking is recommended.
            </p>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {products.filter(p => p.quantity <= 5).length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold italic py-2">
                  ✓ All products have adequate warehouse stocks!
                </p>
              ) : (
                products
                  .filter(p => p.quantity <= 5)
                  .map(product => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/35 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.quantity === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{product.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-slate-400">Qty:</span>
                        <span className={product.quantity === 0 ? 'text-rose-500 font-extrabold' : 'text-amber-500 font-extrabold'}>
                          {product.quantity}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjust Modal */}
      <Modal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        title={`Adjust Stock: ${selectedProduct?.name}`}
        size="md"
      >
        <form onSubmit={handleSubmitAdjust} className="space-y-4">
          {selectedProduct && (
            <>
              {/* Product SKU Info */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl border border-slate-105 bg-slate-55 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">SKU CODE</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedProduct.sku}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">CURRENT STOCK LEVEL</span>
                  <span className="font-extrabold text-base text-slate-800 dark:text-white">{selectedProduct.quantity} units</span>
                </div>
              </div>

              {/* Adjustment Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Adjustment Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="adjustType"
                      value="Increase"
                      checked={adjustType === 'Increase'}
                      onChange={() => setAdjustType('Increase')}
                      className="accent-indigo-600 w-4 h-4"
                    />
                    Add Inventory (+)
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="adjustType"
                      value="Decrease"
                      checked={adjustType === 'Decrease'}
                      onChange={() => setAdjustType('Decrease')}
                      className="accent-indigo-600 w-4 h-4"
                    />
                    Deduct Inventory (-)
                  </label>
                </div>
              </div>

              {/* Adjustment Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Quantity to Adjust *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="5"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* Adjustment Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Adjustment Log Reason *
                </label>
                <textarea
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received supplier shipment replenishment #PO-984..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                    adjustType === 'Increase'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10'
                  }`}
                >
                  Save Stock Level
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
