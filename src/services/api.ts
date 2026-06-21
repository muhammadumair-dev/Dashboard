import axios from 'axios';
import { Product, Category, Warranty, Order, Review, InventoryLog } from '../types';
import { 
  initialProducts, 
  initialCategories, 
  initialWarranties, 
  initialOrders, 
  initialReviews, 
  initialInventoryLogs 
} from '../utils/mockData';

// Simulated database stored in memory
let dbProducts = [...initialProducts];
let dbCategories = [...initialCategories];
let dbWarranties = [...initialWarranties];
let dbOrders = [...initialOrders];
let dbReviews = [...initialReviews];
let dbInventoryLogs = [...initialInventoryLogs];

// Artificial latency to show off loading skeletons
const LATENCY = 400;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Axios demo: We can fetch system metrics or user profile to demonstrate actual Axios calls
export const fetchSystemStatus = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    // If successful, return a mock server status
    return {
      serverOnline: true,
      ping: '24ms',
      apiGateway: 'Operational',
      demoTodoFetched: response.data.title,
      databaseType: 'Simulated In-Memory Persistent Database'
    };
  } catch (error) {
    console.error("Axios demo fetch failed:", error);
    return {
      serverOnline: true,
      ping: '98ms',
      apiGateway: 'Degraded',
      demoTodoFetched: 'Fallback cache',
      databaseType: 'Local Mock Database'
    };
  }
};

