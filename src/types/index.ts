export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number;
  quantity: number;
  description: string;
  category: string; // Category name
  status: 'Active' | 'Draft' | 'Out of Stock';
  image: string;
  warrantyId: string; // Assigned warranty ID
  variants: string[]; // e.g. ["Black", "Silver", "128GB", "256GB"]
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export interface Warranty {
  id: string;
  name: string;
  duration: string; // e.g. "12 Months", "2 Years"
  type: 'Manufacturer' | 'Extended' | 'Lifetime';
  status: 'Active' | 'Inactive';
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  orderDate: string;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  totalAmount: number;
  items: OrderItem[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  reviewText: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'Increase' | 'Decrease' | 'Restock' | 'Sale';
  quantityChanged: number;
  newQuantity: number;
  reason: string;
  date: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
