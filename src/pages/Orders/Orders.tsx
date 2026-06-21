import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { TableSkeleton } from '../../components/Skeletons/Skeletons';
import { Order } from '../../types';
import { 
  Search, 
  Eye, 
  Trash2, 
  ShoppingCart, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Printer, 
  User,
  Filter,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const Orders: React.FC = () => {
  const { 
    orders, 
    isLoading, 
    updateOrderStatus, 
    deleteOrder,
    addToast
  } = useApp();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Modals Control
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const getPaymentBadge = (status: string) => {
    const map: { [key: string]: string } = {
      Paid: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      Unpaid: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      Refunded: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${map[status] || 'bg-slate-100 text-slate-600'}`}>
        {status}
      </span>
    );
  };

  // View Details Trigger
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // Delete Trigger
  const handleOpenDelete = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      const success = await deleteOrder(orderToDelete.id);
      if (success) {
        setIsDeleteOpen(false);
        setOrderToDelete(null);
      }
    }
  };

  // Quick Status Update
  const handleStatusChange = async (orderId: string, newStatus: Order['orderStatus']) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success && selectedOrder && selectedOrder.id === orderId) {
      // Keep modal state updated
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) setSelectedOrder({ ...updatedOrder, orderStatus: newStatus });
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const simulatePrintInvoice = () => {
    addToast('info', `Invoice generated and printed for order ${selectedOrder?.orderNumber}.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Orders Ledger
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor incoming online store orders, track payment statuses, and route shipment logistics.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all dark:text-white"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          {/* Order Status Filter */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50 dark:bg-slate-950 h-11 w-full sm:w-auto">
            <ShoppingCart className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none dark:text-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50 dark:bg-slate-950 h-11 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none dark:text-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading.orders ? (
        <TableSkeleton rows={6} cols={7} />
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No orders found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try adjusting your search keywords or relaxing the status filters.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/85 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-slate-55 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-slate-400 block truncate max-w-[150px]">
                            {order.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Order Status (Dropdown in Row) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none dark:text-slate-200 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(order)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-750 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Order Specification: ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header Status & Metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">TRANSACTION TIMESTAMP</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-250 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {new Date(selectedOrder.orderDate).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="space-y-1 text-right">
                  <span className="text-xs text-slate-400 font-semibold block">ORDER STATUS</span>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  Customer Profile
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Email:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedOrder.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Phone:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedOrder.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  Shipping Logistics
                </h4>
                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 font-medium block">Destination Address:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5 text-indigo-500" />
                Line Itemized Products
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-55 bg-slate-50/70 dark:bg-slate-900/70 font-bold text-slate-500 dark:text-slate-400">
                      <th className="px-4 py-3">Product Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="dark:text-slate-300">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-slate-50/50 dark:bg-slate-950/30 font-bold border-t border-slate-200 dark:border-slate-800 text-sm">
                      <td colSpan={3} className="px-4 py-3 text-right text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invoiced:</td>
                      <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Payment: {getPaymentBadge(selectedOrder.paymentStatus)}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close Specification
                </button>
                <button
                  type="button"
                  onClick={simulatePrintInvoice}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Order Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Order Record"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete order records for <span className="font-bold text-slate-800 dark:text-white">"{orderToDelete?.orderNumber}"</span>? 
            This action will erase the customer transaction log from the dashboard registry.
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