export const api = {
  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    await delay(LATENCY);
    return [...dbProducts];
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await delay(LATENCY);
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    dbProducts.unshift(newProduct);
    
    // Log inventory creation
    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      type: 'Restock',
      quantityChanged: newProduct.quantity,
      newQuantity: newProduct.quantity,
      reason: 'Product created and initial stock added',
      date: new Date().toISOString()
    };
    dbInventoryLogs.unshift(log);

    return newProduct;
  },
  updateProduct: async (id: string, updatedFields: Partial<Product>): Promise<Product> => {
    await delay(LATENCY);
    const index = dbProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const oldProduct = dbProducts[index];
    const newProduct = { ...oldProduct, ...updatedFields };
    dbProducts[index] = newProduct;

    // Check if quantity changed to log in inventory
    if (updatedFields.quantity !== undefined && updatedFields.quantity !== oldProduct.quantity) {
      const difference = updatedFields.quantity - oldProduct.quantity;
      const log: InventoryLog = {
        id: `log-${Date.now()}`,
        productId: id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: difference > 0 ? 'Restock' : 'Decrease',
        quantityChanged: difference,
        newQuantity: newProduct.quantity,
        reason: updatedFields.description?.slice(0, 40) || 'Stock manually updated during product edit',
        date: new Date().toISOString()
      };
      dbInventoryLogs.unshift(log);
    }

    return newProduct;
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    await delay(LATENCY);
    const index = dbProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    dbProducts.splice(index, 1);
    return true;
  },

  // CATEGORIES
  getCategories: async (): Promise<Category[]> => {
    await delay(LATENCY);
    return [...dbCategories];
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    await delay(LATENCY);
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    dbCategories.unshift(newCategory);
    return newCategory;
  },
  updateCategory: async (id: string, updatedFields: Partial<Category>): Promise<Category> => {
    await delay(LATENCY);
    const index = dbCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    const newCategory = { ...dbCategories[index], ...updatedFields };
    dbCategories[index] = newCategory;
    return newCategory;
  },
  deleteCategory: async (id: string): Promise<boolean> => {
    await delay(LATENCY);
    const index = dbCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    dbCategories.splice(index, 1);
    return true;
  },

  // WARRANTIES
  getWarranties: async (): Promise<Warranty[]> => {
    await delay(LATENCY);
    return [...dbWarranties];
  },
  createWarranty: async (warranty: Omit<Warranty, 'id'>): Promise<Warranty> => {
    await delay(LATENCY);
    const newWarranty: Warranty = {
      ...warranty,
      id: `war-${Date.now()}`
    };
    dbWarranties.unshift(newWarranty);
    return newWarranty;
  },
  updateWarranty: async (id: string, updatedFields: Partial<Warranty>): Promise<Warranty> => {
    await delay(LATENCY);
    const index = dbWarranties.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Warranty not found');
    const newWarranty = { ...dbWarranties[index], ...updatedFields };
    dbWarranties[index] = newWarranty;
    return newWarranty;
  },
  deleteWarranty: async (id: string): Promise<boolean> => {
    await delay(LATENCY);
    const index = dbWarranties.findIndex(w => w.id === id);
    if (index === -1) return false;
    dbWarranties.splice(index, 1);
    return true;
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    await delay(LATENCY);
    return [...dbOrders];
  },
  updateOrderStatus: async (id: string, status: Order['orderStatus']): Promise<Order> => {
    await delay(LATENCY);
    const index = dbOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    dbOrders[index].orderStatus = status;
    
    // If order is delivered, update payment status if unpaid, etc.
    if (status === 'Delivered') {
      dbOrders[index].paymentStatus = 'Paid';
    } else if (status === 'Cancelled') {
      dbOrders[index].paymentStatus = 'Refunded';
      // Restock products from cancelled order
      for (const item of dbOrders[index].items) {
        const prodIndex = dbProducts.findIndex(p => p.id === item.productId);
        if (prodIndex !== -1) {
          const product = dbProducts[prodIndex];
          product.quantity += item.quantity;
          if (product.status === 'Out of Stock') product.status = 'Active';
          
          // Log restock
          dbInventoryLogs.unshift({
            id: `log-${Date.now()}-${item.productId}`,
            productId: item.productId,
            productName: product.name,
            sku: product.sku,
            type: 'Restock',
            quantityChanged: item.quantity,
            newQuantity: product.quantity,
            reason: `Order ${dbOrders[index].orderNumber} Cancelled - Restocked items`,
            date: new Date().toISOString()
          });
        }
      }
    }
    return dbOrders[index];
  },
  deleteOrder: async (id: string): Promise<boolean> => {
    await delay(LATENCY);
    const index = dbOrders.findIndex(o => o.id === id);
    if (index === -1) return false;
    dbOrders.splice(index, 1);
    return true;
  },

  // REVIEWS / COMMENTS
  getReviews: async (): Promise<Review[]> => {
    await delay(LATENCY);
    return [...dbReviews];
  },
  updateReviewStatus: async (id: string, status: Review['status']): Promise<Review> => {
    await delay(LATENCY);
    const index = dbReviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Review not found');
    dbReviews[index].status = status;
    return dbReviews[index];
  },
  deleteReview: async (id: string): Promise<boolean> => {
    await delay(LATENCY);
    const index = dbReviews.findIndex(r => r.id === id);
    if (index === -1) return false;
    dbReviews.splice(index, 1);
    return true;
  },

  // INVENTORY
  getInventoryLogs: async (): Promise<InventoryLog[]> => {
    await delay(LATENCY);
    return [...dbInventoryLogs];
  },
  adjustStock: async (productId: string, amount: number, reason: string): Promise<Product> => {
    await delay(LATENCY);
    const index = dbProducts.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    
    const product = dbProducts[index];
    const oldQty = product.quantity;
    const newQty = Math.max(0, oldQty + amount);
    
    product.quantity = newQty;
    product.status = newQty === 0 ? 'Out of Stock' : product.status === 'Out of Stock' ? 'Active' : product.status;
    
    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      productId,
      productName: product.name,
      sku: product.sku,
      type: amount > 0 ? 'Increase' : 'Decrease',
      quantityChanged: amount,
      newQuantity: newQty,
      reason,
      date: new Date().toISOString()
    };
    
    dbInventoryLogs.unshift(log);
    return product;
  }
};
